# Plan — Sistema de Pagos Resiliente con Mercado Pago

---

## Objetivo

Diseñar un sistema de pagos robusto para Mercado Pago que **no dependa exclusivamente del Webhook/IPN**, evitando pérdidas de créditos cuando una notificación no llega.

El objetivo es garantizar que **un pago aprobado en Mercado Pago siempre termine reflejado correctamente en la base de datos**, incluso si:

- el webhook nunca llega
- el servidor está caído
- ngrok deja de funcionar
- el usuario cierra el navegador
- existen demoras en las notificaciones

---

## Contexto del proyecto

La aplicación vende créditos. Cada compra agrega créditos al usuario. Los créditos se utilizan para desbloquear PDFs.

Toda la lógica de créditos ya posee protección contra doble clic, múltiples pestañas, dos dispositivos, peticiones repetidas, race conditions y actualizaciones atómicas.

El siguiente problema a resolver es la **sincronización con Mercado Pago**.

---

## Problema detectado

### Flujo actual (frágil)

```
Usuario paga → Mercado Pago envía Webhook → Mi servidor recibe el Webhook → Actualizo la base de datos
```

Si el Webhook nunca llega: Mercado Pago tiene Pago = APPROVED, mi sistema tiene Pago = PENDING. El usuario pagó correctamente pero nunca recibe sus créditos.

---

## Problemas conocidos de Mercado Pago

### 1. Las notificaciones no están garantizadas

Puede fallar por timeout, error HTTP, servidor apagado, ngrok cerrado o con URL cambiada, reinicio del servidor. Los reintentos de MP no son infinitos.

### 2. En modo TEST el comportamiento es diferente

Las credenciales de prueba no reproducen exactamente producción. Muchos desarrolladores reportan webhooks que nunca llegan. MP recomienda usar el simulador de notificaciones.

### 3. IPN está siendo reemplazado

La documentación actual recomienda **Webhooks** (con firma x-signature, mayor seguridad, soporte futuro).

### 4. ngrok agrega otra posible falla

Si ngrok se reinicia, cambia la URL, o la PC está apagada → el Webhook se pierde.

---

## Principio de diseño

> El **Webhook** únicamente **acelera** la sincronización.
> Nunca debe ser el único mecanismo de actualización.
> La única fuente de verdad es la **API de Mercado Pago**.

---

## Arquitectura resiliente — 3 mecanismos independientes

### Mecanismo 1 — Webhook (camino normal, acelerador)

```
Webhook recibido
    ↓
Consultar Payment API de MP  (nunca confiar solo en el body del webhook)
    ↓
Si APPROVED → Acreditar créditos + actualizar DB
```

### Mecanismo 2 — Polling desde back_url (Fallback 1)

Cuando el usuario termina de pagar, MP lo redirige a /pago-exitoso?payment_id=...&status=approved.

En esa página:
- Mostrar "Procesando pago..."
- Llamar syncPaymentServer({ paymentId }) inmediatamente
- Si APPROVED → "¡Créditos acreditados!" + ir al inicio
- Si aún PENDING → reintentar cada 2s (máx 10 intentos)
- Si agota reintentos → "Estamos procesando tu pago, te avisaremos"

Cubre el caso donde el webhook nunca llega pero el usuario sigue en la app.

### Mecanismo 3 — Job periódico (Fallback 2)

Cada 60 segundos, buscar en DB todos los pagos con status = pending creados en las últimas 24 horas y para cada uno:
- Consultar GET /v1/payments/{mpPaymentId} en MP
- Si APPROVED → Acreditar créditos + actualizar DB
- Si FAILED/CANCELLED → Marcar como failed

Recupera pagos perdidos incluso si el usuario cerró el navegador.

---

## Reglas de implementación

### Idempotencia absoluta

La tabla credit_history ya tiene idempotencia por paymentId — no se puede acreditar dos veces el mismo pago.

### Nunca acreditar directo desde el Webhook

```
MALO:  Webhook → acreditar créditos
BUENO: Webhook → consultar API de MP → validar estado → acreditar
```

### El estado oficial siempre viene de MP

GET https://api.mercadopago.com/v1/payments/{id}

---

## Flujo completo

```
Usuario compra
    ↓
Crear Preferencia en MP
    ↓
Guardar en DB: pending_payments { preferenceId, userId, planId, status: "pending" }
    ↓
Usuario paga en MP
    ↓
              Webhook llega             Webhook no llega
                    ↓                         ↓
          Consultar API MP          Usuario vuelve a /pago-exitoso
                    ↓                         ↓
          Si APPROVED:               Polling cada 2s → Consultar API MP
          Acreditar créditos         Si APPROVED: Acreditar créditos
                    ↓                         ↓
                    ├─────────────────────────┤
                              ↓
                     Pago sincronizado ✓

En paralelo siempre:
Job cada 60s → busca pending → consulta MP → acredita si approved
```

---

## Plan de implementación

### PASO 1 — Nueva tabla pending_payments

**Archivo nuevo:** db/payments/schema.ts

```ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "../users/schema"

export const pendingPayments = pgTable("pending_payments", {
  id: text("id").primaryKey(),               // preferenceId de MP
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  planId: text("plan_id").notNull(),
  mpPaymentId: text("mp_payment_id"),        // se llena cuando se conoce el paymentId real
  status: text("status", {
    enum: ["pending", "approved", "failed"],
  })
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
```

**Modificar:** db/schema.ts → agregar export * from "./payments/schema"

**Ejecutar:** pnpm db:push

---

### PASO 2 — Función core syncPayment (utilidad interna)

**Archivo nuevo:** server/mercadopago/sync-payment.ts

Responsabilidades:
- Recibe un paymentId (número)
- Consulta GET /v1/payments/{id} en la API de MP
- Si approved: llama creditUser() (ya idempotente) + actualiza pending_payments
- Si rejected/cancelled: actualiza pending_payments.status = "failed"
- Retorna { status, credits? }

Esta función es la **única fuente de lógica de sincronización**. Los 3 mecanismos la invocan.

---

### PASO 3 — Server Function pública syncPaymentServer

**Archivo nuevo:** server/mercadopago/sync-payment-server.ts

```ts
export const syncPaymentServer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { paymentId: number }) => d)
  .handler(async ({ data }) => syncPayment(data.paymentId))
```

Requiere sesión válida.

---

### PASO 4 — Modificar createPreferenceServer

**Archivo:** server/mercadopago/create-preference-server.ts

Cambios:
1. Después de preference.create(), insertar en pending_payments
2. Cambiar back_urls.success a ${baseUrl}/pago-exitoso

```ts
await db.insert(pendingPayments).values({
  id: result.id!,         // preferenceId
  userId: session.user.id,
  planId: data.planId,
  status: "pending",
})
// back_urls:
success: `${baseUrl}/pago-exitoso`,
```

---

### PASO 5 — Modificar webhook.ts

**Archivo:** server/mercadopago/webhook.ts

Reemplazar la lógica inline de processPaymentId para que use syncPayment() en vez de tener lógica duplicada. El webhook pasa a ser solo un disparador que llama la función core.

---

### PASO 6 — Job periódico runBackgroundSync

**Archivo nuevo:** server/mercadopago/background-sync.ts

```ts
export async function runBackgroundSync(): Promise<void> {
  // 1. Buscar pending_payments con status = "pending" y createdAt > hace 24h
  // 2. Para cada uno: syncPayment(Number(mpPaymentId)) si existe
  // 3. Loguear resultados con [MP-SYNC] prefix
}
```

---

### PASO 7 — API Route para el job

**Archivo nuevo:** src/routes/api/sync-payments.ts

GET /api/sync-payments protegido por header x-sync-secret. Para uso de Netlify cron o llamadas externas.

---

### PASO 8 — Vite Plugin para dev (job local cada 60s)

**Archivo:** vite.config.ts

Plugin inline con configureServer que inicia setInterval de 60 segundos llamando runBackgroundSync. Se detiene al cerrar el servidor.

---

### PASO 9 — Página /pago-exitoso

**Archivo nuevo:** src/routes/_protected/pago-exitoso.tsx

Search params de MP: payment_id, preference_id, status, collection_status, merchant_order_id.

Lógica:
- Si status !== "approved" → mensaje de error/pendiente
- Si status === "approved":
  1. Spinner "Procesando tu pago..."
  2. Llamar syncPaymentServer({ paymentId: Number(payment_id) })
  3. Si approved → "¡Créditos acreditados!" + botón al inicio
  4. Si pending → reintentar cada 2s, máx 10 veces
  5. Si agota reintentos → "Tu pago está siendo procesado, los créditos estarán disponibles en breve"

---

### PASO 10 — Env vars nuevas

Agregar a .env:
SYNC_SECRET=un-secreto-largo-y-random

---

## Archivos a crear/modificar

| Operación | Archivo |
|---|---|
| NEW | db/payments/schema.ts |
| MODIFY | db/schema.ts |
| NEW | server/mercadopago/sync-payment.ts |
| NEW | server/mercadopago/sync-payment-server.ts |
| MODIFY | server/mercadopago/create-preference-server.ts |
| MODIFY | server/mercadopago/webhook.ts |
| NEW | server/mercadopago/background-sync.ts |
| NEW | src/routes/api/sync-payments.ts |
| MODIFY | vite.config.ts |
| NEW | src/routes/_protected/pago-exitoso.tsx |
| MODIFY | .env |

---

## Beneficios de esta arquitectura

- Nunca se depende exclusivamente del Webhook
- Funciona correctamente incluso usando ngrok durante el desarrollo
- Si Mercado Pago demora la notificación, el usuario recibe sus créditos en /pago-exitoso
- Si el usuario cierra el navegador, el Job periódico termina sincronizando el pago
- Si llegan múltiples Webhooks, la lógica idempotente evita acreditar créditos duplicados
- La DB siempre termina reflejando el estado oficial de Mercado Pago

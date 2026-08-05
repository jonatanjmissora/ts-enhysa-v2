# Stack Reference — TanStack + TailwindCSS + TypeScript + Better Auth + Drizzle

> Versiones basadas en `package.json` del proyecto. Siempre verificar `node_modules/` para la API exacta.

## React 19

```tsx
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { use, Suspense, lazy, startTransition, useOptimistic, useActionState } from "react"
```

- `use(promise)` — unwraps promise in render (con Suspense).
- `useActionState` — reemplaza `useFormState` para server actions.
- `startTransition` — marca actualizaciones como no urgentes.

## TypeScript 5.7

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## TailwindCSS v4

- Configuración vía CSS, no `tailwind.config.ts`.
- `@tailwindcss/vite` plugin en Vite.
- Sintaxis: `@import "tailwindcss"` en CSS principal.
- Variantes: `dark:`, `hover:`, `focus-visible:`, `data-*`.
- Uso: `className="flex gap-4 p-4 bg-zinc-900 text-white rounded-xl"`.
- Animaciones: `animate-spin`, `animate-pulse`, etc. via `tw-animate-css`.

## TanStack React Start v1.132+

```ts
import { createServerFn, createMiddleware } from "@tanstack/react-start"
```

### Server Function (GET)
```ts
export const getData = createServerFn({ method: "GET" }).handler(
  async () => {
    return await getDataDb()
  }
)
```

### Server Function (POST con validación)
```ts
export const saveData = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; data: SomeType }) => d)
  .handler(async ({ data }) => {
    return await saveDataDb(data.id, data.data)
  })
```

### Middleware
```ts
import { createMiddleware } from "@tanstack/react-start"

const authMiddleware = createMiddleware({ type: "function" })
  .server(async ({ next }) => {
    const session = await getSession()
    if (!session) throw redirect({ to: "/" })
    return next({ context: { session } })
  })

export const protectedFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // context.session available
  })
```

### Request helpers
```ts
import { getRequest } from "@tanstack/react-start/server"
```

## TanStack React Router v1.132+

```ts
import { createFileRoute, createRouter, Link, useNavigate, useRouter } from "@tanstack/react-router"
import { linkOptions } from "@tanstack/react-router"
```

### Ruta de archivo
```ts
export const Route = createFileRoute("/ruta")({
  component: RouteComponent,
  loader: async () => { return data },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error }) => <div>Error</div>,
})

function RouteComponent() {
  const data = Route.useLoaderData()
  return <div>{data}</div>
}
```

### Ruta raíz (__root.tsx)
```ts
export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

### Ruta anidada con layout
```ts
export const Route = createFileRoute("/_layout")({
  component: ({ children }) => <Layout><Outlet /></Layout>,
})
// Routes: /_layout/child.tsx → /child
```

### Search params tipados
```ts
const searchSchema = z.object({ page: z.number().default(1) })

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  component: Products,
})

// Uso: const { page } = Route.useSearch()
```

### Navegación
```ts
const navigate = useNavigate()
navigate({ to: "/path", params: { id: "123" }, search: { page: 1 } })

<Link to="/path/$id" params={{ id: "123" }} search={{ page: 1 }} />
```

### Router instance
```ts
const router = createRouter({
  routeTree,
  context: { queryClient, session: null },
  defaultPendingMs: 100,
  defaultPendingMinMs: 500,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 30_000,
  scrollRestoration: true,
})
```

### Server Function integration via `setupRouterSsrQueryIntegration`
```ts
setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })
```

## TanStack React Query v5.66+

```ts
import { useQuery, useSuspenseQuery, useMutation, useQueryClient, queryOptions, infiniteQueryOptions } from "@tanstack/react-query"
import { usePrefetchQuery } from "@tanstack/react-query"
```

### useSuspenseQuery (recomendado con Suspense)
```ts
const { data } = useSuspenseQuery({
  queryKey: ["key", param],
  queryFn: () => fetchFn(param),
})
// data NO es undefined (siempre definido)
```

### useQuery
```ts
const { data, isLoading, error } = useQuery({
  queryKey: ["key", param],
  queryFn: () => fetchFn(param),
  staleTime: 1000 * 60 * 5,
  enabled: !!param,
})
```

### useMutation
```ts
const mutation = useMutation({
  mutationFn: (data: Input) => saveToServer(data),
  onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["key"] }) },
})

mutation.mutate({ name: "test" })
```

### queryOptions (factory tipada)
```ts
export const postOptions = (id: string) => queryOptions({
  queryKey: ["post", id],
  queryFn: () => fetchPost(id),
})
```

### QueryClientProvider setup
```tsx
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query"
```

### Prefetching
```ts
usePrefetchQuery({ queryKey: ["key"], queryFn: () => fetchData() })
```

## TanStack React Form v1.0+

```ts
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
```

### Formulario básico
```ts
const form = useForm({
  defaultValues: { name: "", email: "" },
  validators: { onChange: z.object({...}) },
  onSubmit: async ({ value }) => { await submit(value) },
})
```

### Field pattern
```tsx
<form.Field name="email" children={(field) => {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      />
      {isInvalid && <span>{field.state.meta.errors.join(", ")}</span>}
    </div>
  )
}} />
```

Submit: `form.handleSubmit()` (llamado desde `onSubmit` del `<form>` con `e.preventDefault()`).

## Better Auth v1.4+

### Server
```ts
import { betterAuth } from "better-auth"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { clientId: "...", clientSecret: "..." },
  },
  plugins: [tanstackStartCookies()],
  database: drizzleAdapter(db, { provider: "pg", schema: { user, account, session, verification } }),
})
```

### Cliente
```ts
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL,
})

// Sign up/in
await authClient.signUp.email({ email, password, name, callbackURL: "/" })
await authClient.signIn.email({ email, password, callbackURL: "/" })
await authClient.signIn.social({ provider: "google", callbackURL: "/" })

// Session
await authClient.getSession()
await authClient.signOut()
```

### Server-side session
```ts
const request = getRequest()
const session = await auth.api.getSession({ headers: request.headers })
```

## Drizzle ORM v0.45+

```ts
import { pgTable, text, jsonb, timestamp, integer, boolean, uuid } from "drizzle-orm/pg-core"
import { eq, and, or, sql, asc, desc, ilike, inArray, isNull, isNotNull } from "drizzle-orm"
```

### Schema
```ts
export const table = pgTable("table_name", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").$type<SomeType>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})
```

### CRUD
```ts
import { db } from "../index"
import { table } from "../schema"

// Read
await db.select().from(table).where(eq(table.id, id))

// Create
await db.insert(table).values({ id, name, data })

// Update
await db.update(table).set({ name }).where(eq(table.id, id))

// Delete
await db.delete(table).where(eq(table.id, id))

// Filtros compuestos
await db.select().from(table).where(and(eq(table.id, id), isNotNull(table.name)))
await db.select().from(table).where(ilike(table.name, `%${query}%`))

// Orden
await db.select().from(table).orderBy(asc(table.name))

// Joins
await db.select().from(table).leftJoin(otherTable, eq(table.id, otherTable.tableId))
```

### Adapters
```ts
import { drizzle } from "drizzle-orm/node-postgres"    // Servidor Node
import { drizzle } from "drizzle-orm/neon-http"        // Neon serverless
```

Conexión: `drizzle(process.env.DATABASE_URL as string, { schema })`.

---

## Best practices

- Usar `useSuspenseQuery` en lugar de `useQuery` para evitar checks de `undefined` en `data`.
- Server Functions con `inputValidator` para validación tipada antes del handler.
- Middleware con `createMiddleware` para auth reutilizable.
- Formularios con `@tanstack/react-form` + Zod + UI components.
- Drizzle: `db.update()` con `$onUpdate()` auto-maneja `updatedAt`.
- Tailwind v4: usar `@import "tailwindcss"` en CSS, no config file.
- Las rutas TanStack Router son lazy-load por defecto.

## Demo User Pattern

El sistema de demo user permite probar la app sin registrarse, con datos aislados por sesión y límites anti-spam.

### Diseño

- Se crean hasta **5 demo users** simultáneos con emails secuenciales: `demo1@enhysa.demo`, `demo2@enhysa.demo`, etc.
- Cada sesión demo tiene su propio `userId` → datos completamente aislados (privacidad).
- TTL de **24 horas**: al solicitar un nuevo demo user, se borran los demo users con `createdAt < now() - 24h` (y sus datos en cascada).
- Al cerrar sesión, `resetDemoDataServer` solo borra datos si es la **única sesión activa** del demo user (cuenta sesiones en tabla `session` con `expiresAt > now()`).
- Si hay otra sesión activa del mismo demo user, no se borra nada, para no interrumpir a otro usuario.

### Reglas de negocio requeridas

- Un demo user **no puede comprar créditos**.
- En `src/routes/_protected/checkout.tsx`, al hacer click en `Pagar con Mercado Pago`, se debe verificar si la cuenta es demo. Si lo es, no se crea preferencia y se muestra un mensaje o `sonner` indicando que debe iniciar sesión con un usuario real para comprar créditos.
- En `src/components/reportes/iluminacion/pdf/my-document.tsx` y `src/components/reportes/iluminacion/pdf/my-document-reducida.tsx`, si la cuenta es demo, el botón `Desbloquear PDF (1 crédito)` debe reemplazarse por este mensaje:
  `Version Demo, debe loguearse para generar informes descargables. Logueate con tus datos`.
- Las credenciales demo no deben ser triviales. La contraseña deseada es un código aleatorio de 4 dígitos entre `0000` y `9999`.

### Estado actual verificado

- `server/seed-demo-user-server.ts` hoy crea passwords débiles y predecibles: `demo1`, `demo2`, etc.
- `src/routes/_protected/checkout.tsx` hoy no bloquea la compra de créditos para usuarios demo antes de llamar a Mercado Pago.
- `src/components/reportes/iluminacion/pdf/my-document.tsx` y `src/components/reportes/iluminacion/pdf/my-document-reducida.tsx` hoy muestran el flujo normal de desbloqueo y no reemplazan el CTA por un mensaje específico para demo users.
- La eliminación de demo users **sí está implementada** mediante `db.delete(user)` en `server/reset-demo-data-server.ts` y `server/seed-demo-user-server.ts`.
- Esa eliminación depende de `ON DELETE CASCADE` y hoy alcanza a `session`, `account`, `user_credits`, `credit_history`, `pending_payments`, `tecnicos`, `empresas`, `instrumentos`, `reportes_iluminacion`, `areas_iluminacion` y `localizadas_iluminacion`.
- La limpieza por logout ocurre solo si la sesión actual es la única sesión activa del demo user.
- La limpieza por TTL ocurre recién cuando se solicita un nuevo demo user.
- Riesgo actual: `ensureDemoUser()` calcula el próximo email con `activeCount + 1`, lo que puede reutilizar un slot ocupado si existen huecos (`demo1`, `demo3`, etc.) y terminar en colisión por email único.

### Server Functions

```ts
// server/seed-demo-user-server.ts
export const ensureDemoUser = createServerFn({ method: "GET" }).handler(async () => {
  // 1. Borrar demo users con createdAt < hace 24h (cascade)
  // 2. Contar demo users activos restantes
  // 3. Si < 5: crear nuevo user + account con email demo{N}@enhysa.demo, password temporal
  // 4. Si >= 5: devolver error
})

// server/reset-demo-data-server.ts
export const resetDemoData = createServerFn({ method: "POST" }).handler(async () => {
  // 1. Verificar sesión actual
  // 2. Contar sesiones activas del demo userId (expiresAt > now())
  // 3. Si count > 1: no borrar (hay otro usuario activo)
  // 4. Si count === 1: borrar todos los datos del userId
})
```

### Password Hashing

```ts
import { randomBytes, scrypt } from "node:crypto"
const salt = randomBytes(16).toString("hex")
const key = await new Promise<Buffer>((resolve, reject) =>
  scrypt(password.normalize("NFKC"), salt, 64, { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 }, (err, key) =>
    err ? reject(err) : resolve(key)
  )
)
// Formato: "${salt}:${key.toString("hex")}"
// maxmem: 64MB evita ERR_SSL_MEMORY_LIMIT_EXCEEDED
```

### UI Integration

- **login-form.tsx**: botón "Demo — Probar sin registrarse" → `ensureDemoUser()` → muestra modal con credenciales → al confirmar, `authClient.signIn.email()`.
- **suscripciones.tsx**: card "Prueba Gratis" → redirige a `/login` para que el usuario use el botón demo desde allí.
- **navbar.tsx**: `LogoutAlertDialog` → si es demo user, `resetDemoDataServer()` + `authClient.signOut()`.
- **demo-credentials-modal.tsx**: modal que muestra email/password al usuario para que pueda usarlos desde otro dispositivo.

### Créditos

- Hoy los demo users no tienen créditos en la práctica porque no se les cargan filas en `user_credits`, y `getUserCreditsServer` devuelve `0` cuando no encuentra saldo.
- Regla requerida: un demo user no debe poder iniciar compras de créditos ni desbloquear PDFs descargables.

### Archivos relevantes

- `server/seed-demo-user-server.ts`
- `server/reset-demo-data-server.ts`
- `server/credits/get-user-credits-server.ts`
- `src/components/login-form.tsx`
- `src/components/suscripciones.tsx`
- `src/components/navbar.tsx`
- `src/components/demo-credentials-modal.tsx`
- `src/routes/_protected/checkout.tsx`
- `src/components/reportes/iluminacion/pdf/my-document.tsx`
- `src/components/reportes/iluminacion/pdf/my-document-reducida.tsx`

## Credit Unlock — Read-Only Report Policy

### Problema

Al desbloquear un PDF con 1 crédito, el `unlocked` quedaba asociado al `reporteId`. Si el usuario modificaba todos los datos del reporte (áreas, mediciones, localizadas, etc.) después del unlock, podía descargar un PDF completamente nuevo sin gastar otro crédito → múltiples informes por 1 crédito.

### Solución elegida (Opción 2)

Una vez que un reporte se desbloquea (crédito consumido), pasa a ser **solo-lectura**:

- Mientras el reporte **no esté desbloqueado**, el usuario puede modificarlo libremente (prueba y error con PDF con marca de agua)
- Una vez desbloqueado, el usuario **no puede modificar** ningún dato del reporte (datos generales, áreas, mediciones, localizadas, imágenes, etc.)
- Solo puede **eliminar** el reporte completo
- Si encuentra un error y necesita modificar algo, debe contactar a los desarrolladores mediante un ticket
- Los desarrolladores evalúan el caso y, si corresponde, otorgan un crédito extra o desbloquean manualmente el reporte desde la base de datos

### Implementación

- Al hacer click en "Desbloquear PDF" (consumir crédito), el server marca `reporte.credito_usado = true` en la DB
- En el `_menu/route.tsx` del reporte, el loader verifica `credito_usado`:
  - Si `true` → los botones de edición (general, áreas, mediciones, localizadas) se ocultan o deshabilitan
  - Solo queda visible el botón de "Eliminar reporte"
- Los CRUD routes también deben verificar este flag y redirigir o mostrar error si se intenta acceder directamente
- El botón "Generar PDF" y las vistas PDF (completa/reducida) siguen funcionando normalmente

### Archivos relevantes

- Esquema DB: columna `credito_usado` en tabla `reportes`
- `src/routes/_protected/iluminacion/reportes/[$id]/_menu/route.tsx` — ocultar ediciones si `credito_usado`
- `src/routes/_protected/iluminacion/reportes/[$id]/_CRUD/` — cada ruta CRUD debe rechazar acceso si `credito_usado`
- Server function de unlock: setea `credito_usado = true`

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Mercado Pago — Checkout Pro + Créditos

> Integración completa de Checkout Pro con acreditación de créditos vía webhook + polling desde `/pago-exitoso` + sync bajo demanda.

### Planes y precios (producción)

| Plan | Precio (ARS) | Créditos |
|---|---|---|
| Por Informe | 15 | 1 |
| Mensual | 50 | 7 |
| Anual | 500 | 100 |

### Env vars

```
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxx  # mismo en test y prod (modo prueba/producción desde el panel)
MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxx
MERCADO_PAGO_WEBHOOK_SECRET=           # desde panel → Webhooks → Clave secreta
BETTER_AUTH_BASE_URL=                  # usado para back_urls y notification_url
```

### Producción real validada (Enhysa v2)

1. Obtener credenciales de producción desde `https://www.mercadopago.com.ar/developers/panel/app`
2. Copiar `MERCADO_PAGO_ACCESS_TOKEN` y `MERCADO_PAGO_PUBLIC_KEY` reales (`APP_USR`)
3. Configurar el webhook de producción con el dominio real:
   `https://enhysav2.netlify.app/api/mercadopago/webhook`
4. Cargar las variables en Netlify
5. Agregar logs temporales para inspeccionar la creación de la preferencia, `init_point` y `notification_url`
6. Revisar esos logs en Netlify → `Logs` → `Functions` → `@netlify/vite-plugin server handler`

Con estos pasos quedó validado que Checkout Pro funciona en producción con datos y pagos reales.

### Principio de diseño

> El **Webhook** únicamente **acelera** la sincronización. Nunca debe ser el único mecanismo de actualización.
> La única fuente de verdad es la **API de Mercado Pago** (`GET /v1/payments/{id}`).
> Nunca acreditar directo desde el body del webhook — siempre consultar la API de MP para validar estado.

### Arquitectura resiliente — 3 mecanismos independientes

**Mecanismo 1 — Webhook (acelerador)**
```
Webhook recibido (IPN query params o Webhook JSON body)
    ↓
syncPayment(paymentId)
    ↓
Consultar GET /v1/payments/{id} en MP
    ↓
Si APPROVED → creditUser() (idempotente por paymentId) + update pending_payments
```

**Mecanismo 2 — Polling desde `/pago-exitoso` (fallback post-pago)**
```
Usuario paga → MP redirige a /pago-exitoso?payment_id=...&status=approved
    ↓
syncPaymentServer({ paymentId }) → syncPayment(paymentId)
    ↓
Si APPROVED → "¡Créditos acreditados!" + ir al inicio
Si aún PENDING → reintentar cada 2s (máx 10)
Si agota reintentos → "Estamos procesando tu pago, te avisaremos"
```

**Mecanismo 3 — Sync bajo demanda (syncPendingPayments)**
```
Componente necesita créditos (Navbar, Suscripciones, PDF unlock)
    ↓
syncPendingPayments(userId)
    ↓
SELECT status='pending' FROM pending_payments WHERE userId = ?
    ↓
Si hay pendientes → syncPayment(Number(mpPaymentId)) por cada uno
    ↓
Acredita si APPROVED, Sonner si hubo cambios
Si no hay pendientes → termina (0 consultas externas)
```

### Archivos del proyecto

- `server/mercadopago/config.ts` — Inicializa `MercadoPagoConfig` con `MERCADO_PAGO_ACCESS_TOKEN`.
- `server/mercadopago/test-conection.ts` — Test de conectividad con MP.
- `server/mercadopago/create-preference-server.ts` — Crea preferencia Checkout Pro. Inserta `pending_payments`. Redirige a `/pago-exitoso` via `back_urls.success`.
- `server/mercadopago/webhook.ts` — Handler dual IPN + Webhook. Llama `syncPayment()`.
- `server/mercadopago/sync-payment.ts` — **Core**: consulta API de MP, acredita créditos si approved, actualiza `pending_payments`. Idempotente.
- `server/mercadopago/sync-payment-server.ts` — Server function pública (POST, auth requerida). Llama `syncPayment()`.
- `server/mercadopago/sync-pending-payments.ts` — Busca `pending_payments` del userId, llama `syncPayment()` por cada uno. Retorna resumen.
- `server/mercadopago/sync-pending-payments-server.ts` — Server function GET protegida para sync bajo demanda.
- `db/payments/schema.ts` — Tabla `pending_payments` (preferenceId PK, userId, planId, mpPaymentId, status, timestamps).
- `db/credits/schema.ts` — Tabla `user_credits` y `credit_history`.
- `src/routes/api/mercadopago/webhook.ts` — Ruta API que expone webhook (GET + POST).
- `src/routes/_protected/checkout.tsx` — UI de checkout.
- `src/routes/_protected/pago-exitoso.tsx` — Página post-pago con polling.

### Dónde llamar syncPendingPayments

| Componente | Cuándo |
|---|---|
| **Suscripciones** | Antes de mostrar créditos del usuario |
| **Navbar** | Antes de mostrar badge de créditos (solo si hay pendientes) |
| **PDF unlock** | Antes de decidir "no tenés créditos" |

Optimización: el 99% de las veces solo hace un SELECT barato a la DB (status pending = 0 filas → termina). Solo consulta MP si hay pendientes.

### Flujo de pago completo

1. Usuario va a `/checkout?plan=por-informe`
2. Click "Pagar con MP" → `createPreferenceServer`:
   - Crea preferencia con `external_reference` (userId), `metadata.plan_id`, `notification_url`
   - Inserta `pending_payments { preferenceId, userId, planId, status: "pending" }`
   - Redirige a `init_point`
3. Usuario paga en MP
4. **M1** — MP envía IPN/Webhook → `syncPayment()` → acredita si approved
5. **M2** — MP redirige a `/pago-exitoso` → `syncPaymentServer()` → acredita si approved (polling 2s, máx 10)
6. **M3** — Componentes llaman `syncPendingPayments(userId)` → recupera pendientes olvidados

### Notas de implementación

- Las notificaciones IPN (`notification_url`) llegan como `GET` con query params. El handler expone GET y POST.
- En modo TEST (ngrok), las notificaciones pueden no llegar. El M2 y M3 cubren este caso.
- `syncPayment` es la única función que acredita créditos. Todos los mecanismos la invocan.
- `creditUser()` usa transacción atómica: upsert `user_credits` + insert `credit_history`.
- Idempotencia por `paymentId` en `credit_history` — doble acreditación imposible.
- El webhook siempre responde 200 inmediatamente antes de procesar.

### Testing con usuarios de prueba

**Seller**:
- User ID: `3573589436` / Usuario: `TESTUSER3026059714133907697` / Pass: `13Krt9DTHb`

**Buyer**:
- Usuario: `TESTUSER582536072844915181` / Pass: `ErldGKgSdv`

Procedimiento:
1. Ventana incógnito → loguearse como buyer test en `https://www.mercadopago.com.ar/developers`
2. En misma pestaña, ir al checkout de la app
3. Pagar con tarjeta test: `APRO` / `5031 7557 3453 0604` / `12/25` / `123`

**Tarjetas:**
| Tipo | Número | CVV | Vto |
|---|---|---|---|
| Mastercard crédito | `5031 7557 3453 0604` | `123` | `11/30` |
| Visa crédito | `4509 9535 6623 3704` | `123` | `11/30` |

**Códigos titular:**
| Nombre | Resultado |
|---|---|
| `APRO` | Aprobado |
| `OTHE` | Rechazado |
| `CONT` | Pendiente |

### Setup de desarrollo con Cloudflare Tunnel (recomendado)

> Recomendado sobre ngrok. Cloudflare Tunnel es más estable, no requiere URL dinámica, y las notificaciones de MP llegan consistentemente incluso en modo TEST.

1. `cloudflared tunnel --url http://localhost:3000` → copiar URL `https://xxxx.trycloudflare.com`
2. Actualizar `.env`: `BETTER_AUTH_URL`, `VITE_BETTER_AUTH_BASE_URL`, `BETTER_AUTH_BASE_URL`
3. Actualizar URL del webhook en panel MP (Tus integraciones → Webhooks)
4. `pnpm dev`
5. `server.allowedHosts: true` en `vite.config.ts`

**Alternativa ngrok** (menos estable para webhooks):
```bash
ngrok http 3000
```

### Implementado

- [x] `db/payments/schema.ts` — tabla `pending_payments` (preferenceId PK, userId, planId, mpPaymentId, status, timestamps)
- [x] Fix race condition en `creditUser()`: `ON CONFLICT DO NOTHING` con UNIQUE `(payment_id, type)` en `credit_history`. MP puede enviar notificaciones duplicadas simultáneas sin acreditar dos veces.
- [x] `server/mercadopago/sync-payment.ts` — core que consulta API de MP y acredita créditos
- [x] `server/mercadopago/sync-payment-server.ts` — server function POST protegida
- [x] `server/mercadopago/sync-pending-payments.ts` — busca pendientes en DB y sincroniza
- [x] `server/mercadopago/sync-pending-payments-server.ts` — server function GET protegida
- [x] `createPreferenceServer` modificado: inserta `pending_payments` + `back_urls.success` → `/pago-exitoso`
- [x] `webhook.ts` simplificado: delega en `syncPayment()`
- [x] `src/routes/_protected/pago-exitoso.tsx` — página post-pago con polling 2s (máx 10 intentos)
- [x] Webhook funciona correctamente con Cloudflare Tunnel (modo TEST y producción)
- [x] Flujo completo M1+M2 verificado: pago APRO → crédito acreditado
- [x] `syncPendingPaymentsServer` integrado en Navbar, Suscripciones, PDF completa y PDF reducida (sync on mount + invalidación `user-credits`)
- [x] Unlock de reporte (`unlock-reporte-server.ts`) solo setea `creditConsumed` + `creditConsumedAt` — `finishedAt` queda intacto
- [x] Producción real validada en Netlify con credenciales `APP_USR`, webhook real y revisión de logs de preferencia/init point

### Próximos pasos pendientes

- [x] Probar con planes Mensual y Anual

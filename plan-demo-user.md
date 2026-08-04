# Plan Demo User

## Objetivo

Documentar y preparar los cambios pendientes del sistema de demo users sin modificar código todavía.

`AGENTS.md` debe seguir siendo la fuente de verdad viva del proyecto. Este archivo funciona como plan puntual de trabajo para demo users.

## Reglas requeridas

1. Un usuario demo no debe poder comprar créditos.
2. Un usuario demo no debe ver el CTA normal de `Desbloquear PDF (1 crédito)`.
3. Las contraseñas demo no deben ser triviales; deben ser un código aleatorio de 4 dígitos entre `0000` y `9999`.
4. La eliminación de demo users debe quedar clara: cuándo ocurre, qué borra y qué depende de cascadas.

## Mensajes requeridos

### Checkout

Archivo objetivo: `src/routes/_with-header/checkout.tsx`

Comportamiento deseado:

- Al hacer click en `Pagar con Mercado Pago`, si la sesión pertenece a un demo user, no se debe llamar a `createPreferenceServer`.
- Debe mostrarse un mensaje o `sonner` indicando que debe iniciar sesión con una cuenta real para comprar créditos.

Texto sugerido:

`Debés iniciar sesión con un usuario real para comprar créditos.`

### PDFs

Archivos objetivo:

- `src/components/reportes/iluminacion/pdf/my-document.tsx`
- `src/components/reportes/iluminacion/pdf/my-document-reducida.tsx`

Comportamiento deseado:

- Si la sesión pertenece a un demo user, el botón `Desbloquear PDF (1 crédito)` debe reemplazarse por este mensaje:

`Version Demo, debe loguearse para generar informes descargables. Logueate con tus datos`

## Auditoría del estado actual

### 1. Compra de créditos en demo

Estado actual:

- `src/routes/_with-header/checkout.tsx` no verifica si la sesión es demo en `handlePay()`.
- Hoy un demo user puede llegar hasta la creación de preferencia si entra a checkout autenticado.

Gap detectado:

- Falta bloqueo UI explícito antes de `createPreferenceServer()`.
- Recomendación adicional: también bloquear del lado servidor en `createPreferenceServer` para no depender solo del frontend.

### 2. Desbloqueo de PDFs en demo

Estado actual:

- `my-document.tsx` y `my-document-reducida.tsx` muestran el flujo estándar de unlock cuando `reporte.creditConsumed === false`.
- No existe una variante especial para demo users.

Gap detectado:

- Falta reemplazar el CTA de unlock por el mensaje de limitación demo.
- Recomendación adicional: si más adelante se agrega lógica server-side específica para demo, `unlock-reporte-server` también debería rechazar demo users explícitamente.

### 3. Passwords demo

Estado actual:

- `server/seed-demo-user-server.ts` usa passwords predecibles: `demo1`, `demo2`, `demo3`, `demo4`, `demo5`.
- El email también es secuencial: `demo1@enhysa.demo`, etc.

Gap detectado:

- La contraseña es demasiado fácil de deducir.
- Se desea conservar el email secuencial, pero cambiar el password por un valor aleatorio de 4 dígitos.

Riesgo adicional detectado:

- `ensureDemoUser()` calcula el próximo slot como `activeCount + 1`.
- Si quedan huecos entre usuarios activos, puede intentar recrear un email ya existente y fallar por restricción `unique`.
- Conviene calcular el primer índice libre entre `1..5`, no derivarlo solo del conteo.

### 4. Eliminación de demo users y cascadas

Estado actual confirmado:

- `server/reset-demo-data-server.ts` elimina el registro de `user` cuando la sesión actual es la única activa.
- `server/seed-demo-user-server.ts` elimina demo users vencidos por TTL antes de crear uno nuevo.
- En ambos casos, la eliminación real se hace con `db.delete(user).where(eq(user.id, userId))`.

Cuándo se eliminan:

1. Al cerrar sesión, pero solo si `activeSessions === 1`.
2. Al pedir un nuevo demo user, si existen demo users con `createdAt < now() - 24h`.

Qué tablas se eliminan por cascada:

- `session`
- `account`
- `user_credits`
- `credit_history`
- `pending_payments`
- `tecnicos`
- `empresas`
- `instrumentos`
- `reportes_iluminacion`
- `areas_iluminacion`
- `localizadas_iluminacion`

Observación importante:

- La limpieza por TTL no corre en background; ocurre solo cuando alguien solicita un nuevo demo user.
- Si nadie vuelve a pedir un demo user, los demos viejos pueden quedar presentes en la base hasta la próxima solicitud.

## Plan de implementación propuesto

### Paso 1

Crear una utilidad compartida para detectar `isDemoUser` a partir del email o de la sesión.

Objetivo:

- Evitar repetir `startsWith("demo") && endsWith("@enhysa.demo")` en varios lugares.

### Paso 2

Bloquear checkout para demo users.

Archivo:

- `src/routes/_with-header/checkout.tsx`

Acción:

- Verificar demo user en `handlePay()`.
- Si lo es, mostrar `sonner` o mensaje y cortar antes de `createPreferenceServer()`.

### Paso 3

Bloquear unlock descargable para demo users.

Archivos:

- `src/components/reportes/iluminacion/pdf/my-document.tsx`
- `src/components/reportes/iluminacion/pdf/my-document-reducida.tsx`

Acción:

- Reemplazar el botón de unlock por el mensaje de limitación demo.

### Paso 4

Endurecer la creación de passwords demo.

Archivo:

- `server/seed-demo-user-server.ts`

Acción:

- Generar password aleatorio de 4 dígitos con padding izquierdo.
- Mantener hashing con `scrypt`.

### Paso 5

Resolver asignación del slot demo.

Archivo:

- `server/seed-demo-user-server.ts`

Acción:

- Buscar los índices ocupados.
- Elegir el primer número libre entre `1` y `5`.
- Evitar colisiones por usar `activeCount + 1`.

### Paso 6

Agregar defensa server-side para compras y unlock.

Archivos probables:

- `server/mercadopago/create-preference-server.ts`
- `server/reportes/iluminacion/unlock-reporte-server.ts`

Acción:

- Aunque el frontend bloquee, el servidor también debe rechazar demo users para evitar bypass manual.

## Referencias actuales

- `server/seed-demo-user-server.ts`
- `server/reset-demo-data-server.ts`
- `server/credits/get-user-credits-server.ts`
- `src/components/login-form.tsx`
- `src/components/navbar.tsx`
- `src/routes/_with-header/checkout.tsx`
- `src/components/reportes/iluminacion/pdf/my-document.tsx`
- `src/components/reportes/iluminacion/pdf/my-document-reducida.tsx`
- `db/users/schema.ts`
- `db/credits/schema.ts`
- `db/payments/schema.ts`
- `db/tecnicos/schema.ts`
- `db/empresas/schema.ts`
- `db/instrumentos/schema.ts`
- `db/reportes/iluminacion/schema.ts`
- `db/reportes/iluminacion/areas/schema.ts`
- `db/reportes/iluminacion/localizadas/schema.ts`

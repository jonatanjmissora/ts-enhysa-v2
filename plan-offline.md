# Plan Offline + PWA — Enhysa v2 (reimplementación)

> Sí, es posible. Este plan define el paso a paso para que la app funcione sin internet:
> cachear las queries de lectura (navegación), encolar operaciones de **crear** (y luego **eliminar** / **editar**)
> en IndexedDB, sincronizarlas contra la base de datos cuando se recupera la conexión y
> exponer una interfaz visual de estados + una ruta de prueba para inspeccionar la cola.

---

## 1. Estado actual auditado

* La **instalación PWA** funciona y se conserva: `public/manifest.json`, `public/logo192/512.png`,
  `src/components/pwa-register.tsx`, `src/components/pwa-install-listener.tsx`,
  `src/components/install-prompt.tsx`, `src/hooks/use-install*`, `src/store/install-store.ts`.
* `src/components/offline-indicator.tsx` hoy solo muestra "sin internet" (no hay cola ni sync).
* `src/hooks/use-online-status.ts` existe (requerido por el indicator).
* La capa offline previa fue **eliminada** en `e4789fe`: no existe `src/lib/offline/*`, no hay
  dependencia `idb`, y todos los `queryOptions` quedaron online-only.
* `public/sw.js` es mínimo (solo `SKIP_WAITING`, `UNREGISTER`, `clients.claim`). **No cachea nada**.
* El servidor de sesión es `getSession()` / `protectedRoute()` (server functions de `server/get-session.ts`),
  usadas en `src/routes/__root.tsx` y `src/lib/protected-route.ts`.
* Actualmente, cuando la app está offline, las llamadas al servidor de sesión fallan.
* `protectedRoute()` es responsable de determinar si existe una sesión y redirigir cuando no existe.
* Para soportar offline, la sesión que utiliza el loader de `__root.tsx` será obtenida mediante
  `getCachedSession()`.
* La sesión cacheada **no reemplaza la autenticación real del servidor**. Solo conserva localmente
  la identidad del usuario que tenía una sesión válida para permitir el funcionamiento offline.

### Entidades involucradas y generación de IDs

| Tabla                     | Store cache propuesto | Creación de ID hoy                  | Query keys usadas                                                                          |
| ------------------------- | --------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `tecnicos`                | `tecnicos-cache`      | —                                   | `["tecnico"]`                                                                              |
| `empresas`                | `empresas-cache`      | —                                   | `["empresas"]`                                                                             |
| `instrumentos`            | `instrumentos-cache`  | —                                   | `["instrumentos"]`                                                                         |
| `reportes_iluminacion`    | `reportes-cache`      | **server** (debe cambiar)           | `["reportes-iluminacion"]`, `["reporte-iluminacion-nuevo"]`, `["reporte-iluminacion", id]` |
| `areas_iluminacion`       | `areas-cache`         | **cliente** (`crypto.randomUUID()`) | `["areas-iluminacion", reportId]`, `["area-iluminacion", id]`                              |
| `localizadas_iluminacion` | `localizadas-cache`   | **cliente** (`crypto.randomUUID()`) | `["localizadas-iluminacion", reportId]`, `["localizada-iluminacion", id]`                  |

⛓️ **Dependencia FK que define el diseño:** `areas_iluminacion.reportId` y
`localizadas_iluminacion.reportId` apuntan a `reportes_iluminacion.id`. Para crear un área offline,
el área debe conocer el `id` del reporte **antes** de sincronizarlo.

---

# 2. Decisiones de diseño

## D1 — IDs generados por el cliente y estables

La ventaja que mencionás (almacenar IDs que identifiquen los datos) se logra generando el UUID
**siempre en el cliente**, igual que ya hacen áreas y localizadas.

* `create-area.tsx` y `create-localizada.tsx` ya generan `crypto.randomUUID()`.
* El servidor respeta esos IDs.
* **Único cambio necesario:** `server/reportes/iluminacion/create-reporte-nuevo-server.ts` actualmente
  sobreescribe el ID con `crypto.randomUUID()`. Hay que hacer que acepte el ID del cliente:

  * agregar `id: z.string().min(1)` a `reporteServerValidator`;
  * usar `data.id` en el server;
  * `create-reporte-nuevo.tsx` debe generar `id: crypto.randomUUID()`.

Con esto:

* El reporte creado offline tiene el mismo UUID con el que se creará online.
* Las áreas y localizadas pueden referenciarlo inmediatamente.
* El sync no necesita ningún remapeo de IDs.
* Online y offline utilizan el mismo flujo.

---

## D2 — Dos capas en IndexedDB

### 1. `*-cache`

Snapshots de lectura para poder navegar y trabajar offline.

### 2. `mutation-queue` + `mutation-history`

Sistema de persistencia de operaciones:

```text
pending
   ↓
syncing
   ↓
completed
```

o:

```text
pending
   ↓
syncing
   ↓
failed
   ↓
retry
```

---

## D3 — Una entrada de cola contiene todo lo necesario

```ts
type MutationEntry = {
  id?: number
  entity:
    | "reportes-cache"
    | "areas-cache"
    | "localizadas-cache"
  type: "create" | "update" | "delete"
  payload: unknown
  userId: string
  status: "pending" | "syncing" | "failed" | "completed"
  attempts: number
  lastError?: string
  createdAt: number
  updatedAt: number
}
```

El `userId` de la mutación sirve para:

* identificar localmente al usuario;
* asociar una operación con la sesión que la creó;
* debugging;
* auditoría;
* separar correctamente los datos offline.

**No es una credencial ni un mecanismo de autenticación.**

Cuando la operación llegue al servidor, la autorización deberá continuar dependiendo de
la sesión real validada por Better Auth.

---

# D4 — Sesión offline mediante `getCachedSession()`

La sesión será persistida localmente en IndexedDB para que la aplicación pueda continuar
funcionando después de perder conexión o reiniciar React/PWA.

La implementación estará en:

```text
src/lib/offline/session.ts
```

Este archivo será responsable de:

* los tipos relacionados con la sesión offline;
* `getCachedSession()`;
* cualquier helper específico de persistencia/lectura de la sesión.

## D4.1 — Tipos

La sesión cacheada no necesita `expiresAt`.

```ts
export type CachedSession = {
  userId: string
  email: string
  name: string
}

export type AppSession = {
  user: {
    id: string
    email: string
    name: string
  }
  source: "server" | "cache"
}
```

`CachedSession` representa únicamente la identidad local necesaria para continuar trabajando
offline.

`AppSession` es la representación que utilizará la aplicación.

`source` permite saber si la sesión proviene del servidor o del cache y resulta útil para
debugging.

---

## D4.2 — Responsabilidad de `getSession()`

`getSession()` continuará representando exclusivamente:

> "Obtener la sesión real desde el servidor / Better Auth."

No se debe modificar `getSession()` para que conozca IndexedDB.

La separación será:

```text
getSession()
    │
    └── sesión real del servidor


getCachedSession()
    │
    ├── intenta getSession()
    │
    └── fallback → IndexedDB
```

---

## D4.3 — Funcionamiento de `getCachedSession()`

El flujo será:

```text
getCachedSession()
       │
       ▼
  getSession()
       │
   ┌───┴────┐
   │        │
 éxito    falla
   │        │
   ▼        ▼
guardar   getMeta("session")
en IDB       │
   │      ┌──┴───┐
   │      │      │
   │    existe   no existe
   │      │      │
   └──────┘      ▼
      │         null
      ▼
 AppSession
```

Pseudocódigo:

```ts
async function getCachedSession(): Promise<AppSession | null> {
  try {
    const result = await getSession()

    if (!result?.session || !result?.user) {
      return null
    }

    const cachedSession = {
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
    }

    await setMeta("session", cachedSession)

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      source: "server",
    }
  } catch {
    const cached = await getMeta<CachedSession>("session")

    if (!cached) {
      return null
    }

    return {
      user: {
        id: cached.userId,
        email: cached.email,
        name: cached.name,
      },
      source: "cache",
    }
  }
}
```

La estructura exacta de `result` deberá adaptarse a la forma real que devuelve el
`getSession()` actual.

---

## D4.4 — Integración con `__root.tsx`

Actualmente los componentes obtienen la sesión mediante:

```ts
const { session } = useLoaderData({ from: "__root__" })
```

Esto se mantiene.

El cambio se realiza en el loader de `__root.tsx`.

Antes:

```ts
loader: async () => {
  const session = await getSession()

  return {
    session,
  }
}
```

Después:

```ts
loader: async () => {
  const session = await getCachedSession()

  return {
    session,
  }
}
```

De esta forma los componentes no necesitan conocer si la sesión proviene del servidor
o de IndexedDB.

Ejemplo:

```ts
const { session } = useLoaderData({ from: "__root__" })

const { data: tecnico } = useSuspenseQuery(
  tecnicoQueryOptions(session?.user?.id ?? "")
)
```

El código del componente puede permanecer igual.

---

## D4.5 — Integración con `protectedRoute()`

`protectedRoute()` continúa siendo responsable de:

* comprobar si existe sesión;
* redirigir cuando no existe.

No se modifica su responsabilidad.

El flujo pasa a ser:

```text
__root loader
     │
     ▼
getCachedSession()
     │
     ├── sesión real online
     │
     └── CachedSession offline
     │
     ▼
session
     │
     ▼
protectedRoute()
     │
     ├── existe → continuar
     │
     └── null → redirect
```

La lógica de protección de rutas no necesita saber de IndexedDB.

---

## D4.6 — React Context no es necesario

No se agregará un `SessionContext` como mecanismo de persistencia.

El motivo es que React Context vive en memoria y desaparece cuando React/PWA se reinicia.

IndexedDB persiste:

```text
React
  ↓
getCachedSession()
  ↓
IndexedDB
  ↓
reinicio de React
  ↓
getCachedSession()
  ↓
misma identidad local
```

Además, `sync.ts` y otras capas de infraestructura no deberían depender de React Context.

Si en el futuro se considera útil un Context para componentes de UI, podrá agregarse como
una capa de presentación derivada de `getCachedSession()`, pero **no será la fuente de verdad
de la sesión offline**.

---

## D4.7 — Seguridad

La información:

```text
userId
email
name
```

guardada en IndexedDB **no demuestra que el usuario continúe autenticado**.

El servidor sigue siendo la autoridad.

Por lo tanto:

```text
OFFLINE

CachedSession
    ↓
permitir funcionamiento local


ONLINE / SYNC

mutation
    ↓
server function
    ↓
sesión real Better Auth
    ↓
autorización
    ↓
DB
```

Si la sesión real ya no es válida cuando vuelve internet, el servidor debe rechazar
la operación.

Nunca se debe utilizar:

```ts
MutationEntry.userId
```

o:

```ts
CachedSession.userId
```

como sustituto de la sesión real para autorizar una operación en el servidor.

---

# D5 — Sync reutiliza las server functions existentes

Al recuperar conexión, el navegador sigue teniendo las cookies y las server functions
continúan validando la sesión real.

`processMutationQueue()` despacha a:

* `createReporteNuevoServer`
* `createAreaServer`
* `createLocalizadaServer`

y posteriormente a sus operaciones `delete` / `update`.

No se crean endpoints nuevos.

**Importante:** `sync.ts` no debe confiar en `MutationEntry.userId` para autorizar.

---

# D6 — Orden FIFO garantiza padre → hijos

Reporte se encola antes que sus áreas/localizadas.

Procesar en orden de inserción asegura que:

```text
reporte
   ↓
area
   ↓
localizada
```

y que `reportId` ya exista cuando se creen los hijos.

Si un hijo falla por FK inexistente:

* queda en cola;
* no bloquea necesariamente las demás operaciones;
* se vuelve a intentar en el siguiente ciclo.

---

# D7 — Idempotencia por UUID

Si un create online responde pero la red se corta antes de recibir la respuesta,
el reintento puede encontrar una PK ya existente.

Recomendado:

* `create-reporte-nuevo-db.ts`
* `crear-area-db.ts`
* `crear-localizada-db.ts`

usar:

```ts
.onConflictDoNothing().returning()
```

y si no devuelve una fila:

```text
select por id
    ↓
devolver fila existente
```

Así el reintento es exitoso.

---

# D8 — Cancelaciones locales

Si se elimina una entidad que todavía tiene un `create` pendiente:

* cancelar el `create`;
* borrar la entidad del cache;
* no crear un `delete`.

Para un reporte:

* cancelar los `create` pendientes de áreas/localizadas hijas;
* borrar sus caches;
* encolar el delete del reporte si corresponde.

---

# D9 — Sin resolución de conflictos

Se mantiene el comportamiento:

> última escritura gana.

Los reportes desbloqueados (`creditConsumed=true`) continúan siendo solo lectura.

Los conflictos por edición simultánea quedan fuera de alcance.

---

# D10 — Fotos fuera del create offline inicial

UploadThing requiere conexión.

Durante el sprint inicial:

* crear áreas/localizadas offline sin imágenes;
* `imagenes` queda vacío o conserva valores existentes;
* posteriormente se podrá implementar almacenamiento de blobs y subida diferida.

---

# 3. Modelo de IndexedDB

Archivo:

```text
src/lib/offline/db.ts
```

Base:

```text
enhysa-offline
```

Versión inicial:

```text
1
```

Wrapper:

```text
idb
```

Instalación:

```bash
pnpm add idb
```

| Store                | KeyPath            | Propósito                                 |
| -------------------- | ------------------ | ----------------------------------------- |
| `mutation-queue`     | `id` autoincrement | operaciones pendientes                    |
| `mutation-history`   | `id`               | operaciones completadas, TTL 24h          |
| `reportes-cache`     | `id`               | snapshot de reportes                      |
| `areas-cache`        | `id`               | snapshot de áreas                         |
| `localizadas-cache`  | `id`               | snapshot de localizadas                   |
| `tecnicos-cache`     | `id`               | snapshot del técnico                      |
| `empresas-cache`     | `id`               | snapshot de empresas                      |
| `instrumentos-cache` | `id`               | snapshot de instrumentos                  |
| `meta`               | `key`              | metadatos de aplicación + sesión cacheada |

El registro de sesión será:

```text
meta
└── session
    ├── userId
    ├── email
    └── name
```

No se almacenará `expiresAt`.

Tampoco se almacenará el token/cookie de Better Auth como sustituto de la autenticación.

## Helpers

* `openAppDB()`
* `addMutationToQueue(entry)`
* `getMutationQueue()`
* `getPendingCount()`
* `getFailedEntries()`
* `updateMutationStatus()`
* `removeMutationFromQueue()`
* `pushToHistory()`
* `getHistory()`
* `clearHistory()`
* `saveListToCache()`
* `putInCache()`
* `getCachedList()`
* `getCachedById()`
* `getCachedByField()`
* `removeFromCache()`
* `clearCache()`
* `setMeta()`
* `getMeta()`

---

# 4. Fases de implementación

## Fase 0 — Setup e infraestructura PWA offline

Objetivo: assets y navegación disponibles sin red.

* [ ] `pnpm add idb`
* [ ] Actualizar `public/sw.js`.
* [ ] Assets → `cacheFirst`.
* [ ] `/_serverFn/` GET → `networkFirst`.
* [ ] Navegación → `networkFirstWithOffline`.
* [ ] Mantener `SKIP_WAITING`.
* [ ] Mantener `UNREGISTER` solo DEV.
* [ ] Crear `public/offline.html`.
* [ ] Precache `/`, `/offline.html`, `/manifest.json`, logos y favicon.
* [ ] Validar instalación PWA.
* [ ] Probar navegación offline.

---

# Fase 1 — Lectura offline

Objetivo: navegar offline utilizando snapshots de IndexedDB.

* [ ] Crear `src/lib/offline/db.ts`.
* [ ] Crear `src/lib/offline/errors.ts`.
* [ ] Crear `src/lib/offline/session.ts`.
* [ ] Implementar `CachedSession`.
* [ ] Implementar `AppSession`.
* [ ] Implementar `getCachedSession()`.
* [ ] Modificar el loader de `__root.tsx` para utilizar `getCachedSession()`.
* [ ] Mantener `protectedRoute()` como responsable de redirección cuando no existe sesión.
* [ ] No introducir Session Context como mecanismo de persistencia.
* [ ] Modificar los queryOptions con `networkMode: "always"`.
* [ ] Implementar write-through en caso de éxito.
* [ ] Implementar fallback a IndexedDB.
* [ ] Implementar `OfflineNoCacheError`.
* [ ] Crear `OfflineRouteBlock`.
* [ ] Integrar `OfflineNoCacheError` en `DefaultCatchBoundary`.

Queries:

* `queries/reportes/iluminacion/reportes-query.ts`
* `queries/reportes/iluminacion/areas/areas-query.ts`
* `queries/reportes/iluminacion/localizadas/localizadas-query.ts`
* `queries/empresas/empresas-query.ts`
* `queries/instrumentos/instrumentos-query.ts`
* `queries/tecnico/tecnico-query.ts`

### Verificación

Online:

```text
navegar
  ↓
query
  ↓
server
  ↓
IndexedDB
```

Offline:

```text
navegar
  ↓
query
  ↓
server falla
  ↓
IndexedDB
  ↓
mostrar datos
```

Probar también:

```text
online
  ↓
session válida
  ↓
meta.session guardada
  ↓
cerrar/reiniciar PWA
  ↓
offline
  ↓
getCachedSession()
  ↓
session disponible
```

---

# Fase 2 — Mutaciones offline CREATE

Objetivo: crear reportes, áreas y localizadas offline.

## 2.1 IDs

* [ ] Agregar `id` al `reporteServerValidator`.
* [ ] `create-reporte-nuevo-server.ts` utiliza `data.id`.
* [ ] `create-reporte-nuevo.tsx` genera `crypto.randomUUID()`.
* [ ] Evaluar idempotencia D7.

## 2.2 Sync

Crear:

```text
src/lib/offline/sync.ts
```

Implementar:

```text
processMutationQueue()
```

Con mutex:

```ts
let isSyncing = false
```

Flujo:

```text
mutation-queue
      ↓
FIFO
      ↓
pending
      ↓
syncing
      ↓
server function
      ↓
 ┌────┴────┐
 OK       error
 │          │
 ▼          ▼
history   failed
 │          │
 ▼          ▼
remove    retry
```

Dispatch:

| Entity              | Create                     |
| ------------------- | -------------------------- |
| `reportes-cache`    | `createReporteNuevoServer` |
| `areas-cache`       | `createAreaServer`         |
| `localizadas-cache` | `createLocalizadaServer`   |

## 2.3 Hooks

Modificar:

* [ ] `use-create-reporte-nuevo.ts`
* [ ] `use-create-area.ts`
* [ ] `use-create-localizada.ts`

Patrón:

```text
try server
   ↓
OK → resultado normal

error
   ↓
crear/usar UUID local
   ↓
guardar cache
   ↓
encolar mutation
   ↓
devolver objeto local
```

El `onSuccess` actual de React Query se mantiene.

## 2.4 OfflineIndicator

Modificar:

```text
src/components/offline-indicator.tsx
```

Estados:

* pending
* syncing
* failed
* completed
* offline

Auto-sync:

* evento `online`;
* al montar;
* polling adaptativo;
* reintento manual.

---

# Fase 3 — Debug

Crear:

```text
src/routes/_protected/offline/debug.tsx
```

Mostrar:

* queue;
* history;
* payload;
* status;
* attempts;
* lastError;
* timestamps.

Acciones:

* Reintentar;
* Reintentar todas;
* Descartar;
* inspeccionar caches.

Query key:

```ts
["offline", "queue"]
```

---

# Fase 4 — DELETE offline

Modificar:

* `sync.ts`
* `use-delete-reporte.ts`
* `use-delete-area.ts`
* `use-delete-localizada.ts`

Implementar D8.

Verificar:

* delete de entidad sincronizada;
* delete de entidad pendiente;
* delete de reporte con hijos pendientes.

---

# Fase 5 — EDIT offline

Modificar:

* `use-update-*`
* `sync.ts`

Agregar:

```text
type: "update"
```

Mantener:

> última escritura gana.

Respetar:

```text
creditConsumed === true
```

como estado de solo lectura.

---

# Fase 6 — Verificación integral

* [ ] `pnpm build`
* [ ] `pnpm check`
* [ ] `pnpm test`
* [ ] PWA instalable.
* [ ] `beforeinstallprompt` intacto.
* [ ] iOS intacto.
* [ ] Update flow intacto.
* [ ] Online sin regresiones.
* [ ] Offline navegación.
* [ ] Offline sesión.
* [ ] Offline create.
* [ ] Offline delete.
* [ ] Offline edit.
* [ ] Sync.
* [ ] Idempotencia.
* [ ] Debug route.
* [ ] `graphify update .`

### Verificación específica de sesión

* [ ] Sesión válida online → `getCachedSession()` obtiene sesión real.
* [ ] Sesión válida online → se actualiza `meta.session`.
* [ ] Se pierde internet → `getCachedSession()` utiliza IndexedDB.
* [ ] React/PWA se reinicia offline → la sesión cacheada continúa disponible.
* [ ] No existe sesión cacheada → `getCachedSession()` devuelve `null`.
* [ ] `protectedRoute()` redirige cuando recibe `null`.
* [ ] El `userId` cacheado nunca se utiliza como sustituto de autenticación.
* [ ] Al sincronizar, el servidor vuelve a validar la sesión real.

---

# 5. UI de estados

| Estado                | Visual                                        | Acción     |
| --------------------- | --------------------------------------------- | ---------- |
| `pending > 0`, online | badge ámbar "N pendientes"                    | —          |
| `syncing > 0`         | badge con spinner "Sincronizando…"            | —          |
| `failed > 0`          | badge rojo "N fallaron"                       | Reintentar |
| `completed` reciente  | toast/contador verde                          | —          |
| offline               | barra "Sin conexión — N pendientes guardados" | —          |

Auto-sync:

```text
online event
     +
mount
     +
pending
     ↓
processMutationQueue()
```

Mutex para evitar sincronizaciones simultáneas.

---

# 6. Riesgos y mitigaciones

| #  | Riesgo                                               | Mitigación                                       |
| -- | ---------------------------------------------------- | ------------------------------------------------ |
| 1  | Romper instalación PWA                               | Mantener `SKIP_WAITING` / `UNREGISTER`           |
| 2  | `getSession()` falla offline                         | `getCachedSession()` + IndexedDB                 |
| 3  | Session Context desaparece al reiniciar React        | IndexedDB como persistencia                      |
| 4  | `reportId` inválido                                  | UUID generado por cliente                        |
| 5  | FK padre/hijo                                        | FIFO                                             |
| 6  | PK duplicada en retry                                | Idempotencia D7                                  |
| 7  | Delete de create pendiente                           | Cancelación D8                                   |
| 8  | Query sin cache                                      | `OfflineRouteBlock`                              |
| 9  | React Query pausa query                              | `networkMode: "always"`                          |
| 10 | Fotos offline                                        | Fuera del sprint inicial                         |
| 11 | PDF offline                                          | Fuera del alcance inicial                        |
| 12 | `userId` cacheado usado como autenticación           | El servidor siempre valida la sesión real        |
| 13 | `expiresAt` cacheado interpretado como sesión válida | No se almacena ni utiliza `expiresAt` localmente |

---

# 7. Fuera de alcance

* Fotos / UploadThing offline.
* Generación de PDF descargable offline.
* Resolución de conflictos.
* Sincronización multi-dispositivo offline.
* Utilizar IndexedDB como sustituto de autenticación.
* Utilizar `userId` cacheado como autorización.
* Utilizar React Context como fuente de verdad de la sesión.
* Persistir `expiresAt` de la sesión en IndexedDB.

---

# 8. Orden de ejecución recomendado

1. **Fase 0** — Service Worker + `offline.html`.
2. **Fase 1** — IndexedDB + caches + `getCachedSession()`.
3. **Fase 3** — Debug route.
4. **Fase 2** — Create + queue + sync.
5. **Fase 4** — Delete.
6. **Fase 5** — Edit.
7. **Fase 6** — Verificación integral.

---

# Resumen arquitectónico

La arquitectura final de sesión queda:

```text
                    ┌─────────────────┐
                    │   __root.tsx    │
                    │     loader      │
                    └────────┬────────┘
                             │
                             ▼
                    getCachedSession()
                             │
                  ┌──────────┴──────────┐
                  │                     │
               ONLINE                 OFFLINE
                  │                     │
                  ▼                     ▼
             getSession()          IndexedDB
                  │                     │
                  └──────────┬──────────┘
                             │
                             ▼
                        AppSession
                             │
                             ▼
                    protectedRoute()
                       │          │
                    session     null
                       │          │
                       ▼          ▼
                    continuar   redirect
```

La sesión cacheada:

```ts
type CachedSession = {
  userId: string
  email: string
  name: string
}
```

no contiene `expiresAt`, token ni cookie.

La regla fundamental es:

> **IndexedDB mantiene la identidad local para trabajar offline; Better Auth y el servidor siguen siendo la autoridad de autenticación y autorización cuando existe conexión.**

Y los componentes existentes pueden continuar utilizando:

```ts
const { session } = useLoaderData({ from: "__root__" })
```

sin necesidad de crear un `SessionContext`.

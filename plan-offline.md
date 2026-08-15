# Plan Offline + PWA — Enhysa v2 (reimplementación)

> Sí, es posible. Este plan define el paso a paso para que la app funcione sin internet:
> cachear las queries de lectura (navegación), encolar operaciones de **crear** (y luego **eliminar** / **editar**)
> en IndexedDB/Dexie, sincronizarlas contra la base de datos cuando se recupera la conexión y
> exponer una interfaz visual de estados + una ruta de prueba para inspeccionar la cola.

---

## 1. Estado actual auditado

> **Actualización (implementado):** gran parte de este plan ya está construido. Ver estados por fase al final de cada sección y `plan-offline-part2.md` para el arranque offline. Los items `[ ]` de los checklists marcan lo pendiente.

* La **instalación PWA** funciona y se conserva: `public/manifest.json`, `public/logo192/512.png`,
  `src/components/pwa-register.tsx`, `src/components/pwa-install-listener.tsx`,
  `src/components/install-prompt.tsx`, `src/hooks/use-install*`, `src/store/install-store.ts`.
* `src/components/offline-indicator.tsx` hoy solo muestra "sin internet" (no hay cola ni sync).
* `src/hooks/use-online-status.ts` existe (requerido por el indicator).
* La capa offline fue **reimplementada**: existe `src/lib/offline/*` (types, resolver, errors),
  `src/lib/session/index.ts` (cache de sesión en Dexie), `OfflineSession`, `OfflineSessionGate`,
  `OfflineRouteBlock`, `useAutoReloadOnReconnect` y `AppSessionContext` (ver `plan-offline-part2.md`).
* `public/sw.js` fue **reescrito**: precache de app shell + `/iluminacion`, `/iluminacion/reportes`, `/perfil/tecnicos`, `/perfil/empresas`, `/perfil/instrumentos` + `networkFirstWithOffline` en navegación +
  `cacheFirst` en assets, sin interceptar `/api/auth/*` ni `/_serverFn/*`. Existe `public/offline.html`.
* El servidor de sesión sigue siendo `getSession()` / `protectedRoute()` (server functions de `server/get-session.ts`),
  usadas en `src/routes/__root.tsx` y `src/lib/protected-route.ts`.
* `protectedRoute()` sigue siendo responsable de determinar si existe una sesión y redirigir cuando no existe.
* `__root.tsx` continúa usando `getSession()` durante SSR; `getCachedSession()` no reemplaza esa ruta.
* La sesión cacheada **no reemplaza la autenticación real del servidor**. Solo conserva localmente
  la identidad del usuario que tenía una sesión válida para permitir el funcionamiento offline.
* La sincronización Better Auth -> Dexie ya fue validada con `authClient.useSession()` y un componente global
  de sincronización; la sesión local queda lista para el siguiente paso del modo offline real.
* `tecnicos`, `empresas` e `instrumentos` quedan como queries de **solo lectura**: no se planifican `create`, `edit` ni `delete` para esas entidades dentro de esta fase.
* Lecturas cache-first implementadas en `repositories/tecnicos/tecnico-repository.ts` (guard SSR +
  `getTecnicoLocal()` primero + mirror-write en miss). Es el patrón de referencia (decisión D1).

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

# D4 — Sesión offline y sincronización local

La sesión real sigue viviendo en Better Auth. Dexie solo mantiene una copia local mínima para que el navegador conserve identidad y contexto cuando no hay conexión.

La implementación vive en:

```text
src/lib/offline/session.ts
src/components/offline-session.tsx
```

`session.ts` maneja la persistencia local de la sesión. `OfflineSession` sincroniza la sesión del cliente hacia Dexie.

## D4.1 — Tipos

```ts
export interface SessionLocal {
  id: string
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

`SessionLocal` es la identidad mínima guardada en Dexie.

`AppSession` es la forma usada por la app para diferenciar origen `server` o `cache`.

## D4.2 — `getSession()` sigue siendo server-only

`getSession()` continúa significando solo esto:

> Obtener la sesión real desde Better Auth.

No debe conocer IndexedDB.

`protectedRoute()` también sigue siendo server-side y no usa Dexie.

## D4.3 — `__root.tsx` no cambia a Dexie

El loader de `__root.tsx` sigue usando `getSession()` durante SSR.

No se usa `getCachedSession()` directamente ahí, porque Dexie/IndexedDB no existe durante SSR.

## D4.4 — Sincronización cliente -> Dexie

`src/components/offline-session.tsx` escucha `authClient.useSession()` y sincroniza el resultado con Dexie:

```tsx
export function OfflineSession() {
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return

    if (session) {
      void cacheSession(session)
      return
    }

    void clearCachedSession()
  }, [session, isPending])

  return null
}
```

Se monta globalmente en `RootDocument`.

## D4.5 — `getCachedSession()` queda como helper local

`getCachedSession()` sigue existiendo como helper para leer la sesión guardada en Dexie, pero su uso queda reservado para el futuro arranque offline del navegador, no para SSR.

## D4.6 — Seguridad

La información guardada en Dexie:

```text
userId
email
name
```

no demuestra autenticación válida ante el servidor.

Cuando vuelve internet, Better Auth sigue siendo la autoridad para autorizar operaciones.

Nunca se debe usar `SessionLocal.id` como sustituto de la sesión real.

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

Estado: **implementada**. Se usa **Dexie** (no `idb`) en `indexed-db/database.ts`.

* [x] Actualizar `public/sw.js` → precache app shell + `networkFirstWithOffline` + `cacheFirst`.
* [x] Assets → `cacheFirst`.
* [x] `/_serverFn/` GET → **no interceptar** (siguen network-only). Son son API del server, no cacheables.
* [x] Navegación → `networkFirstWithOffline`.
* [x] Mantener `SKIP_WAITING`.
* [x] Crear `public/offline.html`.
* [x] Precache `/`, `/landing`, `/login`, `/offline.html`, `/manifest.json`, logos y favicon.
* [x] Validar instalación PWA.
* [x] Probar navegación offline.

## Precache público: `/landing` y `/login`

Se identificó que las rutas públicas `_with-header` (`/landing`, `/login`) **sí se pueden precachear** porque devuelven 200 OK sin sesión. Fueron agregadas a `PRECACHE_URLS` en `public/sw.js` junto con `/` y `/offline.html`.

Rutas protegidas (`/iluminacion`, `/reportes`, `/perfil/*`) **no** se incluyen en precache porque `cache.addAll()` requiere respuestas `ok` y esas rutas devuelven 302/403 cuando no hay sesión. Esas rutas se cachean dinámicamente con `networkFirstWithOffline` una vez que el usuario las visita autenticado.

## Versión de caches

Los nombres de caches en `sw.js` usan un prefijo versionado (`SW_VERSION`):

```text
app-static-${SW_VERSION}
app-pages-${SW_VERSION}
```

Al modificar `SW_VERSION`, el SW crea caches nuevos y el evento `activate` elimina caches viejos automáticamente. Esto evita que el navegador mantenga versiones obsoletas en `waiting` y permite ver la precarga actualizada tras un hard refresh.

El `activate` limpia cualquier cache que no empiece con `app-static-` ni `app-pages-`, cubriendo también versiones previas si se reintrodujera el esquema de nombres antiguo.

---

# Fase 1 — Lectura offline

Objetivo: navegar offline utilizando snapshots de IndexedDB.

Estado: **mayormente implementada** — la sesión offline y el patrón cache-first corren en todas las queries de lectura (`tecnico`, `empresas`, `instrumentos`, `reportes`, `areas` y `localizadas`); queda pendiente `networkMode: "always"` y los mutables.

* [x] Crear `src/lib/offline/errors.ts` → `OfflineNoCacheError`, `isOfflineNoCacheError()`, `isOfflineError()`.
* [x] Crear `src/lib/offline/session.ts` → `src/lib/session/index.ts` (`cacheSession`, `getCachedSession`, `clearCachedSession`).
* [x] Implementar `SessionLocal` (tabla `session` en Dexie, `indexed-db/database.ts`).
* [x] Implementar `AppSession`.
* [x] Implementar `getCachedSession()`.
* [x] Integrar `OfflineSession` para sincronizar `authClient.useSession()` con Dexie.
* [x] Mantener `__root.tsx` con `getSession()` durante SSR (loader degradado + theme tolerant).
* [x] Mantener `protectedRoute()` como responsable de redirección cuando no existe sesión.
* [x] No introducir Session Context como mecanismo de persistencia (solo presentación: `AppSessionContext`).
* [x] Implementar fallback a IndexedDB (patrón cache-first).
* [x] Implementar `OfflineNoCacheError`.
* [x] Crear `OfflineRouteBlock`.
* [x] Integrar `OfflineNoCacheError` en `DefaultCatchBoundary`.
* [ ] Modificar los queryOptions con `networkMode: "always"` para las queries de lectura.
* [ ] Mantener fuera de alcance cualquier `create` / `edit` / `delete` para `tecnicos`, `empresas` e `instrumentos`.
* [ ] Implementar write-through solo en las entidades mutables; no aplica a `tecnicos`, `empresas` ni `instrumentos`.

Queries:

* `queries/reportes/iluminacion/reportes-query.ts` → solo lectura; **implementado** vía `reportesRepository.get()` (cache-first + guard SSR).
* `queries/reportes/iluminacion/areas/areas-query.ts` → solo lectura; **implementado** vía `areasRepository.get()` (cache-first + guard SSR).
* `queries/reportes/iluminacion/localizadas/localizadas-query.ts` → solo lectura; **implementado** vía `localizadasRepository.get()` (cache-first + guard SSR).
* `queries/empresas/empresas-query.ts` → solo lectura, sin `create` / `edit` / `delete`; **implementado** vía `empresasRepository.get()`.
* `queries/instrumentos/instrumentos-query.ts` → solo lectura, sin `create` / `edit` / `delete`; **implementado** vía `instrumentosRepository.get()`.
* `queries/tecnico/tecnico-query.ts` → solo lectura, sin `create` / `edit` / `delete`; **implementado** vía `tecnicoRepository.get()` (cache-first + guard SSR).
* `reporteQueryOptions({ id })` → **reporte individual cache-first** (Parte 4): vía `reportesRepository.getById(id)` (Dexie por `id` + reconstruye `empresa`/`tecnico`/`instrumento` desde sus stores locales; en miss server + mirror del reporte base). Permite abrir `general`, `medicion2` y `resumen` offline.

> **Pendiente (test en curso):** el SW precachea solo el **HTML** de las rutas (`/iluminacion`, `/iluminacion/reportes`, `/perfil/tecnicos`, `/perfil/empresas`, `/perfil/instrumentos`). Las rutas TanStack son lazy-load: sus **chunks JS** se cachean bajo demanda (`cacheFirst`) recién al entrar online a la ruta. Si al navegar entre rutas offline falla (chunk sin cachear → `OfflineRouteBlock`), habrá que implementar el **cacheo de los chunks específicos** en el precache del SW (p. ej. precachear los nombres de chunk del build o precache inteligente por manifiesto).

---

## Parte 6 — Visualización offline de PDFs de reportes cacheados

> Estado: **pendiente (sin implementar).** Viabilidad: sí, con matices.

Objetivo: poder ver (con marca de agua) el PDF completo/reducido de un reporte cacheado sin conexión.

### Dependencias ya cubiertas (por Partes 1-4)

- `reporteQueryOptions({ id })` → `reportesRepository.getById()` reconstruye `empresa`/`tecnico`/`instrumento` desde IndexedDB.
- `areasQueryOptions` y `localizadasQueryOptions` → cache-first (Dexie por `reportId`).
- Render client-side: `ClientComponent` + `lazy(MyDocument)` (react-pdf). El chunk se cachea al visitar online una vez (compartido para todos los reportes).

### Bloqueos a resolver

- **Fuente Roboto desde CDN** (`src/components/reportes/iluminacion/pdf/my-document.tsx`): `Font.register({ src: "https://cdnjs.cloudflare.com/..." })`. Offline el fetch de la fuente falla y el PDF puede no pintar. → Bundlear la `.ttf` en `public/` y registrar `src` local (`/roboto-regular-webfont.ttf`).
- **Imágenes externas** del reporte (logo empresa, `matriculaImg`, `firmaImg`, `imagenes` de áreas/localizadas e instrumento): offline no cargan salvo que el SW las tenga cacheadas (`cacheFirst` + `cache.put` solo si se visitaron antes). Evaluar si se precachean/cachean al entrar a un reporte, o se acepta PDF sin imágenes offline.
- **Unlock = mutación online**: offline solo se puede ver la versión **con marca de agua** (`creditConsumed` falso). Consumir crédito requiere server.
- **`syncPendingPaymentsServer()`** en `pdf/[$id]/completa.tsx` y `reducida.tsx` (useEffect): es network-only → offline rechaza. Envolver en try/catch (patrón del `beforeLoad` del root).

### Criterio de éxito

- Navegar SPA a `/iluminacion/reportes/$id/pdf/$id/reducida` (o `completa`) con red caída sobre un reporte cacheado → ver el PDF con marca de agua.
- Los chunks de las rutas PDF y `my-document` ya deben estar cacheados (visitados online antes).

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
OfflineSession + getCachedSession()
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

* [x] Sesión válida online → `authClient.useSession()` sincroniza la sesión en Dexie.
* [x] Sesión válida online → se actualiza `meta.session`.
* [x] Se pierde internet → la sesión local sigue disponible desde Dexie.
* [x] React/PWA se reinicia offline → la sesión cacheada continúa disponible.
* [x] No existe sesión cacheada → `getCachedSession()` devuelve `null`.
* [x] `protectedRoute()` redirige cuando recibe `null`.
* [x] El `userId` cacheado nunca se utiliza como sustituto de autenticación.
* [x] Al sincronizar, el servidor vuelve a validar la sesión real.

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
| 2  | Fallback de sesión offline aún no resuelto        | Dexie + `OfflineSession`                         |
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

> **Estado:** Fase 0 implementada; Fase 1 completa para lectura (cache-first en todas las queries: `tecnico`, `empresas`, `instrumentos`, `reportes` lista + individual, `areas`, `localizadas`); rutas precacheadas en SW (`/`, `/landing`, `/login`, `/offline.html`, `/manifest.json`, logos y favicon). Rutas protegidas se cachean dinámicamente al navegar. Pendientes: `networkMode` para lecturas, y Fases 2/4/5 (mutaciones).

1. **Fase 0** — Service Worker + `offline.html`. ✅ implementada
2. **Fase 1** — IndexedDB + caches + sesión local. ✅ lectura completa implementada
3. **Fase 3** — Debug route. ⬜ pendiente
4. **Fase 2** — Create + queue + sync. ⬜ pendiente
5. **Fase 4** — Delete. ⬜ pendiente
6. **Fase 5** — Edit. ⬜ pendiente (decisión D1: si se implementa, mirror-write en onSuccess)
7. **Fase 6** — Verificación integral. ⬜ pendiente

---

# Resumen arquitectónico

La arquitectura final de sesión queda:

```text
             SSR / Router
                  ↓
             getSession()
                  ↓
             Better Auth

             Browser
                  ↓
      authClient.useSession()
                  ↓
         OfflineSession
                  ↓
               Dexie
```

La sesión cacheada:

```ts
type SessionLocal = {
  userId: string
  email: string
  name: string
}
```

no contiene `expiresAt`, token ni cookie.

La regla fundamental es:

> **IndexedDB mantiene la identidad local para trabajar offline; Better Auth y el servidor siguen siendo la autoridad de autenticación y autorización cuando existe conexión.**

### Resolución de sesión en browser (implementado)

El `__root.tsx` `loader` devuelve `RootSessionState` y el `OfflineSessionGate` resuelve la sesión de app en el subtree `/_protected`:

```text
serverSession → source: "server"     (sesión real, camino normal)
serverState "ok" sin sesión → anonymous (Navigate a /landing)
serverState "unreachable" → getCachedSession()
    ├─ sesión local → source: "cache" (entra offline autenticado)
    └─ sin sesión local → offline-no-session (mensaje local claro)
```

El contexto (`AppSessionContext`) es solo presentación, no persistencia.

### Bifurcación de redes (crítica para offline)

| Mecanismo | Navegación SPA | Documento (hard load) |
|-----------|----------------|-----------------------|
| Service Worker | No interviene (es client-side routing) | `networkFirstWithOffline` (fallback a cache) |
| Server functions (`/_serverFn/*`) | Network-only, no cacheable · **no interceptadas por el SW** | igual |
| `beforeLoad` del root (`getThemeServerFn`) | Se ejecuta en cada navegación SPA → debe ser tolerante a fallos (try/catch + `lastKnownTheme`) | idem |

Por eso la navegación SPA offline solo funciona si a) la ruta/chunks fueron cacheados por el SW en hard loads previos y b) los `beforeLoad`/loaders no rompen por falta de red.

Consumo en componentes:

* En el subtree `/_protected`, `useAppSession()` (desde `AppSessionContext`) devuelve `AppSessionState` con la sesión resuelta localmente (server o cache).
* `OfflineSessionGate` es quien provee ese contexto; las rutas fuera del subtree siguen leyendo la sesión del root loader/`getSession()` normalmente.

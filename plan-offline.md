# Plan Offline + PWA — Enhysa v2 (reimplementación)

> Sí, es posible. Este plan define el paso a paso para que la app funcione sin internet:
> cachear las queries de lectura (navegación), encolar operaciones de **crear** (y luego **eliminar** / **editar**)
> en IndexedDB, sincronizarlas contra la base de datos cuando se recupera la conexión y
> exponer una interfaz visual de estados + una ruta de prueba para inspeccionar la cola.

---

## 1. Estado actual auditado (a la fecha de este plan)

- La **instalación PWA** funciona y se conserva: `public/manifest.json`, `public/logo192/512.png`,
  `src/components/pwa-register.tsx`, `src/components/pwa-install-listener.tsx`,
  `src/components/install-prompt.tsx`, `src/hooks/use-install*`, `src/store/install-store.ts`.
- `src/components/offline-indicator.tsx` hoy solo muestra "sin internet" (no hay cola ni sync).
- `src/hooks/use-online-status.ts` existe (requerido por el indicator).
- La capa offline previa fue **eliminada** en `e4789fe`: no existe `src/lib/offline/*`, no hay
  dependencia `idb`, y **todos los `queryOptions` quedaron online-only**.
- `public/sw.js` es mínimo (solo `SKIP_WAITING`, `UNREGISTER`, `clients.claim`). **No cachea nada**.
- El servidor de sesión es `getSession()` / `protectedRoute()` (server functions de
  `server/get-session.ts`), usadas en `src/routes/__root.tsx` y `src/lib/protected-route.ts`.
  Cuando la app está offline, estas llamadas **fallan** → hay que resolver la sesión offline.

### Entidades involucradas y su generación de IDs (clave)

| Tabla | Store cache propuesto | Creación de ID hoy | Query keys usadas |
|---|---|---|---|
| `tecnicos` | `tecnicos-cache` | — | `["tecnico"]` |
| `empresas` | `empresas-cache` | — | `["empresas"]` |
| `instrumentos` | `instrumentos-cache` | — | `["instrumentos"]` |
| `reportes_iluminacion` | `reportes-cache` | **server** (ignore id del cliente) | `["reportes-iluminacion"]`, `["reporte-iluminacion-nuevo"]`, `["reporte-iluminacion", id]` |
| `areas_iluminacion` | `areas-cache` | **cliente** (`crypto.randomUUID()` en `create-area.tsx:106`) | `["areas-iluminacion", reportId]`, `["area-iluminacion", id]` |
| `localizadas_iluminacion` | `localizadas-cache` | **cliente** (`crypto.randomUUID()` en `create-localizada.tsx:105`) | `["localizadas-iluminacion", reportId]`, `["localizada-iluminacion", id]` |

⛓️ **Dependencia FK que define el diseño:** `areas_iluminacion.reportId` y
`localizadas_iluminacion.reportId` apuntan a `reportes_iluminacion.id`. Para crear un área fuera
de línea, el área debe conocer el `id` del reporte **antes** de sincronizarlo.

---

## 2. Decisiones de diseño (con fundamento en el código real)

### D1 — IDs generados por el cliente y estables (el "hash" de identificación)

La ventaja que mencionás (almacenar IDs/hashes que identifiquen los datos) se logra generando
el UUID **siempre en el cliente**, igual que ya hacen áreas y localizadas:

- `create-area.tsx` y `create-localizada.tsx` ya generan `crypto.randomUUID()` y el servidor lo respeta
  (`...data` incluye `id`).
- **Único cambio necesario:** `server/reportes/iluminacion/create-reporte-nuevo-server.ts:14-15`
  hoy sobreescribe el id con `crypto.randomUUID()`. Hay que hacer que acepte el `id` del cliente:
  - agregar `id: z.string().min(1)` a `reporteServerValidator` (en `db/reportes/iluminacion/reporte-validator.ts`);
  - en el server, usar `data.id` en lugar de generarlo, y `create-reporte-nuevo.tsx` pasa `id: crypto.randomUUID()`.

Con esto:
- El reporte creado offline tiene el **mismo UUID real** con el que se creará online → las áreas y
  localizadas offline lo referencian sin re-mapeo.
- El sync es simple y sin remap: cada operación inserta con su ID definitivo.
- Online y offline usan el mismo flujo → menos divergencia de código.

### D2 — Dos capas en IndexedDB

1. **`*‑cache` (lectura):** snapshot de cada entidad del usuario, para navegar offline.
2. **`mutation-queue` + `mutation-history` (escritura):** operaciones pendientes/en proceso/fallidas + historial de completadas con TTL.

### D3 — Una entrada de cola lleva todo lo necesario para sincronizar

```ts
type MutationEntry = {
  id?: number            // autoincrement de IDB
  entity:
    | "reportes-cache"
    | "areas-cache"
    | "localizadas-cache"
  type: "create" | "update" | "delete"
  payload: unknown       // objeto completo tipado (para create/update) o { id } (para delete)
  userId: string         // para la ruta de prueba y auditoría (el server lo valida con la sesión igual)
  status: "pending" | "syncing" | "failed" | "completed"
  attempts: number
  lastError?: string
  createdAt: number
  updatedAt: number
}
```

### D4 — La sesión se persiste localmente

`protectedRoute()` y `getSession()` fallan offline. Solución:
- store `meta` en IDB con `{ userId, email, name }` (y opcionalmente el `expiresAt` de la cookie).
- Se escribe cada vez que hay sesión válida online.
- Un helper `getCachedSession()` intenta `getSession()` y, si falla, lee `meta`.
- `src/lib/protected-route.ts` y el loader de `__root.tsx` usan este helper (sin cambiar sus firmas).

### D5 — Sync reutiliza las server functions existentes

Al recuperar conexión, el navegador sigue teniendo las cookies → `protectedServerFn` valida la
sesión normalmente. `processMutationQueue()` despacha a `createReporteNuevoServer` /
`createAreaServer` / `createLocalizadaServer` (y sus pares delete/update en fases siguientes).
No se crean endpoints nuevos.

### D6 — Orden FIFO garantiza padre → hijos

Reporte se encola antes que sus áreas/localizadas (porque se crea primero). Procesar en orden de
inserción asegura que `reportId` ya exista al crear áreas. Regla adicional de seguridad: si un
`create` de un hijo falla por FK inexistente, queda en cola (no bloquea al resto) y se re-intenta
en el siguiente ciclo.

### D7 — Idempotencia por UUID en los creates (robustez ante reintentos)

Si un create online responde pero la red se corta antes de recibir la respuesta, el reintento
chocaría con la PK duplicada. Recomendado (fase 2.3):
- en `create-reporte-nuevo-db.ts`, `crear-area-db.ts`, `crear-localizada-db.ts` usar
  `.onConflictDoNothing().returning()` y si no devuelve fila, hacer un `select` por id → devolver la
  fila existente. Así el reintento es exitoso.

### D8 — Cancelaciones locales (delete de algo aún no sincronizado)

Si el usuario borra una entidad **que todavía tiene un create pendiente**, no se encola un delete
(eso fallaría con "not found" y quedaría atrapado en failed). Regla:
- al hacer `delete` de un id que tiene `create` pendiente → **cancelar** la entrada create,
  borrar la entidad del cache y NO encolar delete.
- al hacer `delete` de un reporte → cancelar todos los `create` pendientes de sus áreas/localizadas
  (hijos del `reportId`) y borrar sus caches locales; luego encolar el delete del reporte.

### D9 — Sin resolución de conflictos (última escritura gana)

Coherente con la regla actual del proyecto (reporte desbloqueado = solo lectura). Los conflictos
por edición simultánea quedan fuera de alcance; el server ya tiene validaciones de pertenencia por
`userId`.

### D10 — Fotos: fuera del alcance inicial del create offline

El formulario de área/localizada usa `FilesDropzone` (UploadThing) que sube archivos a un bucket →
offline no hay URL. Para el sprint inicial:
- el create offline permite guardar el área/localizada **sin imágenes** (el array `imagenes` queda
  vacío o con valores previos);
- fase futura: almacenar blobs locales + subida diferida al recuperar conexión.

---

## 3. Modelo de datos en IndexedDB (`src/lib/offline/db.ts`)

DB `enhysa-offline`, versión 1, con `idb` como wrapper (`pnpm add idb`):

| Store | KeyPath | Propósito |
|---|---|---|
| `mutation-queue` | `id` (autoincrement) | cola FIFO de operaciones pendientes/en proceso/fallidas |
| `mutation-history` | `id` | completadas (TTL 24h, cleanup periódico) |
| `reportes-cache` | `id` | snapshot `ReporteIluminacionType` |
| `areas-cache` | `id` | snapshot `AreaIluminacionType` |
| `localizadas-cache` | `id` | snapshot `LocalizadaIluminacionType` |
| `tecnicos-cache` | `id` | snapshot del técnico del usuario |
| `empresas-cache` | `id` | snapshot `EmpresaType` |
| `instrumentos-cache` | `id` | snapshot `InstrumentoType` |
| `meta` | `key` | `{ userId, email, name, expiresAt }` de la sesión |

Helpers expuestos:
- `openAppDB()`, `addMutationToQueue(entry)`, `getMutationQueue()`, `getPendingCount()`,
  `getFailedEntries()`, `updateMutationStatus(id, {status, error})`, `removeMutationFromQueue(id)`,
  `pushToHistory(entry)`, `getHistory()`, `clearHistory()`.
- Genéricos por store: `saveListToCache`, `putInCache`, `getCachedList`, `getCachedById`,
  `getCachedByField`, `removeFromCache`, `clearCache`.
- `setMeta`/`getMeta`.

---

## 4. Fases de implementación (paso a paso)

### Fase 0 — Setup e infraestructura PWA offline

Objetivo: que assets y navegación estén disponibles sin red (app shell), sin tocar queries todavía.

- [ ] `pnpm add idb`
- [ ] **Upgrade `public/sw.js`** al patrón de 3 estrategias:
  - assets (`*.js`, `*.css`, imágenes) → `cacheFirst`;
  - `/_serverFn/` (GET) → `networkFirst` (cachea respuestas de server functions sanas);
  - navegación → `networkFirstWithOffline` (cae al HTML app cacheado; última opción `offline.html`);
  - conservar `SKIP_WAITING` (lo usa `pwa-register.tsx`) y `UNREGISTER` (solo DEV).
- [ ] `public/offline.html` — fallback HTML puro de último recurso.
- [ ] Precache en `install`: `/`, `/offline.html`, `/manifest.json`, `/logo192.png`, `/logo512.png`, `/favicon.ico`.
- [ ] No romper la instalación PWA: validar `manifest.json`, update flow y `beforeinstallprompt` al final de cada fase.
- [ ] **Verificación:** build + DevTools (Application → Service Workers) y navegación offline a página ya visitada.

### Fase 1 — Lectura offline (navegar con datos)

Objetivo: las queries guardan su último resultado y lo devuelven offline.

- [ ] `src/lib/offline/db.ts` (todo el modelo de §3).
- [ ] `src/lib/offline/errors.ts` → `OfflineNoCacheError` + `isOfflineNoCacheError`.
- [ ] **Sesión offline:** `src/lib/offline/session.ts` → `getCachedSession()` (try server → IDB `meta`).
  Ajustar `src/lib/protected-route.ts`, loader de `__root.tsx` y cualquier `getSession()` crítico.
- [ ] Modificar **6 queryOptions** con el patrón `networkMode: "always"` + write-through en éxito +
      fallback a cache + `OfflineNoCacheError` en catch:
  - `queries/reportes/iluminacion/reportes-query.ts` (3 factories: lista, "nuevo", por id)
  - `queries/reportes/iluminacion/areas/areas-query.ts` (lista por reportId y por id)
  - `queries/reportes/iluminacion/localizadas/localizadas-query.ts`
  - `queries/empresas/empresas-query.ts`
  - `queries/instrumentos/instrumentos-query.ts`
  - `queries/tecnico/tecnico-query.ts`
- [ ] `src/components/offline-route-block.tsx` + integrar `isOfflineNoCacheError` en
      `src/components/DefaultCatchBoundary.tsx` (ruta sin datos offline → bloqueo con "Volver / Reintentar").
- [ ] **Verificación:** online → navegar (se llena IDB); offline → recargar páginas ya visitadas con datos;
      offline → ruta nunca visitada → `OfflineRouteBlock`.

### Fase 2 — Mutaciones offline CREATE (foco principal de este sprint)

Objetivo: crear reporte + áreas + localizadas sin internet y sincronizarlas al reconectar.

#### 2.1 Preparación de servidor (unicidad de IDs)
- [ ] Agregar `id` al `reporteServerValidator` (`db/reportes/iluminacion/reporte-validator.ts`).
- [ ] `server/reportes/iluminacion/create-reporte-nuevo-server.ts` → usar `data.id` (D1).
- [ ] `src/components/reportes/iluminacion/nuevo-informe/create-reporte-nuevo.tsx` → pasar `id: crypto.randomUUID()`.
- [ ] (opcional, recomendado) Idempotencia por UUID en los 3 creates Drizzle (D7).

#### 2.2 Capa de sync
- [ ] `src/lib/offline/sync.ts` — `processMutationQueue()` con mutex `isSyncing`:
  - lee `mutation-queue` FIFO;
  - por entry: marca `syncing` → llama server fn según `entity + type` → si OK mueve a `history` y
    borra de la cola → si falla marca `failed` + `attempts` y sigue con el resto;
  - al terminar: si quedó vacía → `invalidateQueries` de todas las raíces.
  - dispatch inicial:
    | entity | create → server fn |
    |---|---|---|
    | `reportes-cache` | `createReporteNuevoServer({ data: payload })` |
    | `areas-cache` | `createAreaServer({ data: payload })` |
    | `localizadas-cache` | `createLocalizadaServer({ data: payload })` |

#### 2.3 Hooks con fallback ofline
Modificar los 3 `useMutation` de create para: try server → en catch encolar + escribir cache + devolver
el objeto local (con UUID generado por el cliente) para no romper el flujo de la UI:
- [ ] `queries/reportes/iluminacion/use-create-reporte-nuevo.ts`
- [ ] `queries/reportes/iluminacion/areas/use-create-area.ts`
- [ ] `queries/reportes/iluminacion/localizadas/use-create-localizada.ts`

El `onSuccess` existente (actualización optimista de `setQueryData`) **se mantiene igual**:
el objeto devuelto por el fallback tiene la misma forma que el de la server fn.

#### 2.4 UI de estados y sync automático
- [ ] Reescribir `src/components/offline-indicator.tsx`:
  - conteos `pending` / `syncing` / `failed` / `completed` (polling adaptativo: solo si `!online || pending>0`);
  - barra fija inferior con badges e iconos;
  - al reconectar (evento `online` o exit->pending) ejecuta `processMutationQueue()`;
  - botón "Reintentar" para operaciones `failed`.
- [ ] Montar `<OfflineIndicator />` en `src/routes/__root.tsx` (junto a `PWARegister`).
- [ ] **Verificación (a fondo, como pedís):** cortar red → crear reporte → crear áreas/localizadas →
      ver barra con conteos; DevTools IndexedDB (cola con entries); reconectar → auto-sync →
      cola vacía, IDs reales, `invalidateQueries` trae datos frescos.

### Fase 3 — Ruta de prueba / debug de la cola

Objetivo: ver el JSON de cada operación almacenada en IndexedDB y ejercitar reintentos.

- [ ] Ruta nueva: `src/routes/_protected/offline/debug.tsx` (bajo `_protected`, accesible solo logueado):
  - tabla de `mutation-queue` + `mutation-history`: id, entidad, tipo, estado, `attempts`, `lastError`, timestamps;
  - `<pre>{JSON.stringify(payload, null, 2)}</pre>` expandible por fila;
  - acciones: **Reintentar** (por fila y todas las failed), **Descartar**, y lectura cruda de stores cache;
  - query key de conteo compartida con el indicator (`["offline","queue"]`).
- [ ] Link/entrada a la ruta desde un lugar de baja fricción (perfil o menú de reportes) con etiqueta "Offline / Debug".

### Fase 4 — Mutaciones offline DELETE (después de validar create)

- [ ] `sync.ts` → dispatch `delete` para las 3 entidades:
  `deleteReporteServer({ data: { id } })`, `deleteAreaServer`, `deleteLocalizadaServer`.
- [ ] Modificar los 3 hooks de delete (`use-delete-reporte.ts`, `use-delete-area.ts`,
      `use-delete-localizada.ts`) con try/catch → encolar + `removeFromCache` + **cancelaciones locales (D8)**.
- [ ] Endurecer: delete de reporte borra caches locales de áreas/localizadas y cancela creates pendientes hijos.
- [ ] **Verificación:** offline delete de entidad online (sync) y de entidad aún pendiente (cancelación).

### Fase 5 — Mutaciones offline EDIT (posterior, alcance nuevo)

- [ ] Hooks `use-update-*` de las 3 entidades con fallback → cola `type: "update"`.
- [ ] Conflictos: última escritura gana (D9). Nota: los reportes desbloqueados con
      `creditConsumed=true` son solo-lectura; el fallback offline debe respetar ese flag
      (`_menu/route.tsx` ya lo maneja → la UI no ofrece edición, así que offline tampoco).

### Fase 6 — Verificación integral y checklist global

- [ ] `pnpm build`, `pnpm check`, `pnpm test`.
- [ ] Manual: instalación PWA intacta (`beforeinstallprompt`, «instalada», iOS, update flow).
- [ ] Online normal → mismas rutas/formularios de siempre (sin regresiones al quitar fallbacks).
- [ ] Offline → crear reporte completo + áreas + localizadas → verificar JSON en `/offline/debug` →
      reconectar → datos en la base (comprobar filas y joins con el PDF).
- [ ] Offline → eliminar (reporte y mediciones) → sync → datos ausentes en la base.
- [ ] Duplicados: reiniciar sync con entrada en `failed` → idempotencia (D7) no rompe.
- [ ] `graphify update .` al final para refrescar el grafo.

---

## 5. UI de estados (spec del `OfflineIndicator`)

| Estado | Visual | Acción |
|---|---|---|
| `pending > 0`, online | badge ámbar "N (pendiente)" | — |
| `syncing > 0` | badge azul con spinner "Sincronizando N…" | — |
| `failed > 0` | badge rojo "N fallaron" | botón Reintentar |
| `completed` reciente | toast/contador verde "N completadas" (TTL 24h) | — |
| offline | barra "Sin conexión — N pendientes guardados" | aviso |

Auto-sync: evento `online`, polling cada 5s cuando `!online || pending>0`, y al montar la app
si hay pendientes. Mutex `isSyncing` evita ejecuciones solapadas.

---

## 6. Riesgos y mitigaciones

| # | Riesgo | Mitigación |
|---|---|---|
| 1 | Romper instalación PWA al tocar el SW | Fase 0 conserva `SKIP_WAITING`/`UNREGISTER` y valida instalabilidad cada vez |
| 2 | `getSession()` falla offline → rutas protegidas caen | D4: `getCachedSession()` + store `meta` |
| 3 | Áreas/localizadas con `reportId` inválido al sincronizar | D1 (UUID client), D6 (FIFO), reintento en ciclos (D7) |
| 4 | Reintento choca con PK duplicada | D7 idempotencia por UUID |
| 5 | Delete offline de entidad no sincronizada falla siempre | D8 cancelaciones locales |
| 6 | Query de "reporte nuevo" sin cache → `useSuspenseQuery` rompe offline | Fase 1 cachea `["reporte-iluminacion-nuevo"]` |
| 7 | React Query pausa queryFn offline | `networkMode: "always"` en los 6 queryOptions |
| 8 | Fotografías no subibles offline | D10: sin imágenes en sprint inicial; fase futura blobs + upload diferido |
| 9 | PDFs/render offline | fuera de alcance inicial (requieren datos full + assets del renderer) |

---

## 7. Fuera de alcance (se documenta para evitar sorpresas)

- Fotos / archivos adjuntos offline (UploadThing) — fase futura.
- Generación de PDF descargable sin conexión.
- Sincronización bidireccional con resolución de conflictos (D9).
- Soporte offline multi-dispositivo/sesión compartida (cada sesión offline tiene su own `userId`).

---

## 8. Orden de ejecución recomendado (resumen ejecutivo)

1. **Fase 0** infra SW + `offline.html` → instalar y navegar offline.
2. **Fase 1** caches de lectura + sesión offline → navegar offline con datos.
3. **Fase 3** ruta de debug (se construye junto con la Fase 2 para poder inspeccionar).
4. **Fase 2** create offline completo (servidor IDs + sync + hooks + indicator) → **probar a fondo**.
5. **Fase 4** delete offline → probar.
6. **Fase 5** edit offline → probar.
7. **Fase 6** verificación integral.

Listo. Escribí el plan completo en plan-offline.md. Resumen:

Sí, es posible. Reutilizás la PWA actual (manifest + SW + install) y agregás encima las dos capas en IndexedDB: *‑cache (lectura/navegación) y mutation-queue (operaciones con status pending → syncing → failed/completed).
Clave del diseño (D1): generás el UUID siempre en el cliente, como ya hacen áreas/localizadas (crypto.randomUUID()). Solo hay un cambio de servidor pedido: create-reporte-nuevo-server.ts:14 hoy sobreescribe el id, hay que hacerlo respetar el del cliente. Así los reportId de áreas/localizadas son estables offline y el sync no requiere remapeo.
Orden: Fase 0 (SW con 3 estrategias + offline.html) → Fase 1 (caches de los 6 queryOptions + sesión offline) → Fase 3 (ruta /offline/debug para ver el JSON de la cola) → Fase 2 (create en las 3 tablas, sync + OfflineIndicator con conteos y reintento) → Fase 4 (delete) → Fase 5 (edit) → Fase 6 (verificación).
Riesgos cubiertos: sesión offline (store meta), idempotencia por UUID, cancelaciones locales al borrar algo aún no sincronizado, fotos fuera del sprint inicial (UploadThing), networkMode:"always".

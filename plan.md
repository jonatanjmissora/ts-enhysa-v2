# Plan Offline + PWA — Fases Restantes

> **Estado:** Fase 1 completada. Este documento detalla las fases 2 y 3 pendientes.
> **Skill de referencia:** `offline-pwa` (patrón extraído de producción).

---

## ✅ Fase 1 — Completada

Lo siguiente ya está implementado y funcionando:

- [x] `public/sw.js` con 3 estrategias (`cacheFirst`, `networkFirst`, `networkFirstWithOffline`)
- [x] `public/offline.html` (fallback estático sin JS)
- [x] `src/lib/offline/errors.ts` (`OfflineNoCacheError` + `isOfflineNoCacheError`)
- [x] `src/hooks/use-online-status.ts` (`useSyncExternalStore`, SSR-safe)
- [x] `src/components/offline-route-block.tsx`
- [x] `src/components/DefaultCatchBoundary.tsx` (detecta `OfflineNoCacheError`)
- [x] try/catch en 10 `queryOptions` de 6 entidades
- [x] Fix `pwa-register.tsx` (bug `unregister`) + `meta theme-color` en `__root.tsx`

**Limitación actual:** el SW cachea assets y páginas, pero los datos de las queries **no persisten** entre sesiones offline. Sin IndexedDB, una recarga offline pierde todo salvo lo que el SW tenga en Cache API.

---

## 🚧 Fase 2 — IndexedDB + Persistencia de Lectura

**Objetivo:** que las queries puedan leer datos guardados localmente cuando están offline. Sin mutaciones todavía — solo lectura offline-first.

### 2.1 Setup

- [ ] Instalar dependencia: `pnpm add idb`
- [ ] Verificar que `idb` queda en `dependencies` (no `devDependencies`) — se usa en cliente

### 2.2 Crear `src/lib/offline/db.ts`

IndexedDB con `idb`. **7 object stores:**

| Store | Key | Propósito |
|-------|-----|-----------|
| `mutation-queue` | `id` (autoIncrement) | Cola FIFO de mutaciones offline (Fase 3) |
| `empresas-cache` | `id` (string) | Cache de empresas |
| `instrumentos-cache` | `id` (string) | Cache de instrumentos |
| `tecnicos-cache` | `id` (string) | Cache de técnicos |
| `reportes-iluminacion-cache` | `id` (string) | Cache de reportes |
| `areas-iluminacion-cache` | `id` (string) | Cache de áreas |
| `localizadas-iluminacion-cache` | `id` (string) | Cache de localizadas |

Funciones genéricas por store (factorizar para no repetir 6×):

```ts
// Patrón a aplicar a las 6 entidades:
putEntityInCache(store, entity)
getCachedEntityById(store, id)
getCachedEntitiesAll(store)          // para queries de lista
removeEntityFromCache(store, id)
clearEntityCache(store)
```

**Gotchas a respetar:**
- `const isClient = typeof window !== "undefined"` antes de toda llamada a IDB
- Verificar `db.objectStoreNames.contains()` en `upgrade()` antes de crear stores
- `DB_VERSION = 1` inicial, bumpar si se agregan stores en el futuro

### 2.3 Modificar `queryOptions` — agregar fallback IDB + `networkMode: "always"`

Los mismos 10 `queryOptions` de la Fase 1 ahora ganan:

1. **`networkMode: "always"`** — obligatorio para que RQ ejecute el `queryFn` aunque esté offline
2. **Write-through en éxito** — después de fetch exitoso, guardar en IDB
3. **Fallback a IDB en catch** — si falla y hay cache, devolver cache; si no hay, `throw OfflineNoCacheError`

**Patrón final por query:**

```ts
queryFn: async () => {
  try {
    const data = await getXxxServer()
    if (isClient) await putEntitiesInCache("xxx-cache", data)   // write-through
    return data
  } catch {
    if (!isClient) throw new OfflineNoCacheError()
    const cached = await getCachedEntitiesAll("xxx-cache")      // fallback IDB
    if (!cached || cached.length === 0) throw new OfflineNoCacheError()
    return cached
  }
},
networkMode: "always",   // ⚠️ CLAVE — sin esto RQ no ejecuta offline
```

**Archivos a modificar (los mismos 6 de la Fase 1):**

| Archivo | queryOptions |
|---------|-------------|
| `queries/empresas/empresas-query.ts` | `empresasQueryOptions` |
| `queries/instrumentos/instrumentos-query.ts` | `instrumentosQueryOptions` |
| `queries/tecnico/tecnico-query.ts` | `tecnicoQueryOptions` |
| `queries/reportes/iluminacion/reportes-query.ts` | `reportesQueryOptions`, `reporteNuevoQueryOptions`, `reporteQueryOptions` |
| `queries/reportes/iluminacion/areas/areas-query.ts` | `areasQueryOptions`, `areaQueryOptions` |
| `queries/reportes/iluminacion/localizadas/localizadas-query.ts` | `localizadasQueryOptions`, `localizadaQueryOptions` |

> **Nota sobre queries por ID individual (`reporteQueryOptions`, `areaQueryOptions`, `localizadaQueryOptions`):** ya tienen `initialData` que lee del cache de RQ en memoria. El fallback IDB es complementario — cubre el caso de recarga fría offline donde el cache en memoria no existe.

### 2.4 Verificación de Fase 2

- [ ] Offline + recarga en página ya visitada → datos se ven desde IDB
- [ ] Offline + navegar a página **no** visitada antes → `OfflineRouteBlock`
- [ ] Online → datos frescos + se actualiza el cache IDB en silencio
- [ ] DevTools → Application → IndexedDB → ver los 7 stores con datos

---

## 🚧 Fase 3 — Mutation Queue + Sync Offline

**Objetivo:** que las mutaciones (create/update/delete) funcionen offline, se encolen en IDB, y se sincronicen automáticamente al reconectar.

### 3.1 Crear `src/lib/offline/sync.ts`

```ts
processMutationQueue(): Promise<boolean>
```

- Mutex con `isSyncing` para evitar syncs concurrentes
- Lee la cola FIFO de `mutation-queue`
- Para cada entry: ejecuta la server function correspondiente según `type` y `entity`
- Tolerante a fallos individuales (un item fallido no bloquea los siguientes)
- Al vaciar la cola: `clearEntityCache()` + `invalidateQueries` para traer IDs definitivos del server

**Mapeo entity → server functions (a definir en sync.ts):**

| Entity | create | update | delete |
|--------|--------|--------|--------|
| empresas | `createEmpresaServer` | `updateEmpresaServer` | `deleteEmpresaServer` |
| instrumentos | `createInstrumentoServer` | `updateInstrumentoServer` | `deleteInstrumentoServer` |
| tecnicos | `createTecnicoServer` | `updateTecnicoServer` | — |
| reportes | `createReporteNuevoServer` | `updateReporteServer` | `deleteReporteServer` |
| areas | `createAreaServer` | `updateAreaServer` | `deleteAreaServer` |
| localizadas | `createLocalizadaServer` | `updateLocalizadaServer` | `deleteLocalizadaServer` |

> **Caso especial — reportes:** tiene workflow draft → finalized. Mapear `useUpdateReporteNuevo` (draft) y `useFinalReporteNuevo` (finalize) como `type: "update"` con la server fn correcta.

### 3.2 Modificar mutation hooks — agregar fallback a cola

Los **25 mutation hooks** actuales hacen solo `mutationFn: server()`. Hay que envolverlos con try/catch:

**Patrón CREATE:**
```ts
mutationFn: async ({ data }) => {
  try {
    return await createXxxServer({ data })
  } catch {
    const newEntity = { ...data, id: crypto.randomUUID() }  // ID temporal
    await addMutationToQueue({ entity: "xxx", type: "create", payload: newEntity })
    await putEntityInCache("xxx-cache", newEntity)
    return newEntity
  }
},
```

**Patrón UPDATE:**
```ts
mutationFn: async ({ data }) => {
  try {
    return await updateXxxServer({ data })
  } catch {
    await addMutationToQueue({ entity: "xxx", type: "update", payload: data })
    await putEntityInCache("xxx-cache", data)
    return data
  }
},
```

**Patrón DELETE:**
```ts
mutationFn: async ({ data }) => {
  try {
    await deleteXxxServer({ data })
  } catch {
    await addMutationToQueue({ entity: "xxx", type: "delete", payload: data })
    await removeEntityFromCache("xxx-cache", data.id)
  }
  return data
},
```

**Archivos a modificar (mutation hooks):**

| Archivo | Hooks |
|---------|-------|
| `queries/empresas/use-create-empresa.ts` | `useCreateEmpresa` |
| `queries/empresas/use-update-empresa.ts` | `useUpdateEmpresa` |
| `queries/empresas/use-delete-empresa.ts` | `useDeleteEmpresa` |
| `queries/instrumentos/use-create-instrumento.ts` | `useCreateInstrumento` |
| `queries/instrumentos/use-update-instrumento.ts` | `useUpdateInstrumento` |
| `queries/instrumentos/use-delete-instrumento.ts` | `useDeleteInstrumento` |
| `queries/tecnico/use-create-tecnico.ts` | `useCreateTecnico` |
| `queries/tecnico/use-update-tecnico.ts` | `useUpdateTecnico` |
| `queries/reportes/iluminacion/use-create-reporte-nuevo.ts` | `useCreateReporteNuevo` |
| `queries/reportes/iluminacion/use-update-reporte.ts` | `useUpdateReporteNuevo`, `useUpdateReporte` |
| `queries/reportes/iluminacion/use-final-reporte-nuevo.ts` | `useFinalReporteNuevo` |
| `queries/reportes/iluminacion/use-delete-reporte.ts` | `useDeleteReporteNuevo`, `useDeleteReporte` |
| `queries/reportes/iluminacion/areas/use-create-area.ts` | `useCreateArea` |
| `queries/reportes/iluminacion/areas/use-update-area.ts` | `useUpdateArea` |
| `queries/reportes/iluminacion/areas/use-delete-area.ts` | `useDeleteArea` |
| `queries/reportes/iluminacion/localizadas/use-create-localizada.ts` | `useCreateLocalizada` |
| `queries/reportes/iluminacion/localizadas/use-update-localizada.ts` | `useUpdateLocalizada` |
| `queries/reportes/iluminacion/localizadas/use-delete-localizada.ts` | `useDeleteLocalizada` |

### 3.3 Ajustar `MutationEntry` en `db.ts`

La estructura del entry de cola necesita identificar la entidad (no solo el tipo):

```ts
export type MutationEntry = {
  id?: number
  entity: "empresas" | "instrumentos" | "tecnicos" |
          "reportes-iluminacion" | "areas-iluminacion" | "localizadas-iluminacion"
  type: "create" | "update" | "delete"
  payload: any
  createdAt: number
}
```

### 3.4 Crear `src/components/offline-indicator.tsx`

Barra fija inferior que muestra:
- Estado offline (`WifiOff`) + conteo de pendientes
- Estado syncing (`Wifi` + spinner) mientras sincroniza
- Polling adaptativo: solo activo cuando `!isOnline || pending > 0`
- Auto-sync al reconectar (único dueño del trigger de `processMutationQueue`)
- Al finalizar sync: `invalidateQueries` para refrescar datos con IDs definitivos

### 3.5 Montar `OfflineIndicator` en `__root.tsx`

- Importar y montar `<OfflineIndicator />` dentro de `<body>` junto a `<PWARegister />`

### 3.6 Verificación de Fase 3

- [ ] Offline → crear/editar/eliminar → aparece en barra de pendientes
- [ ] Reconectar → auto-sync → barra desaparece → datos se refrescan
- [ ] Sync tolerante: si un item falla, los demás se procesan
- [ ] IDs temporales se reemplazan por IDs del server tras sync exitoso
- [ ] DevTools → IndexedDB → `mutation-queue` se vacía tras sync

---

## 📊 Resumen de Esfuerzo Estimado

| Fase | Archivos nuevos | Archivos modificados | Complejidad |
|------|----------------|---------------------|-------------|
| ~~Fase 1~~ | ~~5~~ | ~~8~~ | ~~Baja~~ |
| **Fase 2** | 1 (`db.ts`) | 6 (queries) | Media |
| **Fase 3** | 2 (`sync.ts`, `offline-indicator.tsx`) | 18 (mutation hooks) + `db.ts` + `__root.tsx` | Alta |

---

## 🔑 Gotchas Críticos a Recordar

| # | Problema | Solución |
|---|---------|---------|
| 1 | RQ pausa `queryFn` cuando detecta offline | `networkMode: "always"` en TODOS los queryOptions con fallback |
| 2 | IndexedDB no existe en SSR | `isClient` check antes de toda llamada a IDB |
| 3 | IDs temporales en creates offline | Al sync exitoso: `clearEntityCache()` + `invalidateQueries` |
| 4 | Polling innecesario cuando todo OK | `shouldPoll` solo si `!isOnline \|\| pending > 0` |
| 5 | Migraciones IDB fallan si store existe | `db.objectStoreNames.contains()` en `upgrade()` |
| 6 | Syncs concurrentes | Mutex `isSyncing` en `processMutationQueue` |
| 7 | Reportes tiene workflow draft→final | Mapear server fns correctas en `sync.ts` según estado |

---

## 🧪 Cómo Probar Cada Fase

### Fase 2 (lectura offline)
```
pnpm build && pnpm start
# 1. Navegar online a /perfil/empresas → datos se cachean en IDB
# 2. DevTools → Network → Offline
# 3. Recargar → datos se ven desde IDB
# 4. DevTools → Application → IndexedDB → verificar stores con datos
```

### Fase 3 (mutaciones offline)
```
# 1. Online → cargar páginas para tener cache
# 2. Offline → crear/editar/eliminar empresas
# 3. Ver barra "N cambios pendientes"
# 4. DevTools → Application → IndexedDB → mutation-queue con entries
# 5. Online → auto-sync → barra desaparece → datos refrescados
```

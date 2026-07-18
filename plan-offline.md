# Plan Offline + PWA — Enhysa

> Referencia: [`offline-pwa`](.agents/skills/offline-pwa/SKILL.md) — patrón genérico con código completo y gotchas.

---

## ✅ Completado

### Setup
- [x] `pnpm add idb`
- [x] `public/sw.js` con 3 estrategias + manejador `SKIP_WAITING`
- [x] `public/offline.html` (HTML puro)
- [x] `public/manifest.json`
- [x] Iconos 192×192 y 512×512

### Fase 1 — Infraestructura PWA
- [x] `src/hooks/use-online-status.ts`
- [x] `src/lib/offline/errors.ts`
- [x] `src/components/pwa-register.tsx`
- [x] `src/components/offline-route-block.tsx`
- [x] `src/components/DefaultCatchBoundary.tsx` con `isOfflineNoCacheError`
- [x] `<link rel="manifest">` + `<meta name="theme-color">` en head
- [x] `<PWARegister />` montado en body

### Fase 2 — Lectura offline
- [x] `src/lib/offline/db.ts` — 7 stores (mutation-queue + 6 entidades)
- [x] `networkMode: "always"` en 10 queryOptions
- [x] Write-through a IDB en éxito
- [x] Fallback a IDB + `OfflineNoCacheError` en catch

### Fase 3 — Parcial
- [x] `src/lib/offline/sync.ts` — dispatch por entity, mutex `isSyncing`
- [x] `src/components/offline-indicator.tsx` — polling adaptativo + auto-sync
- [x] `<OfflineIndicator />` montado en body
- [ ] try/catch en **todos** los useMutation (10/22 — faltan 12)

---

## 🚧 Pendientes

### Fase 3 — Mutaciones offline faltantes

Agregar try/catch → `addMutationToQueue` + `putEntityInCache` / `removeEntityFromCache`:

| # | Hook | Archivo |
|---|------|---------|
| 1 | `useDeleteEmpresa` | `queries/empresas/use-delete-empresa.ts` |
| 2 | `useCreateInstrumento` | `queries/instrumentos/use-create-instrumento.ts` |
| 3 | `useUpdateInstrumento` | `queries/instrumentos/use-update-instrumento.ts` |
| 4 | `useDeleteInstrumento` | `queries/instrumentos/use-delete-instrumento.ts` |
| 5 | `useCreateTecnico` | `queries/tecnico/use-create-tecnico.ts` |
| 6 | `useUpdateTecnico` | `queries/tecnico/use-update-tecnico.ts` |
| 7 | `useCreateReporteNuevo` | `queries/reportes/iluminacion/use-create-reporte-nuevo.ts` |
| 8 | `useUpdateReporteNuevo` | `queries/reportes/iluminacion/use-update-reporte.ts` |
| 9 | `useUpdateReporte` | `queries/reportes/iluminacion/use-update-reporte.ts` |
| 10 | `useFinalReporteNuevo` | `queries/reportes/iluminacion/use-final-reporte-nuevo.ts` |
| 11 | `useDeleteReporteNuevo` | `queries/reportes/iluminacion/use-delete-reporte.ts` |
| 12 | `useDeleteReporte` | `queries/reportes/iluminacion/use-delete-reporte.ts` |

### Verificación (Fase 3)

- [ ] Offline → crear/editar/eliminar → barra muestra pendientes
- [ ] Reconectar → auto-sync → barra desaparece → datos refrescados
- [ ] DevTools → IndexedDB → mutation-queue con entries / vacía tras sync
- [ ] IDs temporales se reemplazan por IDs del server tras sync
- [ ] Actualizar SW → rebuild → preview → toast "Nueva versión disponible"

# Plan PWA vs Offline — Separacion Segura

> Objetivo: conservar la instalacion PWA y eliminar la implementacion offline incompleta sin romper la app ni la instalabilidad.

## Alcance

Este plan no cambia codigo. Define el orden seguro para auditar, separar y luego eliminar offline.

Estado actual auditado en este repo:

- La instalacion PWA existe y esta distribuida entre `public/manifest.json`, `src/hooks/use-install.ts`, `src/hooks/use-install-verification.ts`, `src/store/install-store.ts`, `src/components/install-prompt.tsx`, `src/components/pwa-install-listener.tsx`, `src/components/pwa-register.tsx`, `src/routes/__root.tsx` y `src/routes/_protected/index.tsx`.
- La capa offline existe a medias y esta distribuida entre `public/sw.js`, `public/offline.html`, `src/lib/offline/*`, `src/hooks/use-online-status.ts`, `src/components/offline-*`, `src/components/DefaultCatchBoundary.tsx`, varios `queryOptions` y varios hooks de mutacion.
- `vite.config.ts` no usa `vite-plugin-pwa` ni Workbox. El proyecto depende de un Service Worker manual registrado desde `src/components/pwa-register.tsx`.
- `package.json` tiene `idb`, usada por la capa offline.

## Principio Rector

No borrar "todo lo del Service Worker".

Primero hay que separar responsabilidades:

- PWA/instalacion: manifest, iconos, listeners de instalacion, estado `pwa-installed`, modo standalone, prompt de instalacion, verificacion de instalada, registro del SW y update flow.
- Offline: fallback de navegacion offline, cache de datos, IndexedDB, cola de mutaciones, sync al reconectar, UI de conectividad y errores pensados para falta de cache local.

Hasta no terminar la separacion, el Service Worker se considera archivo compartido.

## Clasificacion Actual

### A. Conservar para PWA

- `public/manifest.json`
- `public/logo192.png`
- `public/logo512.png`
- `src/store/install-store.ts`
- `src/hooks/use-install.ts`
- `src/hooks/use-install-verification.ts`
- `src/components/install-prompt.tsx`
- `src/components/pwa-install-listener.tsx`
- `src/routes/_protected/index.tsx` por `useInstallVerification()`
- `src/routes/__root.tsx` por `rel="manifest"` y montaje de listeners PWA

### B. Candidatos a eliminar cuando ya no tengan consumidores

- `src/lib/offline/db.ts`
- `src/lib/offline/sync.ts`
- `src/lib/offline/errors.ts`
- `src/hooks/use-online-status.ts`
- `src/components/offline-indicator.tsx`
- `src/components/offline-route-block.tsx`
- `public/offline.html`
- dependencia `idb`

Tambien son candidatos los `queryOptions` y hooks con fallback offline:

- `queries/empresas/empresas-query.ts`
- `queries/instrumentos/instrumentos-query.ts`
- `queries/tecnico/tecnico-query.ts`
- `queries/reportes/iluminacion/reportes-query.ts`
- `queries/reportes/iluminacion/areas/areas-query.ts`
- `queries/reportes/iluminacion/localizadas/localizadas-query.ts`
- hooks de mutacion que importan `@/lib/offline/db`

### C. Compartidos y de alto cuidado

- `public/sw.js`
- `src/components/pwa-register.tsx`
- `src/components/DefaultCatchBoundary.tsx`
- `src/routes/__root.tsx`

## Estrategia General

Separar en 3 etapas:

1. Auditar y clasificar.
2. Desacoplar PWA de offline en archivos compartidos.
3. Eliminar offline y verificar que PWA siga instalable.

## Fase 1 — Auditoria Exhaustiva

Objetivo: tener inventario completo antes de tocar nada.

Pasos:

1. Listar todos los imports que apunten a:
   - `@/lib/offline/db`
   - `@/lib/offline/sync`
   - `@/lib/offline/errors`
   - `@/hooks/use-online-status`
2. Listar todos los archivos que dependan de `OfflineNoCacheError`.
3. Listar todos los hooks de mutacion que usan `addMutationToQueue`, `putEntityInCache` o `removeEntityFromCache`.
4. Revisar `public/sw.js` y etiquetar linea por linea que regla es:
   - necesaria para instalacion/update;
   - opcional pero segura para PWA;
   - propia de offline.
5. Confirmar si `public/offline.html` solo es usado desde `networkFirstWithOffline()` del SW.
6. Confirmar si `offlineReady` en `src/components/pwa-register.tsx` es solo texto/UI o si condiciona algo funcional.

Resultado esperado:

- una tabla final `archivo -> conservar / eliminar / compartido`;
- una lista de imports a romper antes de borrar archivos;
- una lista de dependencias que quedan huerfanas si se saca offline.

## Fase 2 — Diseno de Separacion

Objetivo: decidir como queda el codigo despues de sacar offline, antes de borrar archivos.

### 2.1 Service Worker minimo a conservar

No asumir que el SW puede borrarse.

Definir una version minima orientada a PWA que conserve solo:

- registro del SW desde `src/components/pwa-register.tsx`;
- ciclo de update (`updatefound`, `waiting`, `SKIP_WAITING`, `controllerchange`);
- precache minimo de recursos PWA criticos si sigue siendo necesario;
- cualquier condicion estrictamente requerida para que la app siga siendo instalable en los navegadores objetivo.

Eliminar de ese diseño minimo, si no es requerido para instalacion:

- fallback a `offline.html`;
- respuestas offline `503` pensadas para navegacion sin red;
- estrategias de cache de datos o navegacion orientadas a uso offline real.

### 2.2 Root layout minimo a conservar

`src/routes/__root.tsx` deberia seguir quedando con:

- `rel="manifest"`;
- `theme-color`;
- `<PWAInstallListener />`;
- `<PWARegister />`.

Y deberia perder, cuando llegue la fase de implementacion:

- `<OfflineIndicator />`.

### 2.3 Error handling a separar

`src/components/DefaultCatchBoundary.tsx` hoy mezcla errores generales con `OfflineNoCacheError`.

Antes de eliminar `src/lib/offline/errors.ts`, definir uno de estos dos caminos:

1. quitar el caso especial offline y dejar solo el boundary general;
2. reemplazarlo por un error de datos comun que no dependa de offline.

Para este objetivo conviene el camino 1, porque es el minimo y deja de arrastrar logica offline.

### 2.4 Queries y mutaciones a limpiar

Todos los `queryOptions` que hoy hacen:

- `networkMode: "always"` por offline fallback;
- `try server / catch IndexedDB / throw OfflineNoCacheError`;
- `saveEntityListToCache`, `putEntityInCache`, `getCachedEntityList`, `getCachedEntityById`, `getCachedEntitiesByField`;

deberian volver al flujo online normal del proyecto.

Las mutaciones que encolan cambios offline tambien deben volver a mutaciones online simples.

## Fase 3 — Orden Seguro de Implementacion

Objetivo: sacar offline sin romper imports ni comportamiento PWA.

Orden recomendado:

1. Simplificar primero archivos compartidos.
2. Desconectar consumidores de offline.
3. Borrar archivos offline ya huerfanos.
4. Quitar dependencia `idb`.
5. Verificar build e instalacion PWA.

### Paso 1

Aislar en `public/sw.js` el subconjunto minimo PWA y remover solo la parte offline del diseño.

### Paso 2

Simplificar `src/components/pwa-register.tsx` para que siga manejando:

- registro del SW;
- refresh/update flow;

pero deje de exponer mensajes o estados que representen readiness offline si ya no existira ese alcance.

### Paso 3

Retirar `OfflineIndicator` de `src/routes/__root.tsx`.

### Paso 4

Limpiar `DefaultCatchBoundary` para que no importe `isOfflineNoCacheError` ni `OfflineRouteBlock`.

### Paso 5

Revertir `queryOptions` a online-only, empezando por las queries base:

- empresas
- instrumentos
- tecnico
- reportes
- areas
- localizadas

### Paso 6

Eliminar la cola offline de las mutaciones que hoy importan helpers de `src/lib/offline/db.ts`.

### Paso 7

Cuando no queden imports a offline, borrar:

- `src/lib/offline/db.ts`
- `src/lib/offline/sync.ts`
- `src/lib/offline/errors.ts`
- `src/hooks/use-online-status.ts`
- `src/components/offline-indicator.tsx`
- `src/components/offline-route-block.tsx`
- `public/offline.html`

### Paso 8

Quitar `idb` de `package.json` solo al final.

## Fase 4 — Verificacion Tecnica

### Verificacion automatica

Ejecutar como minimo:

1. `pnpm build`
2. `pnpm test`
3. `pnpm check`

### Verificacion funcional PWA

Validar manualmente en browser objetivo:

1. La app sigue publicando `manifest.json` correctamente.
2. El navegador sigue registrando el Service Worker.
3. `beforeinstallprompt` sigue llegando cuando corresponde.
4. `InstallPrompt` sigue mostrando:
   - nada en standalone;
   - mensaje de instalada si corresponde;
   - CTA de instalar si corresponde;
   - instruccion iOS si corresponde.
5. `appinstalled` sigue marcando `pwa-installed`.
6. El flujo de update sigue funcionando.

### Verificacion funcional no-offline

Confirmar explicitamente que:

1. ya no existe UI de "Sin conexion";
2. ya no existe fallback offline de rutas;
3. si se corta internet, la app falla como web online normal, sin estados intermedios incompletos;
4. no quedan llamadas a IndexedDB;
5. no quedan imports de `src/lib/offline/*`.

## Riesgos Principales

### Riesgo 1 — Romper instalacion por tocar el SW demasiado pronto

Mitigacion:

- no borrar `public/sw.js` en el primer paso;
- primero reducirlo y luego validar instalacion.

### Riesgo 2 — Romper runtime por borrar `OfflineNoCacheError`

Mitigacion:

- primero limpiar `DefaultCatchBoundary` y queries consumidoras.

### Riesgo 3 — Romper datos por borrar `db.ts` antes de limpiar queries/mutations

Mitigacion:

- `db.ts` se elimina solo cuando no queden imports.

### Riesgo 4 — Dejar dependencias huerfanas

Mitigacion:

- al final correr busqueda global por `offline`, `idb`, `OfflineNoCacheError`, `useOnlineStatus`, `processMutationQueue`.

## Criterio de Aceptacion

La separacion se considera exitosa si se cumplen estas 5 condiciones:

1. La app compila y pasa chequeos.
2. Sigue siendo instalable como PWA.
3. El prompt de instalacion y el estado `pwa-installed` siguen funcionando.
4. No queda codigo de IndexedDB, queue o sync offline en runtime.
5. El Service Worker queda reducido a su responsabilidad PWA minima, sin comportamientos offline accidentales.

## Entrega Recomendada al Agente

Secuencia sugerida:

1. Auditoria: clasificar todo en A/B/C sin editar.
2. Propuesta: mostrar diff conceptual archivo por archivo.
3. Implementacion: eliminar solo offline, preservando PWA.
4. Verificacion: `build`, `test`, `check` y prueba manual de instalacion.

## Nota de version

Documentar el resultado esperado asi:

- v1: `PWA/instalacion = si`, `offline = no`
- v2 futura: `PWA/instalacion = si`, `offline = si`

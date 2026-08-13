Sí. Y creo que es el momento adecuado para actualizarlo, porque el plan original tenía una decisión que ya descartamos: **hacer que `getCachedSession()` reemplazara directamente a `getSession()` en `__root.tsx`**.

A partir de lo que comprobamos, el plan debería reflejar que **Better Auth sigue siendo la fuente de autenticación**, mientras Dexie mantiene una copia local para el futuro modo offline.

Te dejo la versión actualizada de `plan-offline.md`, incorporando lo implementado y las decisiones nuevas.

````md
# Plan Offline + PWA — Enhysa v2

> Plan de implementación del soporte offline para Enhysa v2.
>
> Objetivo: permitir navegar con datos previamente cacheados y crear, eliminar y
> posteriormente editar reportes y mediciones sin conexión, sincronizando las
> operaciones contra el servidor al recuperar internet.
>
> La PWA existente se conserva. IndexedDB/Dexie se utiliza como almacenamiento
> local para datos de lectura, sesión local y cola de mutaciones.

---

# 1. Estado actual auditado

## 1.1 PWA

La instalación PWA ya funciona y se conserva:

- `public/manifest.json`
- `public/logo192/512.png`
- `src/components/pwa-register.tsx`
- `src/components/pwa-install-listener.tsx`
- `src/components/install-prompt.tsx`
- `src/hooks/use-install*`
- `src/store/install-store.ts`

El componente:

```text
src/components/offline-indicator.tsx
````

actualmente solamente indica si existe o no conexión.

La infraestructura real de offline todavía no está implementada.

---

## 1.2 Service Worker

Actualmente:

```text
public/sw.js
```

es mínimo:

* `SKIP_WAITING`
* `UNREGISTER`
* `clients.claim`

No existe todavía cacheo de assets, navegación ni server functions.

---

## 1.3 Capa offline

La implementación offline anterior fue eliminada en:

```text
e4789fe
```

Actualmente:

* no existe la antigua `src/lib/offline/*`;
* Dexie se está incorporando nuevamente;
* no existe todavía mutation queue;
* no existe sincronización;
* las queries siguen siendo online-only.

---

# 2. Autenticación y sesión

Esta parte fue revisada y modificada respecto al diseño inicial.

## 2.1 Better Auth sigue siendo la fuente de autenticación

La aplicación utiliza Better Auth.

### Server

Existe:

```text
server/get-session.ts
```

con:

```ts
export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest()

    return await auth.api.getSession({
      headers: request.headers,
    })
  },
)
```

Esta función obtiene la sesión utilizando los headers/cookies de la request.

---

## 2.2 protectedRoute()

La protección de rutas continúa siendo server-side:

```ts
export async function protectedRoute() {
  const session = await getSession()

  if (!session) {
    throw redirect({ to: "/landing" })
  }

  return session
}
```

La ruta protegida continúa utilizando:

```ts
export const Route = createFileRoute("/_protected")({
  loader: async () => await protectedRoute(),
  component: RouteComponent,
})
```

### Decisión

`protectedRoute()` NO utiliza Dexie.

Su responsabilidad sigue siendo:

```text
request
  ↓
Better Auth
  ↓
getSession()
  ↓
si no existe → redirect
```

Esto evita mezclar autenticación real con almacenamiento offline.

---

# 3. Sesión en __root.tsx

## Decisión actual

El loader de `__root.tsx` continúa utilizando:

```ts
loader: async () => {
  const session = await getSession()

  return {
    session,
  }
}
```

NO se utiliza:

```ts
getCachedSession()
```

directamente desde el loader.

### Motivo

`__root.tsx` puede ejecutarse durante SSR.

Dexie/IndexedDB solamente existe en el navegador.

Intentar acceder a IndexedDB durante SSR produjo:

```text
DexieError [MissingAPIError]:
IndexedDB API missing
```

Por lo tanto:

```text
SSR
 ↓
getSession()
 ↓
Better Auth
```

es el flujo correcto para la sesión normal.

---

# 4. Better Auth Client → Dexie

Esta parte YA fue implementada y probada.

Better Auth client:

```text
src/lib/auth-client.ts
```

utiliza:

```ts
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL,
})
```

En cliente se utiliza:

```ts
authClient.useSession()
```

para obtener la sesión de Better Auth.

---

# 5. Base IndexedDB con Dexie

La aplicación utiliza:

```text
src/indexed-db/database.ts
```

y:

```ts
import Dexie, { type EntityTable } from "dexie"
```

La base se denomina:

```text
enhysa-db
```

---

## 5.1 SessionLocal

La sesión local se almacena de forma simplificada.

```ts
export interface SessionLocal {
  id: string
  email: string
  name: string
}
```

No se almacenan:

* cookies;
* tokens;
* passwords;
* refresh tokens;
* headers;
* información innecesaria de Better Auth.

La sesión local solamente contiene la información necesaria para identificar al usuario durante el modo offline.

---

## 5.2 Store session

La tabla utiliza:

```ts
session!: EntityTable<SessionLocal, "id">
```

y:

```ts
session: "id"
```

La clave primaria es el `user.id`.

---

# 6. session.ts

Archivo:

```text
src/lib/offline/session.ts
```

Responsabilidad:

* guardar sesión local;
* recuperar sesión local;
* eliminar sesión local.

---

## 6.1 cacheSession()

La función recibe la estructura de sesión del cliente de Better Auth:

```ts
export async function cacheSession(authSession: {
  user: {
    id: string
    email: string
    name: string
  }
}) {
  const sessionLocal: SessionLocal = {
    id: authSession.user.id,
    email: authSession.user.email,
    name: authSession.user.name,
  }

  await localDb.session.put(sessionLocal)
}
```

Better Auth proporciona:

```text
authSession
├── session
└── user
    ├── id
    ├── email
    └── name
```

Nosotros solamente persistimos:

```text
user.id
user.email
user.name
```

---

## 6.2 getCachedSession()

Existe como helper para el futuro modo offline:

```ts
export async function getCachedSession() {
  return await localDb.session.toCollection().first()
}
```

Devuelve:

```ts
SessionLocal | undefined
```

### Importante

Actualmente NO reemplaza a `getSession()` en:

* `__root.tsx`
* `protectedRoute()`
* SSR.

Su utilización queda reservada para la implementación del arranque/navegación offline.

---

## 6.3 clearCachedSession()

```ts
export async function clearCachedSession() {
  await localDb.session.clear()
}
```

Se ejecuta cuando Better Auth confirma que no existe una sesión.

---

# 7. OfflineSession

Archivo:

```text
src/components/offline-session.tsx
```

Este componente NO es un sistema independiente de autenticación.

Su responsabilidad es únicamente:

> sincronizar la sesión de Better Auth del cliente hacia Dexie.

Implementación:

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

Se monta globalmente en `RootDocument`:

```tsx
<OfflineSession />
```

---

# 8. Verificación realizada de la sesión

La sincronización Better Auth → Dexie fue probada manualmente.

## Caso 1 — aplicación sin sesión

Resultado:

```text
Session después de clear: []
```

Dexie:

```text
session = []
```

---

## Caso 2 — login usuario A

Resultado:

```text
Session guardada:
{
  id: "...",
  email: "...",
  name: "..."
}
```

Dexie contiene usuario A.

---

## Caso 3 — logout usuario A

Resultado:

```text
Session después de clear: []
```

Dexie queda vacía.

---

## Caso 4 — login usuario B

Resultado:

```text
Session guardada:
{
  id: "...",
  email: "...",
  name: "..."
}
```

Dexie contiene usuario B.

---

## Caso 5 — logout usuario B

Resultado:

```text
Session después de clear: []
```

Dexie queda vacía.

---

## Resultado

### Better Auth → Dexie

**VALIDADO ✅**

El comportamiento observado en DevTools:

```text
Data may be stale
```

corresponde a la representación visual de IndexedDB en DevTools.

Las lecturas realizadas directamente mediante Dexie confirmaron que:

* `put()` funciona;
* `clear()` funciona;
* el usuario cambia correctamente;
* no queda la sesión anterior en la base.

---

# 9. Arquitectura actual de sesión

La arquitectura queda:

```text
                    BETTER AUTH
                         │
             ┌───────────┴───────────┐
             │                       │
           SERVER                  CLIENT
             │                       │
        getSession()          authClient.useSession()
             │                       │
             │                       ▼
             │                OfflineSession
             │                       │
             │                       ▼
             │                 cacheSession()
             │                       │
             │                       ▼
             │                     Dexie
             │
             ▼
      protectedRoute()
             │
             ▼
       rutas protegidas
```

---

# 10. Pendiente: sesión offline real

Todavía NO está implementado el siguiente flujo:

```text
Aplicación inicia sin conexión
        ↓
Better Auth no puede obtener sesión del servidor
        ↓
getCachedSession()
        ↓
Dexie
        ↓
continuar con la sesión local
```

Esto requiere resolver cuidadosamente el comportamiento de:

* SSR;
* navegación client-side;
* loaders de TanStack Router;
* `getSession()`;
* `authClient.useSession()`;
* sesión almacenada en Dexie.

No se debe introducir Dexie directamente en código que pueda ejecutarse durante SSR.

---

# 11. Entidades y generación de IDs

| Tabla                     | Store cache         | ID        |
| ------------------------- | ------------------- | --------- |
| `tecnicos`                | `tecnicos`          | existente |
| `empresas`                | `empresas`          | existente |
| `instrumentos`            | `instrumentos`      | existente |
| `reportes_iluminacion`    | `reportes-cache`    | cliente   |
| `areas_iluminacion`       | `areas-cache`       | cliente   |
| `localizadas_iluminacion` | `localizadas-cache` | cliente   |

Dependencias:

```text
reportes_iluminacion
       │
       ├── areas_iluminacion
       │
       └── localizadas_iluminacion
```

`areas_iluminacion.reportId` y
`localizadas_iluminacion.reportId`
apuntan a:

```text
reportes_iluminacion.id
```

Por lo tanto el reporte debe tener un ID conocido por el cliente antes de crear hijos offline.

---

# 12. Decisión D1 — IDs generados por cliente

Actualmente áreas y localizadas ya generan:

```ts
crypto.randomUUID()
```

El reporte debe adoptar el mismo comportamiento.

Actualmente:

```text
create-reporte-nuevo-server.ts
```

genera el ID en servidor.

Debe modificarse para aceptar el ID generado por cliente.

Objetivo:

```text
cliente
  ↓
crypto.randomUUID()
  ↓
report.id
  ↓
area.reportId
  ↓
localizada.reportId
```

Así no existe necesidad de remapear IDs durante el sync.

---

# 13. Decisión D2 — Dos capas de IndexedDB

Dexie tendrá dos grandes responsabilidades:

## Cache de lectura

```text
*-cache
```

Contiene snapshots para poder navegar sin conexión.

## Escrituras pendientes

```text
mutation-queue
mutation-history
```

Contiene operaciones que todavía deben sincronizarse.

---

# 14. Modelo de MutationEntry

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

---

# 15. Stores IndexedDB pendientes

La base final deberá contener:

| Store                | Propósito               |
| -------------------- | ----------------------- |
| `mutation-queue`     | operaciones pendientes  |
| `mutation-history`   | operaciones completadas |
| `reportes-cache`     | reportes                |
| `areas-cache`        | áreas                   |
| `localizadas-cache`  | localizadas             |
| `tecnicos`           | técnico                 |
| `empresas-cache`     | empresas                |
| `instrumentos-cache` | instrumentos            |
| `session`            | sesión local            |

Actualmente solamente una parte de estos stores está implementada.

---

# 16. Fase 0 — Infraestructura PWA

Objetivo:

> permitir que la aplicación y su app shell estén disponibles sin conexión.

Pendiente:

* [ ] mejorar `public/sw.js`;
* [ ] cacheFirst para assets;
* [ ] networkFirst para requests apropiadas;
* [ ] fallback de navegación;
* [ ] `public/offline.html`;
* [ ] precache de assets esenciales;
* [ ] conservar `SKIP_WAITING`;
* [ ] conservar `UNREGISTER` en DEV;
* [ ] verificar instalación PWA después de cada modificación.

---

# 17. Fase 1 — Lectura offline

Objetivo:

> navegar con datos previamente obtenidos.

Pendiente:

* [ ] completar stores Dexie;
* [ ] cachear queries exitosas;
* [ ] fallback a cache cuando no exista conexión;
* [ ] `OfflineNoCacheError`;
* [ ] `OfflineRouteBlock`;
* [ ] modificar queryOptions;
* [ ] utilizar `networkMode: "always"` donde corresponda;
* [ ] validar navegación offline.

### Sesión

La infraestructura Better Auth → Dexie ya está implementada.

Pendiente:

* [ ] definir fallback real para el arranque offline;
* [ ] integrar `getCachedSession()` únicamente en código client-side o navegación donde no exista SSR;
* [ ] evitar acceso a Dexie durante SSR.

---

# 18. Fase 2 — Mutaciones offline CREATE

Objetivo:

> crear reportes, áreas y localizadas sin conexión.

Pendiente:

## Servidor

* [ ] aceptar ID generado por cliente para reportes;
* [ ] verificar validadores;
* [ ] mantener IDs de áreas/localizadas;
* [ ] implementar idempotencia por UUID.

## Queue

* [ ] implementar `mutation-queue`;
* [ ] implementar `mutation-history`;
* [ ] implementar `processMutationQueue()`;
* [ ] mutex para evitar sincronizaciones simultáneas;
* [ ] estados pending/syncing/failed/completed.

## Hooks

Modificar:

```text
use-create-reporte-nuevo.ts
use-create-area.ts
use-create-localizada.ts
```

Flujo:

```text
online
 ↓
server
 ↓
OK
```

o:

```text
offline/error
 ↓
IndexedDB
 ↓
mutation-queue
 ↓
cache local
 ↓
UI continúa trabajando
```

---

# 19. Orden de sincronización

FIFO:

```text
CREATE reporte
      ↓
CREATE área
      ↓
CREATE localizada
```

El reporte debe sincronizarse antes que sus hijos.

Los UUID estables permiten que:

```text
area.reportId === reporte.id
```

continue siendo válido tanto offline como online.

---

# 20. Idempotencia

Los creates deben soportar reintentos.

Problema:

```text
server inserta correctamente
        ↓
respuesta perdida
        ↓
cliente cree que falló
        ↓
reintenta
```

El segundo intento podría generar:

```text
duplicate primary key
```

Solución:

* `onConflictDoNothing()`;
* buscar posteriormente por ID;
* devolver la entidad existente.

Así un retry se considera exitoso.

---

# 21. Fase 3 — Debug Offline

Crear:

```text
/_protected/offline/debug
```

Debe mostrar:

* mutation queue;
* mutation history;
* entidad;
* tipo;
* estado;
* attempts;
* lastError;
* timestamps;
* payload completo.

Acciones:

* Reintentar;
* Reintentar todas;
* Descartar;
* inspeccionar caches.

Query key:

```text
["offline", "queue"]
```

---

# 22. Fase 4 — DELETE offline

Pendiente.

Regla:

Si existe:

```text
create pendiente
```

y el usuario elimina la entidad:

```text
NO crear delete
```

Se cancela el create.

Para un reporte:

```text
delete reporte
 ↓
cancelar creates pendientes de hijos
 ↓
eliminar caches
 ↓
encolar delete reporte
```

---

# 23. Fase 5 — EDIT offline

Pendiente.

Agregar:

```text
type: "update"
```

y sincronización de:

* reportes;
* áreas;
* localizadas.

Conflictos:

```text
última escritura gana
```

No se implementará resolución avanzada de conflictos en esta versión.

---

# 24. Fotos

Fuera del alcance inicial.

Actualmente las imágenes utilizan UploadThing.

Offline:

```text
FilesDropzone
    ↓
UploadThing
    ↓
requiere conexión
```

Por lo tanto el create offline inicial permitirá:

```text
imagenes: []
```

o conservar imágenes previamente existentes.

Futuro:

```text
Blob local
 ↓
IndexedDB
 ↓
conexión
 ↓
UploadThing
 ↓
URL
 ↓
sincronizar entidad
```

---

# 25. PDF offline

Fuera del alcance inicial.

No se garantiza:

* generación de PDF;
* descarga de PDF;
* renderer completo sin conexión.

Se evaluará posteriormente.

---

# 26. OfflineIndicator

Debe mostrar:

| Estado        | UI            |
| ------------- | ------------- |
| `pending > 0` | pendientes    |
| `syncing > 0` | sincronizando |
| `failed > 0`  | fallidas      |
| `completed`   | completadas   |
| offline       | sin conexión  |

Debe iniciar sync:

* al recibir `online`;
* al montar la aplicación si existen pendientes;
* mediante polling adaptativo mientras existan operaciones pendientes.

Debe utilizar mutex para evitar:

```text
sync()
sync()
sync()
```

simultáneos.

---

# 27. Riesgos

| Riesgo                             | Mitigación                         |
| ---------------------------------- | ---------------------------------- |
| Dexie durante SSR                  | nunca acceder desde loaders/server |
| sesión offline                     | Dexie + `getCachedSession()`       |
| ID padre desconocido               | UUID generado en cliente           |
| FK hijo antes que padre            | FIFO                               |
| retry después de respuesta perdida | idempotencia                       |
| delete de create pendiente         | cancelación local                  |
| imágenes offline                   | fuera de alcance inicial           |
| PDF offline                        | fuera de alcance inicial           |
| conflictos de edición              | última escritura gana              |
| DevTools muestra datos antiguos    | validar estado mediante Dexie      |

---

# 28. Verificación realizada

## Sesión

* [x] Login online guarda sesión en Dexie.
* [x] Logout elimina sesión de Dexie.
* [x] Login con usuario diferente reemplaza la sesión anterior.
* [x] Logout del segundo usuario vuelve a dejar Dexie vacía.
* [x] `authClient.useSession()` funciona.
* [x] `cacheSession()` funciona.
* [x] `clearCachedSession()` funciona.
* [x] No se accede a IndexedDB durante SSR.

---

# 29. Próximo objetivo

El siguiente trabajo NO es todavía la mutation queue.

Primero debemos resolver:

## Sesión offline real

Necesitamos conseguir:

```text
ONLINE
──────────────────

Better Auth
    ↓
getSession()
    ↓
Router
```

y:

```text
OFFLINE
──────────────────

Dexie
    ↓
getCachedSession()
    ↓
Router / aplicación
```

sin ejecutar Dexie durante SSR.

Una vez resuelto esto:

```text
Fase 1
lectura offline
```

puede implementarse con seguridad.

---

# 30. Orden actualizado de implementación

1. **Sesión Better Auth → Dexie** ✅
2. **Resolver recuperación de sesión offline** ← siguiente
3. **Fase 0 — Service Worker / App Shell**
4. **Fase 1 — Cache de lecturas**
5. **Fase 3 — Debug de IndexedDB/queue**
6. **Fase 2 — CREATE offline**
7. **Fase 4 — DELETE offline**
8. **Fase 5 — EDIT offline**
9. **Fase 6 — Verificación integral**

---

# 31. Estado actual resumido

```text
PWA
├── instalación                    ✅
├── manifest                       ✅
├── install prompt                 ✅
└── offline app shell              ⏳

Better Auth
├── server getSession()            ✅
├── authClient.useSession()        ✅
├── protectedRoute()               ✅
└── sesión offline                 ⏳

Dexie
├── database.ts                    ✅
├── session store                  ✅
├── cacheSession()                 ✅
├── clearCachedSession()           ✅
├── getCachedSession()             ✅
└── mutation queue                 ⏳

Offline
├── sesión offline                 ⏳
├── lectura/cache                  ⏳
├── CREATE                         ⏳
├── DELETE                         ⏳
├── EDIT                           ⏳
├── sync                           ⏳
├── debug                          ⏳
├── fotos                          ⏳
└── PDF                            ⏳
```

---

# 32. Principio arquitectónico

La aplicación no reemplaza Better Auth por una autenticación propia.

Better Auth continúa siendo responsable de:

* autenticación;
* sesión real;
* cookies;
* validación server-side;
* autorización.

Dexie es responsable de:

* datos necesarios para trabajar offline;
* snapshot de sesión;
* caches;
* cola de mutaciones;
* historial local de sincronización.

La sesión almacenada en Dexie **no constituye una sesión autenticada ante el servidor**.

Sirve para que la aplicación pueda mantener el contexto del usuario mientras está offline.

Cuando vuelva la conexión, las operaciones deberán volver a validarse mediante Better Auth en el servidor.

````

### Cambio conceptual importante respecto al plan anterior

La modificación principal es esta:

**Antes:**

```text
__root loader
    ↓
getCachedSession()
    ↓
Better Auth → fallback Dexie
````

**Ahora:**

```text
SSR / Router
    ↓
getSession()
    ↓
Better Auth
```

mientras, independientemente:

```text
Browser
    ↓
authClient.useSession()
    ↓
OfflineSession
    ↓
Dexie
```

Y **recién en el próximo paso** vamos a diseñar cómo hacemos que la segunda rama pueda tomar el control cuando la aplicación arranca offline. Esto evita volver a meter Dexie dentro de SSR, que fue justamente lo que provocó el `MissingAPIError`.

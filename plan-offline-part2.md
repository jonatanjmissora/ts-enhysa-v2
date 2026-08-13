# Plan Offline Part 2 — Arranque Offline + Opcion A

> Objetivo de esta parte: resolver que ocurre cuando la app inicia completamente offline, sin volver a mezclar SSR con Dexie.

---

# 1. Problema a resolver

Hoy el flujo normal es:

```text
__root.tsx
   ↓
loader
   ↓
getSession()
   ↓
Better Auth
```

Si la aplicacion inicia offline, el problema no es Dexie en si mismo.

El problema es este:

```text
app shell cacheada
   ↓
JS arranca en browser
   ↓
loader / serverFn intenta ir al server
   ↓
falla transporte
```

Mientras tanto Dexie puede tener:

```text
session
└── usuario A
```

pero el router todavia no sabe usarla para habilitar la UI.

---

# 2. Decision: Opcion A

La Opcion A es:

> Las rutas offline-capable usan una proteccion client-side cuando no hay conexion.

Esto implica tres reglas:

1. `getSession()` sigue siendo server-only.
2. `getCachedSession()` sigue siendo Dexie-only.
3. El fallback offline sucede en una capa browser-only, nunca dentro de SSR.

---

# 3. Idea central

No hay que hacer que `getCachedSession()` intente llamar al server.

No hay que meter Dexie dentro de `getSession()`.

No hay que usar `protectedRoute()` como unica puerta de entrada para rutas que deben abrir offline.

La arquitectura correcta es:

```text
SSR / server
  ↓
getSession()
  ↓
sesion real

Browser / offline startup
  ↓
SessionGate
  ├── usa sesion server si existe
  └── fallback a getCachedSession() si el server esta unreachable
```

---

# 4. Matriz de ejecucion

## 4.1 Hard load online

```text
browser request
  ↓
server SSR
  ↓
__root loader
  ↓
getSession()
  ↓
OK
```

Resultado:

* la app arranca con sesion real del server;
* `OfflineSession` continua sincronizando Better Auth -> Dexie.

## 4.2 Hard load offline sin shell cacheada

```text
browser request
  ↓
no network
  ↓
la app no arranca
```

Resultado:

* esto no se resuelve con React ni con Dexie;
* primero debe existir app shell / HTML / JS cacheado por la PWA.

## 4.3 Hard load offline con shell cacheada

```text
service worker entrega shell
  ↓
JS arranca en browser
  ↓
__root loader intenta getSession()
  ↓
request falla
  ↓
loader no debe romper
  ↓
SessionGate lee Dexie
```

Resultado deseado:

* la app arranca;
* el root conoce que el server no es alcanzable;
* el gate client-side decide si existe sesion local.

## 4.4 Navegacion client-side offline

```text
app ya abierta
  ↓
ruta offline-capable
  ↓
SessionGate ya resolvio sesion local
  ↓
la UI continua
```

## 4.5 Ruta protegida online-only

```text
ruta requiere server
  ↓
protectedRoute()
  ↓
sin server no entra
```

Resultado:

* no todas las rutas protegidas seran offline-capable;
* hay que separar el subtree offline-capable del subtree server-only.

---

# 5. Implementacion de la Opcion A

## 5.1 Mantener `getSession()` sin cambios conceptuales

`getSession()` sigue significando solo esto:

```text
obtener sesion real desde Better Auth
```

No conoce Dexie.

No hace fallback.

No resuelve modo offline.

## 5.2 Cambiar el objetivo del root loader

El root loader ya no debe ser responsable de decidir la sesion offline.

Su unica responsabilidad debe ser:

```text
intentar obtener la sesion server
   ↓
si el server responde: devolverla
si el server es unreachable en browser: devolver estado degradado
```

Propuesta de resultado del loader:

```ts
type RootSessionState = {
  serverSession: Session | null
  serverState: "ok" | "unreachable"
}
```

Comportamiento esperado:

* SSR online: `serverState = "ok"`
* browser online: `serverState = "ok"`
* browser offline con shell cacheada: `serverState = "unreachable"`

Importante:

* el root loader puede degradarse cuando falla el transporte del browser;
* no debe leer Dexie;
* no debe decidir redirect offline.

## 5.3 Crear un resolver browser-only

Archivo propuesto:

```text
src/lib/offline/resolve-app-session.ts
```

Responsabilidad:

```text
input:
  root loader result
  + navigator.onLine
  + getCachedSession()

output:
  AppSessionState
```

Tipo propuesto:

```ts
type AppSessionState = {
  status: "authenticated" | "anonymous" | "offline-no-session" | "resolving"
  session: AppSession | null
  source: "server" | "cache" | "none"
}
```

Reglas:

1. Si `serverSession` existe -> usarla.
2. Si `serverState === "unreachable"` -> intentar `getCachedSession()`.
3. Si hay session local -> devolver `source: "cache"`.
4. Si no hay session local -> devolver `offline-no-session`.
5. Si `serverState === "ok"` y `serverSession === null` -> usuario anonimo, no fallback.

Esta quinta regla es importante:

> Si estamos online y el server respondio `null`, no hay que usar Dexie, porque podria reanimar una sesion vieja despues de logout.

## 5.4 Crear `SessionGate`

Archivo propuesto:

```text
src/components/offline-session-gate.tsx
```

Este componente corre solo en browser y hace el fallback real.

Pseudocodigo:

```tsx
function OfflineSessionGate({
  rootSessionState,
  children,
}: {
  rootSessionState: RootSessionState
  children: React.ReactNode
}) {
  const [state, setState] = useState<AppSessionState>({
    status: "resolving",
    session: null,
    source: "none",
  })

  useEffect(() => {
    let cancelled = false

    async function resolve() {
      if (rootSessionState.serverSession) {
        if (!cancelled) {
          setState({
            status: "authenticated",
            session: mapServerSession(rootSessionState.serverSession),
            source: "server",
          })
        }
        return
      }

      if (rootSessionState.serverState === "unreachable") {
        const cached = await getCachedSession()

        if (!cancelled) {
          if (cached) {
            setState({
              status: "authenticated",
              session: mapCachedSession(cached),
              source: "cache",
            })
          } else {
            setState({
              status: "offline-no-session",
              session: null,
              source: "none",
            })
          }
        }

        return
      }

      if (!cancelled) {
        setState({
          status: "anonymous",
          session: null,
          source: "none",
        })
      }
    }

    void resolve()

    return () => {
      cancelled = true
    }
  }, [rootSessionState])

  if (state.status === "resolving") {
    return <FullScreenSpinner />
  }

  if (state.status === "offline-no-session") {
    return <OfflineNoSessionScreen />
  }

  if (state.status === "anonymous") {
    return <Navigate to="/landing" />
  }

  return <AppSessionProvider value={state}>{children}</AppSessionProvider>
}
```

## 5.5 Separar las rutas offline-capable

Esta es la parte estructural mas importante.

Mientras exista:

```text
/_protected
  loader: protectedRoute()
```

una ruta hija de ese subtree nunca podra arrancar offline por hard load.

Por eso la Opcion A requiere separar el arbol:

```text
/_protected-online
  loader: protectedRoute()
  └── rutas que requieren server si o si

/_protected-offline
  loader: no redirect server-side
  component: OfflineSessionGate
  └── rutas que pueden funcionar con sesion local + cache
```

Regla:

* `protectedRoute()` se mantiene para lo online-only;
* las rutas offline-capable pasan por `SessionGate`.

## 5.6 El Context ahora si tiene lugar, pero solo como presentacion

En el plan original estaba bien no usar Context como persistencia.

Eso se mantiene.

Pero en Opcion A si es valido usar un context derivado para exponer la sesion resuelta a componentes del subtree offline-capable.

Queda asi:

```text
Dexie = fuente local persistente
Context = transporte en memoria dentro de React
```

El Context no reemplaza Dexie.

## 5.7 `authClient.useSession()` no resuelve el arranque offline

`authClient.useSession()` sigue siendo util para sincronizar Better Auth -> Dexie cuando hay red.

Pero no debe ser la base del bootstrap offline, porque:

* depende de Better Auth client;
* puede quedar pending/error sin red;
* la app necesita una decision local mas directa.

Por eso el arranque offline debe leer Dexie explicitamente mediante `getCachedSession()`.

---

# 6. Estructura de archivos propuesta

```text
server/get-session.ts                        # sin fallback Dexie
src/routes/__root.tsx                       # devuelve RootSessionState
src/components/offline-session.tsx          # sync Better Auth -> Dexie
src/components/offline-session-gate.tsx     # fallback browser-only
src/lib/offline/session.ts                  # getCachedSession / cacheSession / clearCachedSession
src/lib/offline/resolve-app-session.ts      # logica de resolucion
src/lib/app-session-context.tsx             # context derivado para subtree offline
src/routes/_protected-online/route.tsx      # protectedRoute server-only
src/routes/_protected-offline/route.tsx     # SessionGate offline-capable
```

---

# 7. Pasos a seguir para la Part 2

## Fase A1 — Precisar alcance de rutas offline

Definir explicitamente:

* que rutas deben abrir offline;
* que rutas siguen siendo online-only;
* si el piloto sera una sola pantalla o un subtree chico.

Recomendacion:

* empezar con un subtree minimo;
* no migrar todo `/_protected` de una sola vez.

## Fase A2 — Degradar el root loader sin tocar Dexie

Objetivo:

* que `__root.tsx` no rompa cuando el browser no puede llegar al server;
* que devuelva `serverState: "unreachable"` en vez de explotar.

Regla:

* esta fase aun no habilita offline por si sola;
* solo evita que el bootstrap se caiga antes del gate.

## Fase A3 — Implementar `resolveAppSession()` browser-only

Objetivo:

* convertir `RootSessionState` + Dexie en una decision de sesion de la app.

Debe cubrir:

* server session real;
* offline con session local;
* offline sin session local;
* online anonimo.

## Fase A4 — Implementar `OfflineSessionGate`

Objetivo:

* bloquear render hasta resolver sesion;
* permitir el subtree offline-capable con `source: "cache"` o `source: "server"`;
* mostrar pantalla de no-autorizado offline cuando no exista sesion local.

## Fase A5 — Crear subtree `/_protected-offline`

Objetivo:

* separar rutas offline-capable de las que siguen dependiendo de `protectedRoute()`.

Regla de migracion:

* primero mover una sola ruta o un grupo pequeno;
* despues validar hard load offline;
* despues ampliar el alcance.

## Fase A6 — Adaptar consumo de sesion en componentes

Hoy varios componentes consumen:

```ts
const { session } = useLoaderData({ from: "__root__" })
```

En el subtree offline-capable eso debera reemplazarse progresivamente por algo como:

```ts
const { session, source } = useAppSession()
```

Objetivo:

* que el componente no dependa de que la sesion venga exclusivamente del loader SSR.

## Fase A7 — Verificacion manual del arranque offline

Casos a probar:

1. Online con sesion valida.
2. Online sin sesion.
3. Offline con shell cacheada + session Dexie.
4. Offline con shell cacheada + sin session Dexie.
5. Reapertura de PWA offline.
6. Navegacion client-side offline.
7. Volver online despues de haber arrancado offline.

---

# 8. Checklist de implementacion

## 8.1 Checklist maestro

* [ ] A1. Definir el alcance del piloto offline.
* [x] A2. Hacer que `__root.tsx` degrade el estado de sesion sin romper el bootstrap.
* [ ] A3. Implementar el resolver browser-only de sesion de app.
* [ ] A4. Implementar `OfflineSessionGate`.
* [ ] A5. Crear el subtree `/_protected-offline`.
* [ ] A6. Migrar al menos una ruta piloto al subtree offline-capable.
* [ ] A7. Ejecutar la verificacion manual completa.

## 8.2 A1 — Alcance del piloto offline

Objetivo:

* elegir una primera ruta o grupo pequeno de rutas para validar el arranque offline.

Checklist:

* [ ] Listar rutas candidatas que hoy viven dentro de `/_protected`.
* [ ] Marcar cuales dependen solo de datos cacheables y cuales requieren server si o si.
* [ ] Elegir una ruta piloto offline-capable.
* [ ] Definir explicitamente que rutas quedan en `/_protected-online`.
* [ ] Dejar esa decision escrita en `plan-offline-part2.md` o `plan-offline.md`.

Recomendacion de piloto:

* empezar por una pantalla de lectura simple;
* evitar una pantalla que dependa de pagos, upload o PDF.

Piloto elegido para comenzar:

```text
/perfil/tecnicos
```

Alcance inicial del piloto:

* incluir primero la vista indice de lectura `src/routes/_protected/perfil/tecnicos/index.tsx`;
* incluir el componente `src/components/tecnicos/tecnico.tsx`;
* dejar ` /perfil/tecnicos/editar ` fuera del primer corte, porque mezcla mas dependencias de formulario y edicion.

Motivos de eleccion:

* depende de una sola identidad de usuario: `session.user.id`;
* la lectura principal sale de `tecnicoQueryOptions(userId)`;
* ya existe persistencia local de tecnico por `userId` en IndexedDB;
* permite validar exactamente el caso critico de esta part 2: sesion resuelta offline -> query de lectura asociada al usuario.

Salida esperada de A1:

* existe una ruta piloto claramente elegida;
* no hay ambiguedad sobre que subtree sigue siendo online-only.

## 8.3 A2 — Root loader degradado

Archivos a tocar:

* `src/routes/__root.tsx`
* `server/get-session.ts` solo si hace falta ajustar tipos, no para Dexie

Objetivo:

* que el arranque no explote si el browser no puede alcanzar el server.

Checklist:

* [ ] Definir el tipo `RootSessionState`.
* [ ] Cambiar el `loader` de `__root.tsx` para devolver `serverSession` y `serverState`.
* [ ] Asegurar que el flujo online siga devolviendo la sesion real.
* [ ] Detectar el caso unreachable sin introducir Dexie en el loader.
* [ ] Evitar redirect offline desde el root loader.
* [ ] Mantener `shellComponent`, `DefaultCatchBoundary` y PWA intactos.

No hacer en A2:

* [ ] No leer Dexie desde `__root.tsx`.
* [ ] No llamar `getCachedSession()` en SSR.
* [ ] No mover todavia rutas de sitio.

Salida esperada de A2:

* la app deja de caerse por fallo de transporte en el bootstrap;
* el root expone informacion suficiente para que el browser resuelva el fallback.

Estado:

* [x] `src/routes/__root.tsx` ya devuelve `serverState: "ok" | "unreachable"`.
* [x] `session` se mantiene para compatibilidad con los consumidores actuales.
* [x] `OfflineSession` sigue montado en `RootDocument` para sincronizar Better Auth -> Dexie.

## 8.4 A3 — Resolver browser-only

Archivos a crear:

* `src/lib/offline/resolve-app-session.ts`

Archivos de apoyo posibles:

* `src/lib/offline/session.ts`
* `src/lib/session/index.ts`

Objetivo:

* transformar `RootSessionState` + `getCachedSession()` en una decision unica para React.

Checklist:

* [ ] Definir el tipo `AppSessionState`.
* [ ] Crear un mapper server session -> `AppSession`.
* [ ] Crear un mapper cached session -> `AppSession`.
* [ ] Implementar la regla: si hay `serverSession`, usar server.
* [ ] Implementar la regla: si `serverState === "unreachable"`, leer Dexie.
* [ ] Implementar la regla: si `serverState === "ok"` y `serverSession === null`, devolver anonimo.
* [ ] Implementar la regla: nunca usar Dexie cuando el server respondio `null`.
* [ ] Cubrir explicitamente el estado `offline-no-session`.

Salida esperada de A3:

* existe una unica funcion o modulo que concentra toda la decision de sesion offline.

## 8.5 A4 — `OfflineSessionGate`

Archivos a crear:

* `src/components/offline-session-gate.tsx`
* opcional: `src/components/offline-no-session-screen.tsx`

Archivos de apoyo posibles:

* `src/lib/app-session-context.tsx`

Objetivo:

* bloquear el render del subtree offline-capable hasta resolver sesion.

Checklist:

* [ ] Crear `OfflineSessionGate`.
* [ ] Leer `RootSessionState` desde el root o props.
* [ ] Ejecutar `resolveAppSession()` en browser.
* [ ] Mostrar estado `resolving` mientras se resuelve la sesion.
* [ ] Mostrar pantalla clara cuando el estado sea `offline-no-session`.
* [ ] Redirigir a `/landing` cuando el estado sea anonimo online.
* [ ] Exponer `session` y `source` mediante context o hook.
* [ ] Confirmar que `source` puede ser `server` o `cache`.

Salida esperada de A4:

* ya existe una puerta de entrada client-side para el subtree offline-capable.

## 8.6 A5 — Subtree `/_protected-offline`

Archivos a crear o reestructurar:

* `src/routes/_protected-offline/route.tsx`
* `src/routes/_protected-online/route.tsx`
* rutas hijas segun el piloto elegido

Objetivo:

* separar el arbol protegido server-only del arbol offline-capable.

Checklist:

* [ ] Crear `/_protected-online` con `protectedRoute()`.
* [ ] Crear `/_protected-offline` sin redirect server-side duro.
* [ ] Montar `OfflineSessionGate` en `/_protected-offline`.
* [ ] Mover la ruta piloto al subtree offline.
* [ ] Mantener el resto de rutas en el subtree online.
* [ ] Verificar que un hard load de la ruta piloto ya no dependa directamente de `protectedRoute()`.

Salida esperada de A5:

* existe un camino de arranque offline real para al menos una ruta.

## 8.7 A6 — Migrar consumo de sesion en la ruta piloto

Archivos a tocar:

* componentes de la ruta piloto
* posibles layouts compartidos
* hooks de acceso a sesion

Objetivo:

* que la ruta piloto ya no dependa exclusivamente de `useLoaderData({ from: "__root__" })` para leer sesion.

Checklist:

* [ ] Crear `useAppSession()` o equivalente.
* [ ] Reemplazar en la ruta piloto el consumo directo de `session` desde `__root__`.
* [ ] Mantener compatibilidad con `source: "server"`.
* [ ] Soportar `source: "cache"`.
* [ ] Revisar cualquier acceso a `session.user.id` que asuma estrictamente la forma de Better Auth.
* [ ] Confirmar que la UI no depende de redirects server-side para renderizar.

Salida esperada de A6:

* la ruta piloto ya puede renderizar con sesion real o con sesion local.

## 8.8 A7 — Verificacion manual final

Preparacion:

* [ ] Tener una sesion valida iniciada online.
* [ ] Confirmar que Dexie contiene la sesion local.
* [ ] Confirmar que la shell PWA ya fue cacheada.
* [ ] Confirmar que la ruta piloto ya fue visitada al menos una vez online.

Casos:

* [ ] Caso 1. Hard load online en la ruta piloto.
* [ ] Caso 2. Hard load online sin sesion.
* [ ] Caso 3. Hard load offline con shell cacheada y sesion local.
* [ ] Caso 4. Hard load offline con shell cacheada y sin sesion local.
* [ ] Caso 5. Reapertura de PWA offline en la ruta piloto.
* [ ] Caso 6. Navegacion client-side offline dentro del subtree offline.
* [ ] Caso 7. Recuperar internet despues de iniciar offline.

Resultados esperados:

* [ ] La ruta piloto entra con `source: "server"` cuando hay red.
* [ ] La ruta piloto entra con `source: "cache"` cuando no hay red pero existe sesion local.
* [ ] Sin sesion local aparece una pantalla offline clara.
* [ ] No aparece `MissingAPIError`.
* [ ] No hay redirects erroneos por `protectedRoute()` en el subtree offline.
* [ ] Al volver la red, la app vuelve a operar con server session normalmente.

## 8.9 Regla de avance

No pasar a queries offline de lectura hasta que:

* [ ] A1 a A6 esten completos.
* [ ] A7 haya sido ejecutada completa al menos una vez.
* [ ] Exista evidencia clara de que el arranque offline funciona para la ruta piloto.

---

# 9. Criterios de aceptacion de la Part 2

Se considera resuelta esta parte cuando:

* la app shell puede arrancar offline si ya fue cacheada;
* el root loader no rompe el bootstrap por falta de red;
* el fallback a Dexie ocurre solo en browser;
* `protectedRoute()` sigue intacto para rutas online-only;
* existe al menos un subtree offline-capable protegido por `SessionGate`;
* un usuario con session local puede reabrir la app offline y entrar a ese subtree;
* un usuario sin session local ve una pantalla offline clara y no una explosion del router.

---

# 10. Riesgos de esta opcion

## Riesgo 1 — Duplicar logica de proteccion

Habra dos mecanismos:

* server-side para online-only;
* client-side para offline-capable.

Mitigacion:

* limitar el subtree offline-capable;
* centralizar toda la logica client-side en `SessionGate`.

## Riesgo 2 — Reanimar una sesion vieja

Si se usa Dexie cuando el server respondio `null`, se puede revivir una sesion local vieja.

Mitigacion:

* usar Dexie solo cuando `serverState === "unreachable"`.

## Riesgo 3 — Mover demasiado de golpe

Migrar todo `/_protected` en una sola pasada aumenta mucho el riesgo.

Mitigacion:

* empezar con un piloto chico.

---

# 11. Resumen ejecutivo

La Opcion A no intenta hacer que SSR conozca Dexie.

Hace algo mas simple y mas seguro:

1. SSR sigue con Better Auth.
2. El root loader solo informa si el server estuvo disponible.
3. Un `SessionGate` en browser decide el fallback a Dexie.
4. Las rutas offline-capable dejan de depender exclusivamente de `protectedRoute()`.

Ese es el paso correcto antes de continuar con queries offline y mutation queue.

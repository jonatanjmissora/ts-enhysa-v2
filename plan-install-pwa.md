# Plan de implementación - Instalación de la PWA

## Objetivo

Permitir que el usuario instale la aplicación desde un botón propio dentro de la interfaz, sin depender únicamente del menú del navegador.

La implementación debe ser:

* liviana;
* sin polling;
* sin comprobaciones periódicas;
* sin llamadas costosas en cada navegación;
* reutilizable;
* centralizada;
* compatible con navegadores Chromium y con instrucciones específicas para iOS.

---

# Arquitectura general

La implementación tendrá tres mecanismos complementarios:

### 1. Eventos del navegador

Utilizaremos:

* `beforeinstallprompt`
* `appinstalled`
* `display-mode`

Son listeners pasivos. No ejecutan código continuamente.

### 2. LocalStorage

Utilizaremos:

```text
pwa-installed
```

como estado persistente de nuestra aplicación.

Cuando se instala la PWA:

```ts
localStorage.setItem("pwa-installed", "true")
```

Esto permite conservar la información después de un refresh.

### 3. Verificación puntual

Utilizaremos:

```ts
navigator.getInstalledRelatedApps()
```

únicamente en la ruta `/`.

Su objetivo es detectar si el valor guardado en `localStorage` quedó obsoleto, por ejemplo si el usuario desinstaló la PWA.

No debe ejecutarse desde el Navbar ni desde un hook utilizado en todas las páginas.

---

# Etapa 1 - Crear el estado persistente de instalación

Crear:

```text
src/store/install-store.ts
```

No será un store global tradicional como Zustand o Redux.

Será un pequeño módulo encargado exclusivamente de:

* leer `pwa-installed`;
* escribir `pwa-installed`;
* eliminar `pwa-installed`;
* notificar a React cuando el valor cambie.

### API esperada

```ts
setInstalledFlag(value: boolean)
getInstalledFlag(): boolean
useInstalledFlag(): boolean
```

### Comportamiento

Cuando:

```ts
setInstalledFlag(true)
```

debe ejecutar:

```ts
localStorage.setItem("pwa-installed", "true")
```

Cuando:

```ts
setInstalledFlag(false)
```

debe eliminar la variable:

```ts
localStorage.removeItem("pwa-installed")
```

También debe emitir una notificación para que cualquier componente que utilice `useInstalledFlag()` se actualice inmediatamente.

---

# Etapa 2 - Crear/refactorizar `useInstall`

Crear o modificar:

```text
src/hooks/use-install.ts
```

Este será el hook principal utilizado por el componente de instalación.

## Responsabilidades

Debe encargarse únicamente de las APIs ligeras relacionadas directamente con la instalación:

* detectar `standalone`;
* detectar iOS;
* escuchar `beforeinstallprompt`;
* escuchar `appinstalled`;
* conservar temporalmente el `beforeinstallprompt`;
* ejecutar `prompt()` cuando el usuario pulsa instalar.

## No debe hacer

No debe:

* ejecutar `getInstalledRelatedApps()`;
* hacer polling;
* consultar periódicamente `localStorage`;
* realizar comprobaciones de instalación mediante intervalos;
* utilizar APIs costosas o innecesarias.

---

## Estado expuesto

El hook debería exponer:

```ts
{
    isStandalone: boolean;
    canInstall: boolean;
    isIOS: boolean;
    install: () => Promise<void>;
}
```

El estado persistente `pwa-installed` se consumirá mediante:

```ts
useInstalledFlag()
```

y no necesariamente desde `useInstall()`.

Esto mantiene las responsabilidades separadas.

---

# Etapa 3 - Manejar `beforeinstallprompt`

Registrar:

```ts
window.addEventListener(
    "beforeinstallprompt",
    handler
)
```

Cuando el navegador lance el evento:

1. Ejecutar `preventDefault()`.
2. Guardar el evento en un `useRef`.
3. Cambiar:

```ts
canInstall = true
```

El evento debe permanecer en memoria mientras la aplicación esté abierta.

No debe guardarse en `localStorage`.

### Importante

`beforeinstallprompt` no es un proceso que se ejecuta continuamente.

El listener queda registrado y el navegador solamente ejecuta el callback cuando dispara el evento.

Por lo tanto, esto no constituye polling.

---

# Etapa 4 - Implementar `install()`

El hook debe exponer:

```ts
install()
```

El método utilizará el evento guardado por `beforeinstallprompt`.

Flujo:

```text
Usuario pulsa "Instalar"
        ↓
install()
        ↓
deferredPrompt.prompt()
        ↓
Usuario acepta / rechaza
```

Si el usuario acepta:

```ts
setInstalledFlag(true)
```

Además:

* limpiar `deferredPrompt`;
* establecer `canInstall = false`.

Aunque también se escuche `appinstalled`, mantener el manejo del resultado de `userChoice` permite actualizar inmediatamente la UI.

---

# Etapa 5 - Manejar `appinstalled`

Registrar:

```ts
window.addEventListener(
    "appinstalled",
    handler
)
```

Este evento representa la confirmación del navegador de que la aplicación fue instalada.

Cuando ocurra:

```ts
setInstalledFlag(true)
```

Además:

```ts
deferredPrompt.current = null
canInstall = false
```

Este es el mecanismo principal para persistir la instalación.

No necesitamos comprobar continuamente si la instalación ocurrió.

---

# Etapa 6 - Detectar `standalone`

Determinar si la aplicación está ejecutándose como PWA instalada mediante:

```ts
window.matchMedia("(display-mode: standalone)").matches
```

y, para Safari iOS:

```ts
navigator.standalone
```

El resultado se expondrá como:

```ts
isStandalone
```

## Comportamiento de la UI

Si:

```ts
isStandalone === true
```

no se debe mostrar el banner de instalación.

La aplicación ya está funcionando como PWA instalada.

El listener de `display-mode` puede utilizarse para reaccionar si el modo cambia mientras la aplicación está abierta.

No se debe realizar polling.

---

# Etapa 7 - Crear la verificación de instalación

Crear:

```text
src/hooks/use-install-verification.ts
```

Este hook tendrá una única responsabilidad:

verificar si el estado guardado en `localStorage` continúa siendo correcto.

Utilizará:

```ts
navigator.getInstalledRelatedApps()
```

pero solamente una vez al montarse.

## Importante

Este hook NO debe utilizarse en el Navbar.

Debe utilizarse únicamente en la ruta `/`.

---

## Flujo

```text
Usuario entra a "/"
        ↓
useInstallVerification()
        ↓
¿Existe getInstalledRelatedApps?
        ↓
        Sí
        ↓
getInstalledRelatedApps()
        ↓
¿Hay aplicaciones relacionadas instaladas?
        │
    ┌───┴───┐
    │       │
   Sí      No
    │       │
    ▼       ▼
  true     false
    │       │
    └───┬───┘
        ▼
pwa-installed
```

Si encuentra una aplicación instalada:

```ts
setInstalledFlag(true)
```

Si no encuentra ninguna:

```ts
setInstalledFlag(false)
```

---

# Etapa 8 - Por qué la verificación solamente ocurre en `/`

Esta decisión es importante para mantener la aplicación ligera.

No queremos:

```text
Navbar
 └── useInstall()
      └── getInstalledRelatedApps()
```

porque el Navbar está presente durante toda la navegación.

La arquitectura será:

```text
Navbar
 └── useInstall()
      ├── beforeinstallprompt
      ├── appinstalled
      ├── display-mode
      └── install()

Ruta /
 └── useInstallVerification()
      └── getInstalledRelatedApps() una vez
```

Así, la comprobación más específica solamente se realiza cuando el usuario entra a la ruta seleccionada.

---

# Etapa 9 - Crear `InstallPrompt`

Crear o modificar:

```text
src/components/install-prompt.tsx
```

Este componente utilizará:

```ts
const {
    isStandalone,
    canInstall,
    isIOS,
    install,
} = useInstall()

const installed = useInstalledFlag()
```

## Orden de decisión

### 1. PWA ejecutándose como standalone

```ts
if (isStandalone) {
    return null
}
```

No mostrar ningún mensaje de instalación.

---

### 2. iOS

Si no está instalada y estamos en iOS:

mostrar instrucciones para instalar manualmente.

Por ejemplo:

```text
Para instalar en iOS:
Compartir → Añadir a pantalla de inicio
```

Safari no proporciona `beforeinstallprompt`, por lo que no debemos intentar utilizar `install()` allí.

---

### 3. La aplicación ya está instalada

Si:

```ts
installed === true
```

mostrar:

```text
Aplicación ya instalada, utilice el icono del escritorio
```

Esto permite que el estado sobreviva a un refresh gracias a `localStorage`.

---

### 4. La aplicación puede instalarse

Si:

```ts
installed === false
canInstall === true
```

mostrar:

```text
Puede instalar la aplicación
```

y el botón:

```text
Instalar
```

El botón ejecutará:

```ts
install()
```

---

### 5. No hay posibilidad de instalación mediante prompt

Si:

```ts
canInstall === false
```

y no estamos en iOS, no mostrar un botón que no pueda hacer nada.

En estos casos se deja al navegador manejar su propia interfaz de instalación.

---

# Etapa 10 - Comportamiento final

## Primera visita

```text
Usuario entra a la aplicación
        ↓
¿standalone?
        │
       No
        ↓
¿iOS?
        │
       No
        ↓
¿pwa-installed = true?
        │
       No
        ↓
¿beforeinstallprompt disponible?
        │
       Sí
        ↓
Mostrar "Instalar"
```

---

## Usuario instala

```text
Click "Instalar"
        ↓
prompt()
        ↓
Usuario acepta
        ↓
appinstalled
        ↓
pwa-installed = true
        ↓
UI actualizada
```

---

## Refresh después de instalar

```text
Refresh
   ↓
localStorage
   ↓
pwa-installed = true
   ↓
Mostrar "Aplicación ya instalada"
```

No necesitamos esperar otro evento de instalación.

---

## Usuario desinstala la PWA

El `localStorage` podría seguir teniendo:

```text
pwa-installed = true
```

Por eso, cuando el usuario entra a `/`:

```text
useInstallVerification()
        ↓
getInstalledRelatedApps()
        ↓
no encuentra la aplicación
        ↓
pwa-installed = false
```

La UI vuelve a considerar la aplicación como no instalada.

---

# Etapa 11 - Reactividad del `localStorage`

No utilizar:

```ts
setInterval(...)
```

ni:

```ts
setTimeout(...)
```

para consultar periódicamente el estado.

`useInstalledFlag()` utilizará `useSyncExternalStore` para que React pueda reaccionar cuando `pwa-installed` cambie.

Los cambios podrán producirse por:

* `appinstalled`;
* `install()`;
* `useInstallVerification()`.

El `storage` event también puede utilizarse para sincronizar cambios producidos desde otra pestaña.

---

# Etapa 12 - Pruebas

Probar al menos los siguientes escenarios.

## Caso 1 - Usuario no instalado

Resultado:

```text
Puede instalar la aplicación
[Instalar]
```

cuando `beforeinstallprompt` esté disponible.

---

## Caso 2 - Usuario pulsa instalar y acepta

Debe ocurrir:

```text
appinstalled
        ↓
pwa-installed = true
```

y desaparecer el botón de instalación.

---

## Caso 3 - Refresh

Después del refresh:

```text
pwa-installed = true
```

debe continuar disponible.

---

## Caso 4 - Usuario rechaza la instalación

No establecer:

```text
pwa-installed = true
```

El botón podrá seguir disponible si el navegador vuelve a permitir la instalación.

---

## Caso 5 - PWA instalada y ejecutada como standalone

```text
display-mode = standalone
```

No mostrar el banner de instalación.

---

## Caso 6 - PWA desinstalada

Después de desinstalarla:

1. Entrar a `/`.
2. Ejecutar la verificación.
3. Confirmar que `pwa-installed` vuelve a `false`.
4. Confirmar que la UI vuelve a permitir la instalación cuando el navegador proporcione `beforeinstallprompt`.

---

## Caso 7 - iOS

Confirmar que:

* no se depende de `beforeinstallprompt`;
* se muestran instrucciones;
* no se intenta ejecutar `prompt()`.

---

# Etapa 13 - Mejoras opcionales posteriores

Estas mejoras no forman parte de la implementación inicial.

## Recordar cierre del banner

Se podría guardar:

```text
install-banner-dismissed
```

o una fecha de último aviso.

Esto solamente debería implementarse si posteriormente resulta necesario evitar mostrar el banner repetidamente.

---

## Analytics

Opcionalmente registrar:

* banner mostrado;
* click en instalar;
* instalación aceptada;
* instalación rechazada.

No es necesario para el funcionamiento de la PWA.

---

# Arquitectura final

```text
                    Browser
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
beforeinstallprompt appinstalled display-mode
          │            │            │
          └──────┬─────┴────────────┘
                 ▼
           useInstall()
                 │
       ┌─────────┼──────────┐
       │         │          │
       ▼         ▼          ▼
 canInstall   install   isStandalone
       │
       ▼
 InstallPrompt
       │
       ▼
useInstalledFlag()
       │
       ▼
localStorage
pwa-installed


Ruta "/"
     │
     ▼
useInstallVerification()
     │
     ▼
getInstalledRelatedApps()
     │
     ▼
setInstalledFlag()
     │
     ▼
localStorage
pwa-installed
```

---

# Principios de la implementación

1. **No utilizar polling.**
2. **No ejecutar `getInstalledRelatedApps()` en cada página.**
3. **No guardar `beforeinstallprompt` en LocalStorage.**
4. **No utilizar LocalStorage como única fuente de verdad.**
5. **Utilizar `appinstalled` para registrar la instalación.**
6. **Utilizar `getInstalledRelatedApps()` únicamente como verificación puntual.**
7. **Mantener el hook de instalación pequeño y enfocado.**
8. **No crear un store global complejo para una sola variable.**
9. **No mostrar botones de instalación cuando el navegador no proporciona un mecanismo para instalarlos.**
10. **La PWA en modo standalone no necesita mostrar el banner de instalación.**

---

# Resultado esperado

La aplicación tendrá un sistema de instalación que:

* no realiza polling;
* no hace comprobaciones constantemente;
* no ejecuta `getInstalledRelatedApps()` en cada navegación;
* recuerda la instalación mediante `localStorage`;
* reacciona inmediatamente al evento `appinstalled`;
* puede detectar una desinstalación posteriormente;
* permite instalar desde un botón propio cuando el navegador lo permite;
* proporciona instrucciones específicas para iOS;
* mantiene toda la lógica de instalación encapsulada.

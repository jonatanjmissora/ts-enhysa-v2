````markdown
# Plan de implementación - Instalación de la PWA

## Objetivo

Permitir que el usuario instale la aplicación desde un botón propio dentro de la interfaz, sin depender únicamente del menú del navegador.

La implementación deberá ser desacoplada, reutilizable y fácil de mantener.

---

# Etapa 1 - Detectar el estado de instalación

## Objetivo

Crear un hook encargado de conocer el estado de instalación de la PWA.

Este hook será la única parte de la aplicación que interactúe con las APIs del navegador relacionadas con la instalación.

## Responsabilidades

- Detectar si la aplicación ya está instalada.
- Detectar si el navegador permite instalarla.
- Detectar si el dispositivo es iOS.
- Escuchar los eventos del navegador relacionados con la instalación.
- Exponer un estado simple para el resto de la aplicación.

## Estado que debería exponer

```ts
{
    isInstalled: boolean;
    canInstall: boolean;
    isIOS: boolean;
    install: () => Promise<void>;
}
```

### Significado

#### isInstalled

Indica si la aplicación se está ejecutando como una PWA instalada.

Se obtiene mediante:

- `window.matchMedia("(display-mode: standalone)")`
- `navigator.standalone` (Safari iOS)

No debe almacenarse en LocalStorage ni Cookies, ya que siempre puede consultarse directamente al navegador.

---

#### canInstall

Indica si el navegador lanzó el evento `beforeinstallprompt`.

Mientras sea `false`, no existe ninguna instalación disponible.

Cuando pase a `true`, se podrá mostrar el botón de instalación.

---

#### isIOS

Permite mostrar instrucciones especiales para Safari.

En iOS no existe `beforeinstallprompt`, por lo que nunca aparecerá el botón de instalación.

---

#### install()

Método encargado de abrir el diálogo de instalación.

Internamente utilizará el objeto recibido desde `beforeinstallprompt`.

El resto de la aplicación nunca debería acceder directamente a dicho evento.

---

# Etapa 2 - Manejar los eventos del navegador

## beforeinstallprompt

Registrar el evento una única vez al iniciar la aplicación.

Responsabilidades:

- Evitar el comportamiento por defecto.
- Guardar el evento internamente.
- Actualizar `canInstall`.

Importante:

El evento **no está ejecutándose constantemente**.

Simplemente queda registrado en memoria y el navegador lo invoca únicamente cuando considera que la PWA es instalable.

No consume recursos de forma continua.

---

## appinstalled

Escuchar este evento.

Cuando ocurra:

- limpiar el evento almacenado
- cambiar `isInstalled = true`
- cambiar `canInstall = false`

Esto actualizará automáticamente toda la interfaz.

---

# Etapa 3 - Crear el botón de instalación

Crear un componente independiente.

Ejemplo:

```
<InstallButton />
```

Su única responsabilidad será llamar a:

```
install()
```

Nunca debería conocer la API del navegador.

---

# Etapa 4 - Crear el banner de instalación

Crear un componente como:

```
<InstallBanner />
```

Responsabilidades:

- Mostrar el botón cuando:
    - !isInstalled
    - canInstall

- Mostrar instrucciones para iOS cuando:
    - !isInstalled
    - isIOS

- No renderizar nada cuando:
    - isInstalled

De esta forma toda la lógica queda centralizada.

---

# Etapa 5 - Crear instrucciones para iOS

Como Safari no soporta `beforeinstallprompt`, mostrar un mensaje explicando:

1. Presionar el botón Compartir.
2. Seleccionar "Añadir a pantalla de inicio".
3. Confirmar la instalación.

No intentar utilizar APIs inexistentes.

---

# Etapa 6 - Mejoras opcionales

## Recordar si el usuario cerró el banner

Puede utilizarse LocalStorage para guardar información como:

```
install-banner-dismissed = true
```

o

```
last-install-reminder = fecha
```

Esto permite no mostrar el banner constantemente.

Importante:

Nunca guardar:

- beforeinstallprompt
- isInstalled
- canInstall

Ya que son estados proporcionados por el navegador.

---

## Analytics

Registrar eventos como:

- usuario vio el banner
- usuario hizo clic en instalar
- usuario aceptó la instalación
- usuario canceló la instalación

Esto permite medir la conversión de instalación.

---

## Personalización

Según el navegador:

Chrome:

```
Instala la aplicación para acceder más rápido.
```

Safari:

```
Añádela a tu pantalla de inicio desde el menú Compartir.
```

---

# Arquitectura final

```
Browser
│
├── beforeinstallprompt
├── appinstalled
└── display-mode
        │
        ▼
useInstall()
        │
        ├── isInstalled
        ├── canInstall
        ├── isIOS
        └── install()
                │
                ▼
InstallBanner
        │
        ├── InstallButton
        └── IOSInstructions
```

---

# Beneficios

- Una única fuente de verdad.
- Toda la lógica del navegador queda encapsulada.
- Los componentes no conocen las APIs de instalación.
- Fácil mantenimiento.
- Fácil reutilización.
- Compatible con futuras mejoras.
- Preparado para incorporar métricas y recordatorios sin modificar la lógica principal.
````

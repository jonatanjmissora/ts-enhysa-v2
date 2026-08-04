````markdown
# Plan de implementación - Verificación de matriculado CPSH

## Objetivo

Permitir que un usuario obtenga un descuento al comprar créditos si se encuentra matriculado en el Colegio de Profesionales de Higiene y Seguridad (CPSH).

La aplicación **no almacenará información del profesional**, únicamente verificará si existe o no una coincidencia para el DNI/CUIT ingresado.

Resultado esperado:

```ts
true  // Tiene matrícula
false // No tiene matrícula
```

---

# Análisis

El sitio del CPSH **no expone una API pública** para esta funcionalidad.

La búsqueda se realiza mediante un formulario HTML tradicional.

Flujo detectado:

```
GET  /matriculacion/web/site/buscar-profesional
        │
        ├── genera un token CSRF
        ├── devuelve la página HTML
        └── envía la cookie CSRF

POST /matriculacion/web/site/buscar-profesional
        │
        ├── _csrf
        ├── matriculado
        └── devuelve HTML con el resultado
```

No existe respuesta JSON.

---

# Arquitectura propuesta

Toda la comunicación con el sitio del CPSH deberá realizarse desde el backend.

Nunca desde React.

```
React

        │

        ▼

Server Function

        │

GET buscar-profesional

        │

Obtiene:
- cookie
- token CSRF

        │

POST buscar-profesional

        │

Obtiene HTML

        │

Analiza HTML

        │

true / false

        ▼

React
```

---

# Paso 1

## Crear el servicio

Crear un servicio aislado.

Ejemplo:

```
src/lib/cpsh/is-registered.ts
```

o

```
src/server/services/cpsh.ts
```

Toda la lógica deberá vivir aquí.

---

# Paso 2

## Obtener el formulario

Realizar:

```
GET

https://cpsh.com.ar/matriculacion/web/site/buscar-profesional
```

Guardar:

- HTML
- cookies

---

# Paso 3

## Obtener el token CSRF

Extraer el valor desde el HTML.

Ejemplo:

```html
<input
    type="hidden"
    name="_csrf"
    value="xxxxxxxx">
```

o

```html
<meta
    name="csrf-token"
    content="xxxxxxxx">
```

Se recomienda utilizar el input hidden, ya que es el mismo valor enviado por el formulario.

---

# Paso 4

## Realizar la búsqueda

Enviar:

```
POST
```

Body:

```
_csrf=<token>

matriculado=<dni o cuit>
```

Content-Type:

```
application/x-www-form-urlencoded
```

Además reenviar las cookies obtenidas durante el GET.

---

# Paso 5

## Analizar el HTML

No interesa obtener los datos del profesional.

Solamente saber si existe.

La respuesta positiva contiene:

```html
<div id="credencial">
```

Mientras que la respuesta negativa contiene:

```
No se encontraron resultados
```

Se recomienda utilizar como indicador:

```
id="credencial"
```

Es más robusto que buscar un texto.

Puede utilizarse:

```
cheerio
```

Ejemplo conceptual:

```ts
const existe = $("#credencial").length > 0;
```

---

# Paso 6

## Devolver únicamente un boolean

La función deberá devolver únicamente:

```ts
true
```

o

```ts
false
```

Nunca devolver HTML.

Nunca devolver información del profesional.

---

# API interna

La aplicación solamente conocerá esta función.

```ts
verifyProfessionalRegistration(
    dniOrCuit: string
): Promise<boolean>
```

Ejemplo:

```ts
const isRegistered =
    await verifyProfessionalRegistration(dni);
```

---

# Integración con Mercado Pago

Durante la compra:

```
Usuario

↓

Ingresa DNI/CUIT

↓

Backend

↓

verifyProfessionalRegistration()

↓

true / false

↓

Calcula el precio

↓

Crea la Preferencia de Mercado Pago
```

Nunca permitir que el frontend decida si corresponde el descuento.

El backend siempre será la fuente de verdad.

---

# Flujo completo

```
Usuario

↓

Selecciona compra

↓

Ingresa DNI/CUIT

↓

Server Function

↓

GET formulario CPSH

↓

Obtiene CSRF

↓

POST búsqueda

↓

Analiza HTML

↓

¿Existe #credencial?

        │

     Sí     No

      │      │

Descuento  Precio normal

      │

Crear Preferencia MP

↓

Frontend recibe URL de pago
```

---

# Manejo de errores

Si el sitio del CPSH no responde:

- timeout
- error 500
- error de red

No impedir la compra.

Simplemente:

- registrar el error
- informar que no fue posible validar la matrícula
- continuar la compra sin descuento (o pedir que intente nuevamente, según la decisión de negocio)

---

# Posibles mejoras futuras

## Cache temporal

Si en el futuro el volumen de consultas aumenta, podría implementarse un cache de corta duración.

Ejemplo:

```
DNI

↓

Resultado

↓

TTL 24 horas
```

Actualmente **no es necesario**, ya que la consulta se realiza únicamente durante la compra de créditos.

---

## Centralizar configuración

Crear constantes:

```ts
CPSH_BASE_URL

CPSH_SEARCH_PATH

REQUEST_TIMEOUT
```

para evitar valores hardcodeados.

---

# Responsabilidades

## React

- Solicitar la verificación.
- Mostrar si aplica descuento.

---

## Server Function

- Obtener CSRF.
- Enviar POST.
- Parsear HTML.
- Devolver boolean.

---

## Servicio CPSH

Responsable de toda la comunicación con el sitio externo.

Debe ser el único lugar del proyecto que conozca:

- URLs
- cookies
- CSRF
- estructura HTML
- lógica de parsing

De esta forma, si el CPSH modifica su implementación en el futuro, solamente será necesario actualizar este servicio sin afectar el resto de la aplicación.
````

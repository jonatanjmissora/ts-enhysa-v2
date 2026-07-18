Sistema de Créditos para Desbloqueo de PDF
Objetivo
La aplicación genera el PDF completamente en el frontend a partir de los datos del reporte. El backend no almacena el PDF, únicamente almacena los datos del reporte y controla la lógica de negocio relacionada con los créditos.
Todo PDF se genera inicialmente con marca de agua. El usuario puede visualizarlo sin consumir créditos.
Cuando el usuario decide que el reporte está terminado, puede consumir 1 crédito para desbloquearlo definitivamente. A partir de ese momento:
•	El PDF se genera sin marca de agua.
•	El reporte queda marcado como desbloqueado.
•	El usuario podrá descargar el PDF todas las veces que quiera.
•	Las modificaciones posteriores del reporte no vuelven a consumir créditos.
________________________________________
Reglas de negocio
1. El crédito pertenece al reporte
Cada reporte consume como máximo un crédito durante toda su vida.
Una vez que un reporte fue desbloqueado:
•	nunca vuelve a consumir créditos;
•	puede modificarse libremente;
•	el PDF siempre se genera sin marca de agua.
________________________________________
2. El PDF nunca se almacena
El PDF siempre se genera nuevamente desde los datos del reporte.
El frontend únicamente consulta:
•	datos del reporte;
•	estado creditConsumed.
Con esa información decide si renderiza:
•	PDF con marca de agua
•	PDF sin marca de agua
No existen dos versiones almacenadas del PDF.
________________________________________
3. El backend es la única autoridad
El frontend decide qué mostrar.
El backend decide:
•	si existen créditos suficientes;
•	si el reporte ya consumió un crédito;
•	cuándo descontar créditos;
•	cuándo actualizar el reporte.
Nunca se debe confiar en el frontend para descontar créditos.
________________________________________
Modelo de datos
Tabla reportes
Agregar las siguientes columnas:
creditConsumed      boolean
creditConsumedAt    timestamp nullable
Significado
creditConsumed = false
•	El reporte todavía no consumió créditos.
•	El PDF debe renderizarse con marca de agua.
•	Se muestra el botón “Desbloquear PDF”.
________________________________________
creditConsumed = true
•	El crédito ya fue consumido.
•	El PDF se renderiza sin marca de agua.
•	Se muestra el botón “Descargar PDF”.
________________________________________
Tabla userCredits
Representa el saldo actual.
userId (PK)

credits

updatedAt
Debe existir una única fila por usuario.
Ejemplo:
userId	credits
abc123	84
________________________________________
Tabla creditHistory
Representa el historial completo de movimientos.
id

userId

type

credits

reportId

paymentId

createdAt
type
purchase
consume
bonus
refund
credits
Valores positivos o negativos.
Ejemplos:
+90

+6

+1

-1
reportId
Solo se utiliza cuando el movimiento corresponde al desbloqueo de un reporte.
paymentId
Permite asociar una compra proveniente de Mercado Pago.
________________________________________
Flujo de compra de créditos
Mercado Pago confirma un pago mediante webhook.
El backend:
1.	valida el pago;
2.	determina la cantidad de créditos comprados;
3.	inicia una transacción;
4.	suma los créditos al usuario;
5.	registra un movimiento purchase;
6.	realiza commit.
Nunca modifica directamente el reporte.
________________________________________
Flujo de generación del PDF
Paso 1
El frontend solicita el reporte.
GET reporte
Obtiene:
datos

creditConsumed
________________________________________
Paso 2
Renderiza automáticamente.
Si:
creditConsumed = false
Renderiza:
•	PDF con marca de agua
Botón:
Desbloquear PDF (1 crédito)
Además informa la cantidad de créditos disponibles.
________________________________________
Si:
creditConsumed = true
Renderiza:
•	PDF sin marca de agua
Botón:
Descargar PDF
________________________________________
Flujo de desbloqueo del PDF
Cuando el usuario presiona:
Desbloquear PDF
El frontend llama a un serverFn.
Toda la lógica ocurre en el backend.
________________________________________
Proceso del backend
1.
Iniciar una transacción.
________________________________________
2.
Buscar el reporte.
Si no existe:
Error
________________________________________
3.
Verificar:
creditConsumed
Si ya es:
true
No descontar créditos.
Responder OK.
Esto evita consumir créditos por:
•	doble clic;
•	reintentos automáticos;
•	múltiples pestañas.
________________________________________
4.
Descontar el crédito mediante una actualización atómica.
Ejemplo SQL:
UPDATE userCredits
SET credits = credits - 1
WHERE userId = ?
AND credits > 0;
No se realiza una lectura previa del saldo.
La propia base de datos garantiza la operación.
________________________________________
5.
Comprobar filas afectadas.
Si:
0 filas
Significa:
•	el usuario no posee créditos.
Cancelar la operación.
________________________________________
Si:
1 fila
Continuar.
________________________________________
6.
Actualizar el reporte.
creditConsumed = true

creditConsumedAt = NOW()
________________________________________
7.
Insertar movimiento.
type = consume

credits = -1

reportId = ...

createdAt = NOW()
________________________________________
8.
Commit.
________________________________________
9.
Responder OK.
________________________________________
Actualización del frontend
Cuando el backend responde correctamente:
invalidar la consulta del reporte (router.invalidate() o queryClient.invalidateQueries()).
El frontend vuelve a solicitar los datos.
Ahora recibe:
creditConsumed = true
El PDF vuelve a renderizarse automáticamente.
Esta vez:
•	sin marca de agua;
•	mostrando únicamente el botón “Descargar PDF”.
________________________________________
Race Conditions
El sistema debe protegerse contra:
•	doble clic;
•	múltiples pestañas;
•	varios dispositivos;
•	peticiones repetidas;
•	reintentos automáticos;
•	problemas de red.
La protección se basa en dos principios:
1.
Verificar primero si el reporte ya fue desbloqueado.
Si:
creditConsumed = true
No realizar ninguna modificación.
________________________________________
2.
Descontar créditos mediante una actualización atómica.
Nunca hacer:
leer créditos

↓

restar

↓

guardar
porque produce race conditions.
Siempre utilizar una operación atómica directamente sobre la base de datos.
________________________________________
Principios de diseño
El frontend
Responsabilidades:
•	renderizar el PDF;
•	decidir si muestra marca de agua;
•	mostrar el botón correcto;
•	volver a consultar el reporte luego del desbloqueo.
Nunca decide si puede consumir créditos.
________________________________________
El backend
Responsabilidades:
•	validar el estado del reporte;
•	validar créditos disponibles;
•	descontar créditos;
•	registrar historial;
•	garantizar consistencia mediante transacciones.
Toda la lógica de negocio reside exclusivamente en el servidor.
________________________________________
Beneficios de esta arquitectura
•	No se almacenan PDFs.
•	Un único crédito por reporte.
•	Historial completo de créditos.
•	Saldo actual de consulta inmediata.
•	Compatible con Mercado Pago.
•	Resistente a concurrencia.
•	Fácil de extender con promociones, bonificaciones o devoluciones.
•	El frontend permanece completamente desacoplado de la lógica de negocio.

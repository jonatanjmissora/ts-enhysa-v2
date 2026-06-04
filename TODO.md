
ACTUALIZACION
===========

sin conexion

terminos y condiciones

politicas de privacidad

rate limit

sentry

ir guardando por fila completa de puntos

TODO
======
pwa

preguntar ??? 
	informe o reporte 
	muestro los valores 0 en la tabla y graficos? 

ver si puedo obtener ["reporte_iluminacion", reporteId] del ["reportes_iluminacion"] como como en "reporteNuevoQueryOptions"
lo mismo para ["area_iluminacion", areaId] del ["areas_iluminacion"]
en creando areas, en un reporte nuevo, me pone "obteniendo areas" por mas que es un informe nuevo

hacer limpieza de archivos que no se usan

acomodar todo los links con las nuevas rutas

acomodar la grilla para el ancho del celular cuando es posible, como en 1x1 2x2 etc

ADMIN:
========
controlar si todas las areas tienen reporte, sino mostrar para borrar


const { id } = Route.useParams()
const id = crypto.randomUUID().toString()
<Link
	to="/iluminacion/reportes/$id/crud/create-general"
	params={{
		id,
	}}
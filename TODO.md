
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

ver si es nuevo informe o reporte

cada 3 puntos, update del area

ver si puedo obtener ["reporte_iluminacion", reporteId] del ["reportes_iluminacion"] como como en "reporteNuevoQueryOptions"
lo mismo para ["area_iluminacion", areaId] del ["areas_iluminacion"]

backchevron acepta params

hacer limpieza de archivos que no se usan

acomodar todo los links con las nuevas rutas

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
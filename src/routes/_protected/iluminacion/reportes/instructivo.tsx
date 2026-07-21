import { createFileRoute } from "@tanstack/react-router"
import BackChevron from "#/components/back-chevron"
import Title from "#/components/title"
import { z } from "zod"

const searchSchema = z.object({
	from: z.string().optional().default("root"),
})

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/instructivo"
)({
	validateSearch: searchSchema,
	component: RouteComponent,
})

const PASOS = [
	{
		nro: 1,
		texto: `Una vez ingresada a la aplicación vera una pantalla de inicio la cual tiene un menú en la parte superior y una batería de iconos en la parte central. Clickeando en alguno de estos iconos (1), accederá a la pantalla correspondiente, según sea información, herramientas o informes. Lo primero que aconsejamos es cargar los datos de tu perfil, que serán accesibles desde cada informe a elaborar.`,
		img: "/pasos/paso1.webp",
	},
	{
		nro: 2,
		texto: `Haciendo click en el menú, vemos los distintos accesos directos:
En (1) accederemos a la información principal de la aplicación, y los distintos casos de uso.
En (2) accederemos a inicio de la aplicación, la imagen del paso 1.
En (3) accederemos a la pantalla de perfil, donde ingresaremos los datos necesarios para los informes.
En (4) accederemos a las suscripciones que ofrece la aplicación para la generación de informes.
En (5) cerraremos la sesión vigente. Si eres usuario de prueba, todos tus actualizaciones se perderán. Si eres un usuario registrado, los datos cargados quedarán persistentes en la aplicación cada vez que ingreses.
En (6) podemos alternar entre un tema claro, oscuro, o igual al que tiene asignado tu sistema.`,
		img: "/pasos/paso2.webp",
	},
	{
		nro: 3,
		texto: `Accediendo a "Mi Perfil" podremos ingresar los datos necesarios para los informes. Existen tres áreas en donde necesitaremos cargar información.
En (1) son los datos del técnico, en (2) son los datos de la empresa a la que brindamos el informe, y en (3) todo lo relacionado a los instrumentos necesarios para la elaboración de mediciones. Cada uno de estos items serán accesibles desde la elaboración de los informes.`,
		img: "/pasos/paso3.webp",
	},
	{
		nro: 4,
		texto: `En la página de inicio, en la batería de iconos, seleccionamos el correspondiente al informe de iluminación (1).`,
		img: "/pasos/paso4.webp",
	},
	{
		nro: 5,
		texto: `Nos llevará a una nueva pantalla, donde pulsaremos en Nuevo Informe (1). De ahí accederemos a los formularios del informe.`,
		img: "/pasos/paso5.webp",
	},
	{
		nro: 6,
		texto: `El primer formulario nos solicitará la información general del informe, relacionado a la empresa, instrumento y el clima. Pulsaremos en "Siguiente" para el siguiente formulario.`,
		img: "/pasos/paso6.webp",
	},
	{
		nro: 7,
		texto: `En el siguiente formulario encontraremos el apartado de Áreas. Pueden ser áreas de trabajo (1) o de una medición localizada (2). Un informe puede tener una o ambas, y pueden ser más de una por categoría. Cuando pulsemos en la opción deseada, se nos abrirán los formularios correspondientes, luego de cargar los datos, retornaremos a esta pantalla, habilitándose el botón de "Siguiente" para continuar.`,
		img: "/pasos/paso7.webp",
	},
	{
		nro: 8,
		texto: `Si elegimos la creación de un área, se desplegará el siguiente formulario intuitivo. Nos solicitarán datos como nombre, tipo de área, características de las fuentes de iluminación, el valor que requiere la legislación (acceso a tabla para conocer los valores estipulados), las dimensiones del área (que determinarán la cantidad de puntos a medir) y podremos anexar hasta un máximo de 4 fotos del lugar en cuestión. Continuamos al siguiente paso mediante "Siguiente".`,
		img: "/pasos/paso8.webp",
	},
	{
		nro: 9,
		texto: `El formulario nos arrojará una grilla (1), representando al área, cuyas dimensiones fueron dadas en el paso anterior. En la grilla, veremos los puntos a medir, con sus respectivos valores a ingresar. Puede que el área no necesite la medición de la totalidad de los puntos, por lo que dejar un valor sin medir, no será computado para la creación de las tablas o gráficos. Cada 3 mediciones se ejecutará un auto guardado, para evitar tener que medir todo nuevamente ante un fallo de energía o red.`,
		img: "/pasos/paso9.webp",
	},
	{
		nro: 10,
		texto: `Volveremos a la pantalla del punto 7, donde podremos continuar con la creación de nuevas áreas de trabajo o mediciones localizadas, de ser necesario. Podremos crear tantas áreas (1), localizadas (2) como demande el informe. Luego de haber cargado lo necesario continuaremos a la última parte del informe (3).`,
		img: "/pasos/paso10.webp",
	},
	{
		nro: 11,
		texto: `El último formulario son las observaciones, conclusiones y recomendaciones del especialista según lo observado y medido. Al final encontraremos el botón "Finalizar". Recuerde que cuando finaliza un informe, toda la información quedará guardada en su base de datos, por lo que podrá acceder, modificar o eliminar dicho informe cuando ud. lo desee. Una vez finalizado, retornaremos al apartado de Informes de Iluminación.`,
		img: "/pasos/paso11.webp",
	},
	{
		nro: 12,
		texto: `En esta pantalla existirán tanto los informes finalizados como el que tenga en proceso. Solo podrá existir un solo informe en proceso, que todavía no haya finalizado, y todos los informes finalizados que desee. Pulsando la flecha (1) de cada informe, podrá acceder nuevamente a los datos ingresados.`,
		img: "/pasos/paso12.webp",
	},
	{
		nro: 13,
		texto: `En esta pantalla podremos ver separado en tres sectores, los datos generales del informe, las áreas y los resultados. Podremos crear, modificar o eliminar cualquiera de los datos cargados previamente en la creación del informe. En el sector "Resumen" veremos el botón de "Generar el PDF", nos llevará a la nueva pantalla donde se renderizará el PDF y, de ser posible, descargarlo en nuestro dispositivo.`,
		img: ["/pasos/paso13.webp", "/pasos/paso14.webp", "/pasos/paso15.webp"],
	},
	{
		nro: 14,
		texto: `Antes de ver el informe, disponemos de dos tipos de vistas para la confección del informe. Una versión "Reducida", en donde se ven los puntos más influyentes de las mediciones, y otro "Completo" donde veremos punto a puntos todas las mediciones en la tabla.`,
		img: "/pasos/paso16.webp",
	},
	{
		nro: 15,
		texto: `Última parte, y visualización del PDF. En esta pantalla veremos el informe completo, con todas sus secciones: Introducción, información relacionada al técnico, Anexos, tablas por área, croquis e imágenes, instrumentos y certificados, gráficos y datos de la empresa. El informe puede verse con marca de agua, y si posee una suscripción activa, si tiene créditos suficientes, se podrá quitar dicha marca de agua y tendrá la posibilidad de descargar el PDF. Si dispone de créditos (1) podrá desbloquear el PDF (3). De no ser este el caso, podrá adquirir más créditos pulsando el botón (2). Una vez desbloqueado el PDF, se habilita la descarga del mismo y quedará accesible para siempre.`,
		img: "/pasos/paso17.webp",
	},
]

function RouteComponent() {
	const { from } = Route.useSearch()
	return (
		<article className="relative w-full sm:max-w-4xl mx-auto py-10 px-4 space-y-12">
			<BackChevron to={from} />
			<Title text="Instructivo para elaborar el Informe de Iluminación" />

			<p className="text-muted-foreground leading-relaxed text-center">
				Pasos a seguir para elaborar el Informe de Iluminación, según Decreto
				351/79 - Anexo IV y Resolución SRT 84/2012.
			</p>

			<p className="text-muted-foreground leading-relaxed text-center">
				La aplicación puede correr en distintos dispositivos y compartir
				información entre ellos para el mismo usuario. La finalidad es
				facilitarle la tarea al especialista para adquirir datos, estructurarlos
				y elaborar el informe solicitado mediante un documento PDF. A
				continuación daremos un breve instructivo de cómo utilizar la
				aplicación:
			</p>

			<div className="space-y-16">
				{PASOS.map(paso => (
					<section key={paso.nro} className="space-y-4 my-40">
						<span className="rounded bg-green-700 flex items-center justify-center font-bold px-3 py-1 w-full sm:w-1/4 mx-auto">
							Paso {paso.nro}
						</span>
						<p className="text-sm text-muted-foreground leading-relaxed text-pretty text-center">
							{paso.texto}
						</p>
						{Array.isArray(paso.img) ? (
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								{paso.img.map((src, i) => (
									<img
										key={i}
										src={src}
										alt={`Paso ${paso.nro} - imagen ${i + 1}`}
										className="w-3/4 sm:w-1/4 mx-auto"
										loading="lazy"
									/>
								))}
							</div>
						) : (
							<img
								src={paso.img}
								alt={`Paso ${paso.nro}`}
								className="w-3/4 sm:w-1/4 mx-auto"
								loading="lazy"
							/>
						)}
					</section>
				))}
			</div>
		</article>
	)
}

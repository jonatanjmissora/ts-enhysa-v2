import IluminacionContent from "#/components/teoria/iluminacion"
import IluminacionValoresRequeridosContent from "#/components/teoria/valor-requerido"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { z } from "zod"

const searchSchema = z.object({
	t: z
		.enum([
			"iluminacion",
			"iluminacionValoresRequeridos",
			"ruido",
			"extintores",
			"pat",
			"vibraciones",
			"capacitaciones",
			"epp",
			"antisiniestral",
			"vehiculos",
		])
		.default("iluminacion"),
	from: z.string().optional().default("root"),
})

export const Route = createFileRoute("/_with-header/teoria/")({
	validateSearch: searchSchema,
	component: RouteComponent,
})

const TEORIAS = [
	{ id: "iluminacion", label: "Estudio de Iluminación Res. 84/2012 SRT" },
	{
		id: "iluminacionValoresRequeridos",
		label: "➖ Tabla de Valores Requeridos",
	},
	{ id: "ruido", label: "Estudio de Ruido Res. 85/2012 SRT" },
	{ id: "extintores", label: "Control de Extintores, Recarga y PH" },
	{ id: "pat", label: "Estudio de PAT y Continuidad de las Masas" },
	{
		id: "vibraciones",
		label: "Medición de Vibraciones (Cuerpo Entero y Mano-Brazo)",
	},
	{
		id: "capacitaciones",
		label: "Capacitaciones HSE (Fundamentos y Matriz Esencial)",
	},
	{ id: "epp", label: "Control de EPP y EPIS" },
	{ id: "antisiniestral", label: "Informe Antisiniestral" },
	{
		id: "vehiculos",
		label: "Chequeo de Equipos y Vehículos (Checklists Operativos)",
	},
] as const

function RuidoContent() {
	return (
		<>
			<h2 className="text-xl font-semibold">Medición de Ruido</h2>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">Finalidad:</strong>{" "}
				Determinar el nivel de exposición al ruido continuo y de impacto al que
				están sometidos los trabajadores durante su jornada laboral para
				prevenir la Hipoacusia Inducida por Ruido (HIR), así como evaluar el
				impacto sonoro ambiental hacia la comunidad lindante.
			</p>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">
					Legislación Aplicable:
				</strong>{" "}
				Ámbito Laboral: Ley N° 19.587, Decreto N° 351/79 (Anexo V, Capítulo 13)
				y la Resolución SRT N° 85/12 (Protocolo para la Medición del Ruido en el
				Ambiente de Laboral). Ámbito Ambiental: Norma IRAM 4062 y normativas
				municipales/provinciales específicas.
			</p>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Niveles Máximos de Exposición</h2>
				<p className="text-sm text-foreground-soft">
					El Decreto 351/79 (Anexo V) establece los niveles máximos de presión
					sonora permitidos según el tiempo de exposición:
				</p>
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/50">
								<th className="text-left p-3 font-medium">
									Nivel Sonoro (dBA)
								</th>
								<th className="text-left p-3 font-medium">
									Tiempo Máximo Permitido
								</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							<tr>
								<td className="p-3 font-mono">85 dBA</td>
								<td className="p-3">8 horas</td>
							</tr>
							<tr>
								<td className="p-3 font-mono">88 dBA</td>
								<td className="p-3">4 horas</td>
							</tr>
							<tr>
								<td className="p-3 font-mono">91 dBA</td>
								<td className="p-3">2 horas</td>
							</tr>
							<tr>
								<td className="p-3 font-mono">94 dBA</td>
								<td className="p-3">1 hora</td>
							</tr>
							<tr>
								<td className="p-3 font-mono">97 dBA</td>
								<td className="p-3">30 minutos</td>
							</tr>
							<tr>
								<td className="p-3 font-mono">100 dBA</td>
								<td className="p-3">15 minutos</td>
							</tr>
							<tr>
								<td className="p-3 font-mono">103 dBA</td>
								<td className="p-3">7.5 minutos</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Interpretación de la Tabla</h2>
				<ul className="space-y-3 text-sm text-foreground-soft">
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-foreground-soft shrink-0 mt-0.5">
							Ruido Continuo
						</span>
						<span>
							Por cada incremento de 3 dBA, el tiempo de exposición máxima se
							reduce a la mitad (relación de intercambio 1:2). La dosis de ruido
							no debe superar el 100% en una jornada de 8 horas.
						</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-foreground-soft shrink-0 mt-0.5">
							Ruido de Impacto
						</span>
						<span>
							No se permite la exposición a niveles pico superiores a 140 dBC.
							El nivel pico ponderado C (LCpico) se mide con detector de pico.
						</span>
					</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Protocolo SRT 85/2012</h2>
				<p className="text-sm text-foreground-soft">
					La Resolución SRT 85/2012 define el procedimiento obligatorio para la
					medición y registro de los niveles de ruido en los establecimientos
					laborales.
				</p>
				<ul className="list-disc list-inside text-sm space-y-1 text-foreground-soft">
					<li>Registro del LAeq,Te y cálculo de dosis diaria</li>
					<li>
						Identificación de tipo de ruido (continuo, intermitente, impacto)
					</li>
					<li>Datos del instrumento (sonómetro o dosímetro calibrado)</li>
					<li>Firma del profesional interviniente</li>
					<li>Vigencia máxima de 12 meses</li>
				</ul>
			</section>
		</>
	)
}

function ExtintoresContent() {
	return (
		<>
			<h2 className="text-xl font-semibold">
				Control de Extintores, Carga de Fuego y Medios de Escape
			</h2>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">Finalidad:</strong>{" "}
				Diseñar e inspeccionar los sistemas de protección contra incendios
				pasivos y activos. El cálculo de carga de fuego determina el potencial
				calórico del sector para dimensionar los extintores e instalaciones
				fijas, mientras que el control de medios de escape asegura vías de
				evacuación rápida, libre de obstáculos y segura.{" "}
			</p>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">
					Legislación Aplicable:
				</strong>{" "}
				Ley N° 19.587, Decreto N° 351/79 (Capítulo 18 y Anexo VII) y normas IRAM
				3517.
			</p>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Carga de Fuego</h2>
				<p className="text-sm text-foreground-soft">
					Se define como el peso en madera por unidad de superficie (kg/m²)
					capaz de desarrollar una cantidad de calor equivalente a la de los
					materiales contenidos en el sector de incendio. Como patrón de
					referencia se considera madera con poder calorífico inferior de 18,41
					MJ/kg.
				</p>
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/50">
								<th className="text-left p-3 font-medium">Riesgo</th>
								<th className="text-left p-3 font-medium">
									Carga de Fuego (kg/m²)
								</th>
								<th className="text-left p-3 font-medium">
									Potencial Extintor Mínimo
								</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							<tr>
								<td className="p-3">Riesgo 1 — Explosivo</td>
								<td className="p-3 font-mono">Hasta 15</td>
								<td className="p-3">—</td>
							</tr>
							<tr>
								<td className="p-3">Riesgo 2 — Inflamable</td>
								<td className="p-3 font-mono">16 a 30</td>
								<td className="p-3">6B / 8B</td>
							</tr>
							<tr>
								<td className="p-3">Riesgo 3 — Muy Combustible</td>
								<td className="p-3 font-mono">31 a 60</td>
								<td className="p-3">3A / 10B</td>
							</tr>
							<tr>
								<td className="p-3">Riesgo 4 — Combustible</td>
								<td className="p-3 font-mono">61 a 100</td>
								<td className="p-3">6A / 20B</td>
							</tr>
							<tr>
								<td className="p-3">Riesgo 5 — Poco Combustible</td>
								<td className="p-3 font-mono">Más de 100</td>
								<td className="p-3">A determinar</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Distribución de Extintores</h2>
				<ul className="list-disc list-inside text-sm space-y-1 text-foreground-soft">
					<li>
						Mínimo un matafuego cada 200 m² de superficie a proteger (Art. 176)
					</li>
					<li>
						Distancia máxima a recorrer: 20 m para fuegos clase A, 15 m para
						fuego clase B
					</li>
					<li>Recarga y mantenimiento anual obligatorio (IRAM 3517)</li>
					<li>Señalización visible de la ubicación de cada extintor</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Resistencia al Fuego</h2>
				<p className="text-sm text-foreground-soft">
					Los elementos constructivos deben mantener su capacidad resistente
					durante un tiempo mínimo (F30, F60, F90, F120) según la carga de fuego
					y el riesgo del sector.
				</p>
			</section>
		</>
	)
}

function PatContent() {
	return (
		<>
			<h2 className="text-xl font-semibold">
				Medición de Puesta a Tierra (PAT) y Continuidad de Masas
			</h2>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">Finalidad:</strong>{" "}
				Verificar las condiciones de seguridad de la instalación eléctrica
				mediante la medición de la resistencia de la toma de tierra y la
				continuidad de las masas, garantizando la correcta actuación de las
				protecciones (disyuntores diferenciales) ante contactos
				directos/indirectos.{" "}
			</p>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">
					Legislación Aplicable:
				</strong>{" "}
				Ley N° 19.587, Decreto N° 351/79 (Capítulo 14), Resolución SRT N° 900/15
				(Protocolo para la Verificación de las Condiciones de Seguridad de las
				Instalaciones Eléctricas) y reglamentaciones AEA 90364.
			</p>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Valores de Referencia</h2>
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/50">
								<th className="text-left p-3 font-medium">Concepto</th>
								<th className="text-left p-3 font-medium">Valor Exigido</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							<tr>
								<td className="p-3">Resistencia de PAT</td>
								<td className="p-3 font-mono">
									≤ 40 Ω (recomendable &lt; 10 Ω)
								</td>
							</tr>
							<tr>
								<td className="p-3">Continuidad de masas</td>
								<td className="p-3 font-mono">Conductividad verificada</td>
							</tr>
							<tr>
								<td className="p-3">Tiempo de corte del ID</td>
								<td className="p-3 font-mono">≤ 200 ms (30 mA)</td>
							</tr>
							<tr>
								<td className="p-3">Vigencia del protocolo</td>
								<td className="p-3 font-mono">12 meses</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Procedimiento de Medición</h2>
				<p className="text-sm text-foreground-soft">
					Se utiliza un telurímetro con el método de caída de potencial: se
					inyecta una corriente conocida en el terreno mediante la jabalina
					principal y electrodos auxiliares, midiendo la diferencia de potencial
					para calcular la resistencia en ohmios.
				</p>
				<ul className="list-disc list-inside text-sm space-y-1 text-foreground-soft">
					<li>Desconectar la jabalina de la instalación antes de medir</li>
					<li>Colocar picas auxiliares en línea recta</li>
					<li>
						Verificar la continuidad de todas las masas metálicas accesibles
					</li>
					<li>
						Ensayo de 9 pruebas por interruptor diferencial (tiempo de apertura
						y tensión de contacto)
					</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Protocolo SRT 900/15</h2>
				<p className="text-sm text-foreground-soft">
					La Resolución SRT 900/15 establece el formulario obligatorio que debe
					contener: datos del establecimiento, fecha, tipo de sistema, valor de
					resistencia medido, resultado de continuidad, tiempo de corte del ID,
					instrumento utilizado y firma del profesional responsable.
				</p>
			</section>
		</>
	)
}

function VibracionesContent() {
	return (
		<>
			<h2 className="text-xl font-semibold">
				Medición de Vibraciones (Cuerpo Entero y Mano-Brazo)
			</h2>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">Finalidad:</strong>{" "}
				Evaluar la magnitud de las aceleraciones mecánicas transmitidas al
				cuerpo del trabajador por maquinaria pesada o herramientas, con el
				objeto de implementar controles que prevengan afecciones
				osteoarticulares, neurológicas o vasculares.{" "}
			</p>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">
					Legislación Aplicable:
				</strong>{" "}
				Ley N° 19.587, Decreto N° 351/79 y Resolución SRT N° 295/03 (Anexo V),
				Normas IRAM 4078 y 4097, ISO 2631 y ISO 5349.
			</p>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Tipos de Vibraciones</h2>
				<ul className="space-y-3 text-sm text-foreground-soft">
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-foreground-soft shrink-0 mt-0.5">
							Mano-Brazo
						</span>
						<span>
							Transmitidas a través de las manos por herramientas vibrátiles
							(amoladoras, percutoras, motosierras). Pueden causar síndrome de
							vibración mano-brazo (VWF), neuropatía y trastornos vasculares.
						</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-foreground-soft shrink-0 mt-0.5">
							Cuerpo Entero
						</span>
						<span>
							Transmitidas a través de los pies o la pelvis por vehículos y
							maquinaria pesada (autoelevadores, tractores, máquinas viales).
							Pueden causar lumbalgias, hernias discales y trastornos
							gastrointestinales.
						</span>
					</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Límites de Exposición</h2>
				<p className="text-sm text-foreground-soft">
					La Resolución 295/03 establece los valores de aceleración admisibles
					en función de la frecuencia, tiempo de exposición y eje de medición.
					Se utiliza un acelerómetro triaxial que registra la aceleración
					vibratoria en m/s² en cada eje (X, Y, Z).
				</p>
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/50">
								<th className="text-left p-3 font-medium">Tipo</th>
								<th className="text-left p-3 font-medium">Valor Límite</th>
								<th className="text-left p-3 font-medium">Período</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							<tr>
								<td className="p-3">Mano-Brazo (A(8))</td>
								<td className="p-3 font-mono">5 m/s²</td>
								<td className="p-3">8 horas</td>
							</tr>
							<tr>
								<td className="p-3">Cuerpo Entero (A(8))</td>
								<td className="p-3 font-mono">1.15 m/s²</td>
								<td className="p-3">8 horas</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Instrumental y Metodología</h2>
				<ul className="list-disc list-inside text-sm space-y-1 text-foreground-soft">
					<li>Acelerómetro triaxial con rango y sensibilidad adecuados</li>
					<li>
						Filtros de ponderación en frecuencia (Wh para mano-brazo, Wd/Wk para
						cuerpo entero)
					</li>
					<li>Medición durante toda la jornada o período representativo</li>
					<li>
						Protocolo según planilla 2.G de la Res. SRT 886/15 (Ergonomía)
					</li>
				</ul>
			</section>
		</>
	)
}

function CapacitacionesContent() {
	return (
		<>
			<h2 className="text-xl font-semibold">
				Capacitaciones HSE — Matriz Esencial
			</h2>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">Finalidad:</strong>{" "}
				Cumplir con la obligación legal de instruir al personal en prevención de
				riesgos, promoviendo una cultura preventiva que reduzca la
				siniestralidad.{" "}
				<strong className="text-foreground tracking-widest">
					Marco Legal:
				</strong>{" "}
				Ley 19.587, Dec. 351/79 (Cap. 21, Art. 208-210), Dec. 911/96.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div className="border border-border/60 rounded-xl p-4 space-y-2 bg-muted/20">
					<h3 className="text-sm font-bold text-foreground tracking-wider uppercase">
						Inducción y Cultura
					</h3>
					<ul className="text-sm text-foreground-soft space-y-1">
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Inducción
							General de HyS para Nuevos Ingresos
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Orden y
							Limpieza — Metodología 5S
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Gestión de
							Residuos Laborales e Industriales
						</li>
					</ul>
				</div>
				<div className="border border-border/60 rounded-xl p-4 space-y-2 bg-muted/20">
					<h3 className="text-sm font-bold text-foreground tracking-wider uppercase">
						Riesgos Críticos
					</h3>
					<ul className="text-sm text-foreground-soft space-y-1">
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Riesgo
							Eléctrico y Lockout/Tagout
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Seguridad
							en Trabajos en Altura
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Seguridad
							en Espacios Confinados
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Riesgo
							Químico — SGA/GHS
						</li>
					</ul>
				</div>
				<div className="border border-border/60 rounded-xl p-4 space-y-2 bg-muted/20">
					<h3 className="text-sm font-bold text-foreground tracking-wider uppercase">
						Equipos y Maquinaria
					</h3>
					<ul className="text-sm text-foreground-soft space-y-1">
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Uso
							Correcto de EPP/EPIS
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Operación
							Segura de Autoelevadores (Res. 960/15)
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Maquinaria
							Vial y Equipos de Izaje
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span>{" "}
							Herramientas Manuales y Eléctricas
						</li>
					</ul>
				</div>
				<div className="border border-border/60 rounded-xl p-4 space-y-2 bg-muted/20">
					<h3 className="text-sm font-bold text-foreground tracking-wider uppercase">
						Emergencias y Salud
					</h3>
					<ul className="text-sm text-foreground-soft space-y-1">
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Primeros
							Auxilios y RCP
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Plan de
							Evacuación y Emergencias
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Prevención
							y Extinción de Incendios
						</li>
					</ul>
				</div>
				<div className="border border-border/60 rounded-xl p-4 space-y-2 bg-muted/20">
					<h3 className="text-sm font-bold text-foreground tracking-wider uppercase">
						Ergonomía y Prevención
					</h3>
					<ul className="text-sm text-foreground-soft space-y-1">
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Ergonomía
							Postural y Levantamiento de Cargas
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Prevención
							de Riesgos Biológicos
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Exposición
							a Ruido y Conservación Auditiva
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span>{" "}
							Hidratación y Estrés Térmico
						</li>
					</ul>
				</div>
				<div className="border border-primary/40 rounded-xl p-4 space-y-2 bg-primary/5">
					<h3 className="text-sm font-bold text-foreground tracking-wider uppercase">
						Gestión y Permisos
					</h3>
					<ul className="text-sm text-foreground-soft space-y-1">
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Permisos
							de Trabajo Seguro (PTS) y ART
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary mt-0.5 shrink-0">▸</span> Manejo
							Defensivo y Seguridad Vial
						</li>
					</ul>
				</div>
			</div>

			<p className="text-xs text-foreground-soft text-center border-t border-border pt-4">
				<i>
					Exigencia legal: capacitación inicial al ingreso, reentrenamiento
					anual, registro firmado y evaluación de comprensión (Art. 208-210,
					Dec. 351/79).
				</i>
			</p>
		</>
	)
}

function EPPContent() {
	return (
		<>
			<h2 className="text-xl font-semibold">
				Control de EPP — Certificación y Gestión
			</h2>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">Finalidad:</strong>{" "}
				Gestionar la selección, entrega, reposición y verificación de los
				Equipos de Protección Personal, garantizando certificaciones oficiales
				que mitiguen los riesgos del puesto de trabajo.{" "}
				<strong className="text-foreground tracking-widest">
					Marco Legal:
				</strong>{" "}
				Ley 19.587, Dec. 351/79 (Cap. 19), Res. SRT 299/11 (registro de
				entrega), Res. 896/99 (certificación).
			</p>

			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
				<div className="flex flex-col items-center gap-1.5 border border-border/60 rounded-xl p-3 bg-muted/20">
					<span className="text-2xl">⛑️</span>
					<span className="text-xs font-semibold text-center">Casco</span>
					<span className="text-[10px] text-foreground-soft text-center">
						IRAM 3620
					</span>
				</div>
				<div className="flex flex-col items-center gap-1.5 border border-border/60 rounded-xl p-3 bg-muted/20">
					<span className="text-2xl">🥽</span>
					<span className="text-xs font-semibold text-center">Ocular</span>
					<span className="text-[10px] text-foreground-soft text-center">
						IRAM 3630
					</span>
				</div>
				<div className="flex flex-col items-center gap-1.5 border border-border/60 rounded-xl p-3 bg-muted/20">
					<span className="text-2xl">👂</span>
					<span className="text-xs font-semibold text-center">Auditiva</span>
					<span className="text-[10px] text-foreground-soft text-center">
						IRAM 4060
					</span>
				</div>
				<div className="flex flex-col items-center gap-1.5 border border-border/60 rounded-xl p-3 bg-muted/20">
					<span className="text-2xl">🫁</span>
					<span className="text-xs font-semibold text-center">
						Respiratoria
					</span>
					<span className="text-[10px] text-foreground-soft text-center">
						IRAM 3800
					</span>
				</div>
				<div className="flex flex-col items-center gap-1.5 border border-border/60 rounded-xl p-3 bg-muted/20">
					<span className="text-2xl">🧤</span>
					<span className="text-xs font-semibold text-center">Guantes</span>
					<span className="text-[10px] text-foreground-soft text-center">
						IRAM 3608
					</span>
				</div>
				<div className="flex flex-col items-center gap-1.5 border border-border/60 rounded-xl p-3 bg-muted/20">
					<span className="text-2xl">👢</span>
					<span className="text-xs font-semibold text-center">Calzado</span>
					<span className="text-[10px] text-foreground-soft text-center">
						IRAM 3610
					</span>
				</div>
				<div className="flex flex-col items-center gap-1.5 border border-border/60 rounded-xl p-3 bg-muted/20">
					<span className="text-2xl">🪢</span>
					<span className="text-xs font-semibold text-center">Arnés</span>
					<span className="text-[10px] text-foreground-soft text-center">
						IRAM 3605
					</span>
				</div>
				<div className="flex flex-col items-center gap-1.5 border border-primary/40 rounded-xl p-3 bg-primary/5">
					<span className="text-2xl">👕</span>
					<span className="text-xs font-semibold text-center">
						Alta Visibilidad
					</span>
					<span className="text-[10px] text-foreground-soft text-center">
						IRAM 3859
					</span>
				</div>
			</div>

			<div className="border border-border/60 rounded-xl overflow-hidden">
				<div className="bg-muted/30 px-4 py-2 border-b border-border/60">
					<h3 className="text-sm font-bold text-foreground tracking-wider uppercase">
						Flujo de Gestión de EPP
					</h3>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border/60 text-sm text-foreground-soft">
					<div className="p-3 space-y-1">
						<span className="text-[10px] font-bold text-primary tracking-widest block">
							01
						</span>
						<span className="font-semibold text-foreground text-xs">
							Identificar
						</span>
						<p className="text-[11px]">
							Riesgos del puesto y EPP requerido según el Servicio de HyS
						</p>
					</div>
					<div className="p-3 space-y-1">
						<span className="text-[10px] font-bold text-primary tracking-widest block">
							02
						</span>
						<span className="font-semibold text-foreground text-xs">
							Seleccionar
						</span>
						<p className="text-[11px]">
							Equipo certificado bajo norma IRAM, talla y modelo adecuados
						</p>
					</div>
					<div className="p-3 space-y-1">
						<span className="text-[10px] font-bold text-primary tracking-widest block">
							03
						</span>
						<span className="font-semibold text-foreground text-xs">
							Entregar
						</span>
						<p className="text-[11px]">
							Registrar en Constancia de Entrega (Res. 299/11) con firma del
							trabajador
						</p>
					</div>
					<div className="p-3 space-y-1">
						<span className="text-[10px] font-bold text-primary tracking-widest block">
							04
						</span>
						<span className="font-semibold text-foreground text-xs">
							Capacitar
						</span>
						<p className="text-[11px]">
							Uso, conservación, limpieza y señales de deterioro del EPP
						</p>
					</div>
					<div className="p-3 space-y-1">
						<span className="text-[10px] font-bold text-primary tracking-widest block">
							05
						</span>
						<span className="font-semibold text-foreground text-xs">
							Reponer
						</span>
						<p className="text-[11px]">
							Recambio por desgaste, vencimiento o pérdida; siempre sin costo
						</p>
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-dashed border-amber-600/40 bg-amber-600/5 p-4">
				<p className="text-xs text-foreground-soft text-center">
					<strong className="text-amber-600">Importante:</strong> Sin el sello
					de certificación IRAM o equivalente, el EPP no se considera
					certificado a los fines de la Res. 299/11. Ante una auditoría, la
					falta de certificación expone al empleador a sanciones administrativas
					y responsabilidad civil.
				</p>
			</div>
		</>
	)
}

function AntisiniestralContent() {
	return (
		<>
			<h2 className="text-xl font-semibold">Informe Antisiniestral</h2>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">Finalidad:</strong>{" "}
				Evaluar de forma integral las condiciones edilicias, técnicas,
				estructurales y operativas de un establecimiento para certificar que
				cumple con los estándares mínimos de seguridad contra incendios,
				explosiones y otros siniestros, sirviendo como requisito crítico para
				habilitaciones comerciales e industriales.{" "}
			</p>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">
					Legislación Aplicable:
				</strong>{" "}
				Ley N° 19.587, Decreto N° 351/79 (Capítulo 18), Ley N° 14.836 PBA,
				normativas municipales. En CABA rige la Ley 5920 (Sistema de
				Autoprotección).
			</p>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Contenido del Informe</h2>
				<ul className="list-disc list-inside text-sm space-y-1 text-foreground-soft">
					<li>Tipo de Riesgo y Cálculo de Carga de Fuego</li>
					<li>Determinación del Factor de Ocupación</li>
					<li>Tipo y cantidad de extintores portátiles necesarios</li>
					<li>Dimensionamiento de vías de escape y ancho de salidas</li>
					<li>Verificación de señalización de vías de escape y emergencia</li>
					<li>Tipo, cantidad y ubicación de luminarias de emergencia</li>
					<li>Medición de niveles de iluminación de emergencia</li>
					<li>Verificación de medidas de seguridad contra incendios</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Requisitos para Habilitación</h2>
				<p className="text-sm text-foreground-soft">
					El Informe Antisiniestral es requisito excluyente para obtener la
					habilitación municipal o el Certificado de Aptitud Ambiental. Debe ser
					firmado por un profesional matriculado con incumbencia en Higiene y
					Seguridad. Sin este certificado, el seguro no cubre siniestros y la
					empresa no puede habilitarse.
				</p>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">
					Sistema de Autoprotección (CABA)
				</h2>
				<p className="text-sm text-foreground-soft">
					En CABA, la Ley 5920 establece el Sistema de Autoprotección, que
					incluye roles de evacuación, simulacros obligatorios y un plan de
					emergencia más exigente que el estándar nacional.
				</p>
			</section>
		</>
	)
}

function VehiculosContent() {
	return (
		<>
			<h2 className="text-xl font-semibold">
				Chequeo de Equipos y Vehículos (Checklists Operativos)
			</h2>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">Finalidad:</strong>{" "}
				Realizar la verificación pre operacional rutinaria de maquinaria pesada
				(retropala, autoelevador, motoniveladora, hidrogrúa) y vehículos
				corporativos para detectar fallas mecánicas, hidráulicas o de seguridad
				antes de su puesta en marcha, previniendo accidentes operativos.{" "}
			</p>
			<p className="text-foreground-soft">
				<strong className="text-foreground tracking-widest">
					Legislación Aplicable:
				</strong>{" "}
				Ley N° 19.587, Decreto N° 351/79 (Capítulo 15), Resolución SRT N° 960/15
				(Condiciones de seguridad para autoelevadores), Decreto N° 911/96, Ley
				Nac. de Tránsito N° 24.449.
			</p>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">
					Checklist Diario de Autoelevadores (Res. SRT 960/15)
				</h2>
				<p className="text-sm text-foreground-soft">
					El Art. 16 de la Res. 960/15 establece la obligación de realizar un
					checklist diario antes de la puesta en marcha del equipo:
				</p>
				<ul className="list-disc list-inside text-sm space-y-1 text-foreground-soft columns-1 sm:columns-2">
					<li>Estado de frenos de servicio y estacionamiento</li>
					<li>Luces (giro, balizas, posición, freno, trabajo)</li>
					<li>Bocina y dispositivo de aviso de retroceso</li>
					<li>Cinturón de seguridad</li>
					<li>Espejos retrovisores (ambos lados)</li>
					<li>Neumáticos (presión y desgaste)</li>
					<li>Niveles de fluidos (hidráulico, motor, batería)</li>
					<li>Mástil, torre y cilindro de elevación</li>
					<li>Orquillas y accesorios de carga</li>
					<li>Extintor a bordo</li>
					<li>Superficies antideslizantes (pedales, escalera)</li>
					<li>Pictogramas y cartelería de seguridad visibles</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Requisitos del Operador</h2>
				<ul className="list-disc list-inside text-sm space-y-1 text-foreground-soft">
					<li>
						Capacitación teórico-práctica mínima de 10 horas con evaluación
						final
					</li>
					<li>Revalidación anual de 2 horas de duración</li>
					<li>Credencial con foto, apto médico y vigencia visible</li>
					<li>Solo conductores autorizados por el empleador</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">
					Elementos de Seguridad Obligatorios
				</h2>
				<p className="text-sm text-foreground-soft">
					El autoelevador debe contar con: cinturón de seguridad, luces de giro
					y freno, bocina, alarma de retroceso acústico-luminosa, espejos
					retrovisores, arrestallamas (si corresponde), dispositivo aislante en
					tubo de escape, y asiento ergonómico regulable. Además, señalización
					de áreas de circulación y prohibición de personas debajo de la carga.
				</p>
			</section>
		</>
	)
}

const CONTENT: Record<string, () => React.ReactNode> = {
	iluminacion: IluminacionContent,
	iluminacionValoresRequeridos: IluminacionValoresRequeridosContent,
	ruido: RuidoContent,
	extintores: ExtintoresContent,
	pat: PatContent,
	vibraciones: VibracionesContent,
	capacitaciones: CapacitacionesContent,
	epp: EPPContent,
	antisiniestral: AntisiniestralContent,
	vehiculos: VehiculosContent,
}

function RouteComponent() {
	const { t, from } = Route.useSearch()
	const navigate = useNavigate()
	const Content = CONTENT[t]

	return (
		<article className="w-11/12 mx-auto sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto px-0 sm:px-10 py-10">
			<header className="space-y-4">
				<button
					type="button"
					onClick={() => {
						if (from === "root") navigate({ to: "/" })
						else if (from === "landing")
							navigate({ to: "/landing", hash: "modulos" })
						else navigate({ to: `/${from}` as never })
					}}
					className="inline-flex items-center gap-1 text-sm text-foreground-soft hover:text-foreground transition-colors"
				>
					<ChevronLeft className="size-4" />
					Volver
				</button>
				<Select
					value={t}
					onValueChange={value =>
						navigate({
							to: "/teoria",
							search: { t: value as typeof t },
							replace: true,
						})
					}
				>
					<SelectTrigger className="w-full text-lg font-semibold h-auto min-h-12 py-3">
						<SelectValue className="text-balance leading-snug" />
					</SelectTrigger>
					<SelectContent>
						{TEORIAS.map(t => (
							<SelectItem key={t.id} value={t.id}>
								{t.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</header>

			<section className="space-y-6 mt-10">
				<Content />
			</section>
		</article>
	)
}

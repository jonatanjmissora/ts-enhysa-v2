import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
	Suspense,
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react"
import { areaQueryOptions } from "../../../../../../../queries/reportes/iluminacion/areas/areas-query"
import { Button } from "#/components/ui/button"
import Formula from "#/components/reportes/iluminacion/nuevo-informe/areas/formula"
import {
	getIndiceDeLocal,
	getIndiceRedondeo,
	setResetPuntos,
} from "#/lib/utils"
import { HardHat, Trash2 } from "lucide-react"
import { Input } from "#/components/ui/input"
import { FECHA_1970 } from "#/lib/constants"

export const Route = createFileRoute(
	"/_protected/iluminacion/nuevo-informe/areas/$areaId/crear-puntos/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	const { areaId } = Route.useParams()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron
				to={`/iluminacion/nuevo-informe/areas/${areaId}/crear-data`}
			/>
			<Suspense fallback={<span>Cargando...</span>}>
				<SuspendedTitle />
			</Suspense>
			<Suspense
				fallback={
					<Loading
						text="obteniendo area..."
						className="scale-50 justify-start  max-h-[50svh] "
					/>
				}
			>
				<CargarPuntos />
			</Suspense>
		</article>
	)
}

function SuspendedTitle() {
	const { areaId } = Route.useParams()
	const { data: area } = useSuspenseQuery(areaQueryOptions({ areaId }))
	return <Title text={area?.nombre ?? "..."} className="mt-15" />
}

function CargarPuntos() {
	const { areaId } = Route.useParams()
	const { data: area } = useSuspenseQuery(areaQueryOptions({ areaId }))
	const [puntos, setPuntos] = useState<number[]>([])
	const [timestamps, setTimestamps] = useState<Date[]>([])
	// const [puntosError, setPuntosError] = useState<string | null>(null)

	if (!area) return <NoArea />

	const indiceDeLocal = getIndiceDeLocal(area.largo, area.ancho, area.alto)
	const newIndiceRedondeo = getIndiceRedondeo(indiceDeLocal)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log("PUNTOS", puntos)
	}

	return (
		<section className="w-11/12 sm:w-full my-5 sm:my-4 flex flex-col gap-8 relative">
			<Formula
				alto={Number(area.alto)}
				ancho={Number(area.ancho)}
				largo={Number(area.largo)}
				indiceDeLocal={indiceDeLocal}
				indiceRedondeo={newIndiceRedondeo}
			/>
			<Grilla
				puntos={puntos}
				setPuntos={setPuntos}
				timestamps={timestamps}
				setTimestamps={setTimestamps}
				ancho={Number(area.ancho)}
				largo={Number(area.largo)}
				indiceRedondeo={newIndiceRedondeo}
			/>

			{puntos.every(punto => punto > 0) && (
				<form onSubmit={handleSubmit}>
					<Button>Siguiente</Button>
				</form>
			)}
		</section>
	)
}

function Grilla({
	puntos,
	setPuntos,
	timestamps,
	setTimestamps,
	ancho,
	largo,
	indiceRedondeo,
}: {
	ancho: number
	largo: number
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
	indiceRedondeo: number
}) {
	const [openInputMenu, setOpenInputMenu] = useState<boolean>(false)
	const [actualPunto, setActualPunto] = useState<number | null>(null)

	const celdas = (indiceRedondeo + 2) ** 2 > 64 ? 64 : (indiceRedondeo + 2) ** 2
	const div = Math.sqrt(celdas).toFixed(0)
	const divisionesLargo = Number(div)
	const divisionesAncho = Number(div)
	const largoRatio = 150 * divisionesLargo
	const anchoGrilla = `${(ancho / largo) * largoRatio}px`
	const largoGrilla = `${150 * divisionesLargo}px`
	useEffect(() => {
		const { resetPuntos, resetTimestamps } = setResetPuntos(celdas)
		setPuntos(resetPuntos)
		setTimestamps(resetTimestamps)
	}, [celdas, setPuntos, setTimestamps])

	return (
		<>
			<div className="flex items-center justify-between border-b border-purple-700/75 dark:border-purple-500/75 my-10 w-full">
				<div className="textL py-2 px-3 flex items-center gap-8 justify-between w-full">
					Mediciones{" "}
					<HardHat className="sm:size-7 2xl:size-9 text-purple-700/75 dark:text-purple-500/75" />
				</div>
			</div>

			{openInputMenu ? (
				<InputMenu
					setOpenInputMenu={setOpenInputMenu}
					puntos={puntos}
					setPuntos={setPuntos}
					timestamps={timestamps}
					setTimestamps={setTimestamps}
					actualPunto={actualPunto}
					setActualPunto={setActualPunto}
				/>
			) : (
				<div className="w-[90dvw] sm:w-full min-h-[500px] overflow-auto flex flex-col p-10">
					<div
						className="grid relative mx-auto"
						style={{
							height: largoGrilla,
							width: anchoGrilla,
							gridTemplateColumns: `repeat(${divisionesAncho}, 1fr)`,
							gridTemplateRows: `repeat(${divisionesLargo}, 1fr)`,
						}}
					>
						<span className="absolute left-0 -top-10 w-full border-b border-foreground/20 text-foreground/20 text-xs text-center">
							Ancho: {ancho}m
						</span>
						<span
							className={`absolute -left-4 bottom-0 border-b border-foreground/20 text-foreground/20 -rotate-90 origin-bottom-left text-xs text-center`}
							style={{ width: largoGrilla }}
						>
							Largo: {largo}m
						</span>
						{Array.from({ length: celdas }).map((_, index) => (
							<div
								key={index}
								className={`border dark:border-cyan-300/20 border-cyan-700/30 flex items-center justify-center ${puntos[index] !== 0 ? "bg-cyan-300/20" : ""}`}
							>
								<Punto
									index={index}
									puntos={puntos}
									setOpenInputMenu={setOpenInputMenu}
									setActualPunto={setActualPunto}
								/>
							</div>
						))}
					</div>
				</div>
			)}

			<AreaPuntosList
				puntos={puntos}
				setPuntos={setPuntos}
				timestamps={timestamps}
				setTimestamps={setTimestamps}
			/>
		</>
	)
}

function Punto({
	index,
	setOpenInputMenu,
	puntos,
	setActualPunto,
}: {
	index: number
	setOpenInputMenu: Dispatch<SetStateAction<boolean>>
	puntos: number[]
	setActualPunto: Dispatch<SetStateAction<number | null>>
}) {
	return (
		<div className="flex flex-col gap-1 items-center justify-center">
			<span className="italic tracking-widest text-xs text-foreground">
				punto-{index + 1}
			</span>
			<button
				onClick={() => {
					setOpenInputMenu(true)
					setActualPunto(index)
				}}
				className="w-15 text-xl font-semibold py-1 px-3 bg-accent text-foreground justify-center items-center min-h-9 rounded-sm ring-[1px] dark:ring-foreground/15 ring-foreground/50"
			>
				{puntos[index] !== 0 ? puntos[index] : "*"}
			</button>
		</div>
	)
}

function InputMenu({
	setOpenInputMenu,
	puntos,
	setPuntos,
	timestamps,
	setTimestamps,
	actualPunto,
	setActualPunto,
}: {
	setOpenInputMenu: Dispatch<SetStateAction<boolean>>
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
	actualPunto: number | null
	setActualPunto: Dispatch<SetStateAction<number | null>>
}) {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [puntoValue, setPuntoValue] = useState<string>("")

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
			inputRef.current.select()
		}
	}, [])

	function handleSetPunto() {
		if (actualPunto === null) return
		const newPuntos = [...puntos]
		newPuntos[actualPunto] = Number(puntoValue)
		setPuntos(newPuntos)
		const newTimestamps = [...timestamps]
		newTimestamps[actualPunto] = new Date()
		setTimestamps(newTimestamps)
		setOpenInputMenu(false)
		setActualPunto(null)
	}
	return (
		<form
			onSubmit={handleSetPunto}
			className="min-h-[500px] bg-accent rounded-lg ring-[1px] ring-foreground/15 flex items-center justify-center gap-10 flex-col w-full p-10"
		>
			<span className="border-b py-2 border-foreground/50 w-full text-left text-foreground/70">
				Punto {actualPunto !== null ? actualPunto + 1 : ""}
			</span>
			<Input
				ref={inputRef}
				defaultValue={
					actualPunto !== null && puntos[actualPunto] !== 0
						? puntos[actualPunto]
						: ""
				}
				type="number"
				id="punto"
				name="punto"
				onFocus={e => e.target.select()}
				className="dark:bg-foreground/50 bg-foreground/50 text-background/75 tracking-widest text-3xl md:text-3xl w-3/4 sm:w-1/2 p-4 h-20 text-center rounded-md focus:text-blue-200 dark:focus:text-blue-800 font-bold"
				onChange={e => setPuntoValue(e.currentTarget.value)}
			/>
			<div className="w-full flex flex-col sm:flex-row justify-between gap-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => setOpenInputMenu(false)}
					className="flex-1"
				>
					Cancelar
				</Button>
				<Button type="submit" className="flex-1" onClick={handleSetPunto}>
					Guardar
				</Button>
			</div>
		</form>
	)
}

function AreaPuntosList({
	puntos,
	setPuntos,
	timestamps,
	setTimestamps,
}: {
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
}) {
	const handleSetPunto = (index: number) => {
		const newPuntos = puntos.map((np, indexNP) => (indexNP === index ? 0 : np))
		setPuntos(newPuntos)
		const newTimestamps = timestamps.map((nt, indexNT) =>
			indexNT === index ? FECHA_1970 : nt
		)
		setTimestamps(newTimestamps)
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-4  textXS">
			{puntos.map((punto, index) => (
				<div
					key={index}
					className="flex items-center justify-between p-2 border-b border-foreground/20"
				>
					<span>punto-{index + 1}</span>
					<span>{punto}</span>
					<button type="button" onClick={() => handleSetPunto(index)}>
						<Trash2 className="size-4 cursor-pointer text-red-700/50" />
					</button>
				</div>
			))}
		</div>
	)
}

function NoArea() {
	return (
		<article className="w-full flex flex-col justify-center items-center gap-10 my-10">
			<p>No se encontro area</p>
			<Link to="/iluminacion/nuevo-informe/areas">
				<Button className="px-10">Volver</Button>
			</Link>
		</article>
	)
}

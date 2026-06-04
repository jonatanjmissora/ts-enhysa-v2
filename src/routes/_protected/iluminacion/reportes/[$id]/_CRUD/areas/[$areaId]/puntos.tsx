import BackChevron from "#/components/back-chevron"
import Loading from "#/components/loading"
import Title from "#/components/title"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import {
	Suspense,
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react"
import { Button } from "#/components/ui/button"
import Formula from "#/components/reportes/iluminacion/nuevo-informe/areas/formula"
import {
	getIndiceDeLocal,
	getIndiceRedondeo,
	resetPuntos,
	resetTimestamps,
	setResetPuntos,
} from "#/lib/utils"
import { HardHat, Loader, Trash2 } from "lucide-react"
import { Input } from "#/components/ui/input"
import { FECHA_1970 } from "#/lib/constants"
import { areaQueryOptions } from "../../../../../../../../../queries/reportes/iluminacion/areas/areas-query"
import { useForm } from "@tanstack/react-form"
import z from "zod"
import type { AreaIluminacionType } from "../../../../../../../../../db/reportes/iluminacion/areas/schema"
import { useUpdateArea } from "../../../../../../../../../queries/reportes/iluminacion/areas/use-update-area"
import useScrollTop from "#/hooks/scroll-top"

export const Route = createFileRoute(
	"/_protected/iluminacion/reportes/$id/_CRUD/areas/$areaId/puntos"
)({
	component: RouteComponent,
})

function RouteComponent() {
	useScrollTop()
	const { id, areaId } = Route.useParams()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron
				to={`/iluminacion/reportes/$id/areas/$areaId/edit-area`}
				params={{ id, areaId }}
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
				<CargarPuntosData />
			</Suspense>
		</article>
	)
}

function SuspendedTitle() {
	const { areaId } = Route.useParams()
	const { data: area } = useSuspenseQuery(areaQueryOptions({ areaId }))
	return <Title text={area?.nombre ?? "..."} className="mt-15" />
}

function CargarPuntosData() {
	const { areaId } = Route.useParams()
	const { data: area } = useSuspenseQuery(areaQueryOptions({ areaId }))

	if (!area) return <NoArea />
	return <CargarPuntos area={area} />
}

function CargarPuntos({ area }: { area: AreaIluminacionType }) {
	const navigate = useNavigate()
	const [puntos, setPuntos] = useState<number[]>(
		area.puntos.length !== 0 ? area.puntos : resetPuntos(area.largo, area.ancho, area.alto)
	)
	const [timestamps, setTimestamps] = useState<Date[]>(
		area.timestamps.length !== 0 ? area.timestamps : resetTimestamps(area.largo, area.ancho, area.alto)
	)
	const [puntosError, setPuntosError] = useState<string | null>(null)
	const [puntosCount, setPuntosCount] = useState<0 | 1 | 2 | 3>(0)
	const { mutateAsync: editArea, isPending, error } = useUpdateArea()
	const indiceDeLocal = getIndiceDeLocal(area.largo, area.ancho, area.alto)
	const newIndiceRedondeo = getIndiceRedondeo(indiceDeLocal)

	const form = useForm({
		defaultValues: { puntos, timestamps },
		validators: {
			onSubmit: z.object({
				puntos: z.array(z.number()),
				timestamps: z.array(z.date()),
			}),
		},
		onSubmit: async ({ value }) => {
			setPuntosError(null)
			if (
				JSON.stringify(puntos) === JSON.stringify(area.puntos) &&
				JSON.stringify(timestamps) === JSON.stringify(area.timestamps)
			) {
				navigate({
					to: "/iluminacion/reportes/$id/areas",
					params: { id: area.reportId },
				})
				return
			}

			const newArea: AreaIluminacionType = {
				...area,
				puntos: value.puntos,
				timestamps: value.timestamps,
			}
			const result = await editArea({ data: newArea })
			if (!result) {
				console.error("Error al actualizar puntos", error)
				return
			}
			console.log("Puntos actualizada exitosamente")
			navigate({
				to: "/iluminacion/reportes/$id/areas",
				params: { id: area.reportId },
			})
		},
	})

	useEffect(() => {
		const updatePuntos = async () => {
			try {
				const newArea: AreaIluminacionType = {
					...area,
					puntos: puntos,
					timestamps: timestamps,
				}

				const result = await editArea({ data: newArea })
				if (!result) {
					console.error("Error al actualizar puntos", error)
					return
				}
				console.log("Puntos actualizada exitosamente")
			} catch (error) {
				console.log("Error", error)
			}
		}

		if (puntosCount === 3) {
			updatePuntos()
			setPuntosCount(0)
		}
	}, [puntosCount, puntos, timestamps, area, editArea, error])

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
				setPuntosCount={setPuntosCount}
			/>

			<form
				id="edit-puntos"
				onSubmit={e => {
					e.preventDefault()
					form.handleSubmit()
				}}
				className="w-full flex flex-col gap-3 items-center justify-center mt-12"
			>
				<Button className="w-5/6 sm:w-1/3" type="submit" disabled={isPending}>
					{isPending ? (
						<div className="flex gap-2 w-full justify-center items-center">
							Guardando... <Loader className="animate-spin size-4"></Loader>
						</div>
					) : (
						"Siguiente"
					)}
				</Button>
				{puntosError && (
					<span className="w-full text-amber-700/70 italic tracking-wide text-xs sm:w-1/2 text-center text-pretty">
						{puntosError}
					</span>
				)}
			</form>
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
	setPuntosCount,
}: {
	ancho: number
	largo: number
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
	indiceRedondeo: number
	setPuntosCount: Dispatch<SetStateAction<0 | 1 | 2 | 3>>
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
	// useEffect(() => {
	// 	const { resetPuntos, resetTimestamps } = setResetPuntos(celdas)
	// 	setPuntos(resetPuntos)
	// 	setTimestamps(resetTimestamps)
	// }, [celdas, setPuntos, setTimestamps])

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
					setPuntosCount={setPuntosCount}
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
				setPuntosCount={setPuntosCount}
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
	setPuntosCount,
}: {
	setOpenInputMenu: Dispatch<SetStateAction<boolean>>
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
	actualPunto: number | null
	setActualPunto: Dispatch<SetStateAction<number | null>>
	setPuntosCount: Dispatch<SetStateAction<0 | 1 | 2 | 3>>
}) {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [puntoValue, setPuntoValue] = useState<string>("")

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
			inputRef.current.select()
		}
	}, [])

	function handleSetPunto(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (actualPunto === null || puntoValue === "") return
		const newPuntos = [...puntos]
		newPuntos[actualPunto] = Number(puntoValue)
		setPuntos(newPuntos)
		const newTimestamps = [...timestamps]
		newTimestamps[actualPunto] = new Date()
		setTimestamps(newTimestamps)
		setOpenInputMenu(false)
		setActualPunto(null)
		setPuntosCount(prev => (prev + 1) as 0 | 1 | 2 | 3)
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
				<Button type="submit" className="flex-1">
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
	setPuntosCount,
}: {
	puntos: number[]
	setPuntos: Dispatch<SetStateAction<number[]>>
	timestamps: Date[]
	setTimestamps: Dispatch<SetStateAction<Date[]>>
	setPuntosCount: Dispatch<SetStateAction<0 | 1 | 2 | 3>>
}) {
	const handleSetPunto = (index: number) => {
		const newPuntos = puntos.map((np, indexNP) => (indexNP === index ? 0 : np))
		setPuntos(newPuntos)
		const newTimestamps = timestamps.map((nt, indexNT) =>
			indexNT === index ? FECHA_1970 : nt
		)
		setTimestamps(newTimestamps)
		setPuntosCount(prev => (prev - 1 <= 0 ? 0 : prev - 1) as 0 | 1 | 2 | 3)
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-4  textXS">
			{puntos.map((punto, index) => (
				<div
					key={index}
					className="flex items-center justify-between p-2 border-b border-foreground/20"
				>
					<span>punto-{index + 1}</span>
					<span>{punto === 0 ? "*" : punto}</span>
					<button type="button" onClick={() => handleSetPunto(index)}>
						<Trash2 className="size-4 cursor-pointer text-red-700/50" />
					</button>
				</div>
			))}
		</div>
	)
}

function NoArea() {
	const { id, areaId } = Route.useParams()
	return (
		<article className="w-full flex flex-col justify-center items-center gap-10 my-10">
			<p>No se encontro area</p>
			<Link
				to="/iluminacion/reportes/$id/areas/$areaId/edit-area"
				params={{ id, areaId }}
			>
				<Button className="px-10">Volver</Button>
			</Link>
		</article>
	)
}

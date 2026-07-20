import { Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import MembreteSuperior from "./membrete-superior"
import MembreteInferior from "./membrete-inferior"
import { MUESTREO } from "@/lib/constants"
import type { EmpresaType } from "../../../../../db/empresas/schema"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"
import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"
import { capitalizeString, sortedByName } from "#/lib/utils"
import Watermark from "./watermark"
import type { LocalizadaIluminacionType } from "../../../../../db/reportes/iluminacion/localizadas/schema"

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#fff",
		fontFamily: "Roboto",
		padding: "0px 30px",
		position: "relative",
	},
	pagePadding: {
		border: "1px solid black",
	},
	title: {
		fontSize: 10,
		fontWeight: 700,
		textAlign: "center",
		padding: "7px 0px",
		color: "white",
		backgroundColor: "black",
		letterSpacing: "1px",
	},
	subtitle: {
		fontSize: 10,
		fontWeight: 500,
		textAlign: "center",
		padding: "5px 0px",
		color: "black",
		backgroundColor: "gray",
		letterSpacing: "1px",
		borderBottom: "1px solid black",
	},
	row: {
		fontSize: 10,
		borderBottom: "1px solid black",
		padding: "5px 10px",
	},
	flexrow: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		borderBottom: "1px solid black",
	},
	flexrowelement: {
		fontSize: 10,
		padding: "5px 10px",
	},
	flexRowElementWithHight: {
		fontSize: 10,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
	},
})

const COLUMNWIDTH = [6, 5, 16, 16, 10, 11, 10, 10, 6, 10]

type RowData =
	| { kind: "localizada"; localizada: LocalizadaIluminacionType }
	| { kind: "punto"; area: AreaIluminacionType; punto: number; index: number }

export default function Page2({
	localizadas,
	areas,
	tecnico,
	empresa,
	showWatermark = true,
}: {
	localizadas: LocalizadaIluminacionType[]
	areas: AreaIluminacionType[]
	empresa: EmpresaType
	tecnico: TecnicoType
	showWatermark?: boolean
}) {
	const rows = flattenRows(localizadas, areas)
	const chunks = chunkRows(rows)
	let offset = 0

	return chunks.map((chunk, pageIndex) => {
		const currentOffset = offset
		offset += chunk.length
		return (
			<PageContent
				key={pageIndex}
				rows={chunk}
				localizadas={localizadas}
				areas={areas}
				tecnico={tecnico}
				empresa={empresa}
				muestreoOffset={currentOffset}
				showWatermark={showWatermark}
			/>
		)
	})
}

function flattenRows(
	localizadas: LocalizadaIluminacionType[],
	areas: AreaIluminacionType[]
): RowData[] {
	const rows: RowData[] = []
	for (const loc of sortedByName(localizadas)) {
		rows.push({ kind: "localizada", localizada: loc })
	}
	for (const area of sortedByName(areas)) {
		const puntosValidos = area.puntos.filter(p => p > 0)
		puntosValidos.forEach((punto, index) => {
			rows.push({ kind: "punto", area, punto, index })
		})
	}
	return rows
}

function chunkRows(rows: RowData[], maxRows = 13): RowData[][] {
	const chunks: RowData[][] = []
	for (let i = 0; i < rows.length; i += maxRows) {
		chunks.push(rows.slice(i, i + maxRows))
	}
	return chunks
}

function PageContent({
	rows,
	localizadas,
	areas,
	tecnico,
	empresa,
	muestreoOffset,
	showWatermark = true,
}: {
	rows: RowData[]
	localizadas: LocalizadaIluminacionType[]
	areas: AreaIluminacionType[]
	tecnico: TecnicoType
	empresa: EmpresaType
	muestreoOffset: number
	showWatermark?: boolean
}) {
	const allObs = [...localizadas, ...areas]
	const observaciones = allObs
		.filter(item => item.observaciones !== "")
		.map(item => `${capitalizeString(item.nombre)}: ${item.observaciones}`)
		.join(" - ")

	return (
		<Page size="A4" orientation="landscape" style={styles.page}>
			{showWatermark && <Watermark />}
			<MembreteSuperior empresa={empresa} />
			<Text
				style={{
					width: "100%",
					textAlign: "center",
					fontSize: 11,
					margin: 8,
					fontWeight: "900",
				}}
			>
				Anexo 2
			</Text>
			<View style={[styles.pagePadding, { flex: 1 }]}>
				<Text style={styles.title}>
					PROTOCOLO PARA MEDICIÓN DE ILUMINACIÓN EN EL AMBIENTE LABORAL
				</Text>

				<View style={styles.flexrow}>
					<View style={[styles.flexrowelement, { flex: 1 }]}>
						<Text>(18) Razón Social: {empresa.razonSocial.toUpperCase()}</Text>
					</View>
					<View
						style={[
							styles.flexrowelement,
							{ borderLeft: "1px solid black", width: 180 },
						]}
					>
						<Text>(19) C.U.I.T.: {empresa.cuit}</Text>
					</View>
				</View>

				<View style={styles.flexrow}>
					<View
						style={[
							styles.flexrowelement,
							{ borderRight: "1px solid black", width: "35%" },
						]}
					>
						<Text>(20) Dirección: {empresa.direccion.toUpperCase()}</Text>
					</View>
					<View
						style={[
							styles.flexrowelement,
							{ borderRight: "1px solid black", width: "25%" },
						]}
					>
						<Text>(21) Localidad: {empresa.localidad.toUpperCase()}</Text>
					</View>
					<View
						style={[
							styles.flexrowelement,
							{ borderRight: "1px solid black", width: "15%" },
						]}
					>
						<Text>(22) CP: {empresa.codigoPostal}</Text>
					</View>
					<View style={[styles.flexrowelement, { width: "25%" }]}>
						<Text>(23) Provincia: {empresa.provincia.toUpperCase()}</Text>
					</View>
				</View>

				<Text style={styles.subtitle}>Datos de la Medición</Text>
				<View style={styles.flexrow}>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[0]}%` },
						]}
					>
						<Text>(24)</Text>
						<Text>Punto de</Text>
						<Text>muestreo</Text>
					</View>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[1]}%` },
						]}
					>
						<Text>(25) </Text>
						<Text>Hora</Text>
					</View>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[2]}%` },
						]}
					>
						<Text>(26) </Text>
						<Text>Sector</Text>
					</View>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[3]}%` },
						]}
					>
						<Text>(27)</Text>
						<Text>Sección / Puesto / Tipo</Text>
					</View>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[4]}%` },
						]}
					>
						<Text>(28)</Text>
						<Text>Tipo de</Text>
						<Text>iluminación:</Text>
						<Text>Natural /</Text>
						<Text>Artificial /</Text>
						<Text>Mixta</Text>
					</View>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[5]}%` },
						]}
					>
						<Text>(29)</Text>
						<Text>Tipo de fuente</Text>
						<Text>lumínica:</Text>
						<Text>Incandescente /</Text>
						<Text>Descarga /</Text>
						<Text>Mixta</Text>
					</View>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[6]}%` },
						]}
					>
						<Text>(30)</Text>
						<Text>Iluminación:</Text>
						<Text>General /</Text>
						<Text>Localizada /</Text>
						<Text>Mixta</Text>
					</View>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[7]}%` },
						]}
					>
						<Text>(31) Valor de</Text>
						<Text>la uniformidad</Text>
						<Text>de iluminancia</Text>
						<Text>E mínima {"\u2265"}</Text>
						<Text>(E media)/2</Text>
					</View>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[8]}%` },
						]}
					>
						<Text>(32)</Text>
						<Text>Valor</Text>
						<Text>Medido</Text>
						<Text>(Lux)</Text>
					</View>
					<View
						style={[
							styles.flexRowElementWithHight,
							{ borderRight: "1px solid black", width: `${COLUMNWIDTH[9]}%` },
						]}
					>
						<Text>(33) Valor</Text>
						<Text>requerido</Text>
						<Text>legalmente</Text>
						<Text>según</Text>
						<Text>Anexo IV</Text>
						<Text>Dec. 351/79</Text>
					</View>
				</View>

				{rows.map((row, rowIndex) => {
					const muestreoIndex = muestreoOffset + rowIndex
					if (row.kind === "localizada") {
						return (
							<LocalizadaRow
								key={row.localizada.id}
								localizada={row.localizada}
								muestreoIndex={muestreoIndex}
							/>
						)
					}
					return (
						<PuntoRow
							key={`${row.area.id}-${row.index}`}
							area={row.area}
							punto={row.punto}
							puntoIndex={row.index}
							muestreoIndex={muestreoIndex}
						/>
					)
				})}

				<Text style={[styles.row, { height: 40, borderBottom: "none" }]}>
					(34) Observaciones: {observaciones || "Sin observaciones"}
				</Text>
			</View>
			<MembreteInferior tecnico={tecnico} />
		</Page>
	)
}

function LocalizadaRow({
	localizada,
	muestreoIndex,
}: {
	localizada: LocalizadaIluminacionType
	muestreoIndex: number
}) {
	return (
		<View style={styles.flexrow}>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[0]}%` },
				]}
			>
				<Text>{MUESTREO[muestreoIndex]}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[1]}%` },
				]}
			>
				<Text>
					{new Date(localizada.timestamps[0])
						.toLocaleTimeString("it-IT")
						.substring(0, 5)}
				</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[2]}%` },
				]}
			>
				<Text>{capitalizeString(localizada.nombre)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[3]}%` },
				]}
			>
				<Text>{capitalizeString(localizada.tipo)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[4]}%` },
				]}
			>
				<Text>{capitalizeString(localizada.iluminacionTipo)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[5]}%` },
				]}
			>
				<Text>{capitalizeString(localizada.iluminacionFuente)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[6]}%` },
				]}
			>
				<Text>{capitalizeString(localizada.iluminacion)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[7]}%` },
				]}
			>
				<Text>-</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[8]}%` },
				]}
			>
				<Text>{localizada.valor}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[9]}%` },
				]}
			>
				<Text>{localizada.valorRequerido}</Text>
			</View>
		</View>
	)
}

function PuntoRow({
	area,
	punto,
	puntoIndex,
	muestreoIndex,
}: {
	area: AreaIluminacionType
	punto: number
	puntoIndex: number
	muestreoIndex: number
}) {
	const celdasMedidas = area.puntos.filter(p => p > 0)
	const Eminima = Math.min(...celdasMedidas)
	const uniformidad = Math.ceil(
		celdasMedidas.reduce((acc, valor) => acc + valor, 0) /
			celdasMedidas.length /
			2
	)
	const menorSimbolo = "\u003c"
	const mayorIgualSimbolo = "\u2265"
	const simbolo = Eminima >= uniformidad ? mayorIgualSimbolo : menorSimbolo

	return (
		<View style={styles.flexrow}>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[0]}%` },
				]}
			>
				<Text>{MUESTREO[muestreoIndex]}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[1]}%` },
				]}
			>
				<Text>
					{new Date(area.timestamps[puntoIndex])
						.toLocaleTimeString("it-IT")
						.substring(0, 5)}
				</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[2]}%` },
				]}
			>
				<Text>{capitalizeString(area.nombre)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[3]}%` },
				]}
			>
				<Text>{capitalizeString(area.tipo)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[4]}%` },
				]}
			>
				<Text>{capitalizeString(area.iluminacionTipo)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[5]}%` },
				]}
			>
				<Text>{capitalizeString(area.iluminacionFuente)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[6]}%` },
				]}
			>
				<Text>{capitalizeString(area.iluminacion)}</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[7]}%` },
				]}
			>
				<Text>
					{Eminima} {simbolo} {uniformidad}
				</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[8]}%` },
				]}
			>
				<Text
					style={{
						color: `${punto === Eminima ? "red" : "black"}`,
					}}
				>
					{punto}
				</Text>
			</View>
			<View
				style={[
					styles.flexRowElementWithHight,
					{ borderRight: "1px solid black", width: `${COLUMNWIDTH[9]}%` },
				]}
			>
				<Text>{area.valorRequerido}</Text>
			</View>
		</View>
	)
}

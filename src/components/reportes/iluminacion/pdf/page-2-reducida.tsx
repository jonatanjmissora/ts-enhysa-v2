import { Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import MembreteSuperior from "./membrete-superior"
import MembreteInferior from "./membrete-inferior"
import { MUESTREO } from "@/lib/constants"
import type { EmpresaType } from "../../../../../db/empresas/schema"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"
import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"
import { capitalizeString, sortedByName } from "#/lib/utils"
import Watermark from "./watermark"

// Create styles
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

export default function Page2({
	areas,
	tecnico,
	empresa,
}: {
	areas: AreaIluminacionType[]
	empresa: EmpresaType
	tecnico: TecnicoType
}) {
	return <AreaTableOnePage areas={areas} tecnico={tecnico} empresa={empresa} />
}

function AreaTableOnePage({
	areas,
	tecnico,
	empresa,
}: {
	areas: AreaIluminacionType[]
	tecnico: TecnicoType
	empresa: EmpresaType
}) {
	return (
		<Page size="A4" orientation="landscape" style={styles.page}>
			<Watermark />
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

				{/* **************************************************************************************************** */}

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

				{/* **************************************************************************************************** */}

				{sortedByName(areas).map((area, muestreoIndex) => (
					<TablaDePuntos
						key={area.id}
						area={area}
						muestreoIndex={muestreoIndex}
					/>
				))}
				{/* **************************************************************************************************** */}

				<Text style={[styles.row, { height: 40, borderBottom: "none" }]}>
					(34) Observaciones:{" "}
					{areas
						.map(area =>
							area.observaciones !== ""
								? `${capitalizeString(area.nombre)}: ${area.observaciones}`
								: "Sin Observaciones"
						)
						.join(" - ")}
				</Text>
			</View>
			<MembreteInferior tecnico={tecnico} />
		</Page>
	)
}

function TablaDePuntos({
	area,
	muestreoIndex,
}: {
	area: AreaIluminacionType
	muestreoIndex: number
}) {
	const celdasMedidas = area.puntos.filter(punto => punto > 0)
	const Eminima = Math.min(...celdasMedidas)
	const EminimaTimestamp = area.timestamps[celdasMedidas.indexOf(Eminima)]
	const promedio = Math.round(
		celdasMedidas.reduce((acc, valor) => acc + valor, 0) / celdasMedidas.length
	)
	const uniformidad = Math.ceil(promedio / 2)

	const menorSimbolo = "\u003c"
	const mayorIgualSimbolo = "\u2265"
	const simbolo = Eminima >= uniformidad ? mayorIgualSimbolo : menorSimbolo

	return (
		<View>
			<View style={styles.flexrow}>
				<View
					style={[
						styles.flexRowElementWithHight,
						{ borderRight: "1px solid black", width: `${COLUMNWIDTH[0]}%` },
					]}
				>
					{/* LETRA */}
					<Text>{MUESTREO[muestreoIndex]}</Text>
				</View>
				<View
					style={[
						styles.flexRowElementWithHight,
						{ borderRight: "1px solid black", width: `${COLUMNWIDTH[1]}%` },
					]}
				>
					{/* HORA */}
					<Text>
						{new Date(EminimaTimestamp)
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
					{/* SECTOR NOMBRE */}
					<Text>{capitalizeString(area.nombre)}</Text>
				</View>
				<View
					style={[
						styles.flexRowElementWithHight,
						{ borderRight: "1px solid black", width: `${COLUMNWIDTH[3]}%` },
					]}
				>
					{/* Sección / Puesto / Tipo */}
					<Text>{capitalizeString(area.tipo)}</Text>
				</View>
				<View
					style={[
						styles.flexRowElementWithHight,
						{ borderRight: "1px solid black", width: `${COLUMNWIDTH[4]}%` },
					]}
				>
					{/* Tipo de iluminación */}
					<Text>{capitalizeString(area.iluminacionTipo)}</Text>
				</View>
				<View
					style={[
						styles.flexRowElementWithHight,
						{ borderRight: "1px solid black", width: `${COLUMNWIDTH[5]}%` },
					]}
				>
					{/* Tipo de fuente */}
					<Text>{capitalizeString(area.iluminacionFuente)}</Text>
				</View>
				<View
					style={[
						styles.flexRowElementWithHight,
						{ borderRight: "1px solid black", width: `${COLUMNWIDTH[6]}%` },
					]}
				>
					{/* Iluminación: */}
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
					{/* Valor media*/}
				</View>
				<View
					style={[
						styles.flexRowElementWithHight,
						{ borderRight: "1px solid black", width: `${COLUMNWIDTH[8]}%` },
					]}
				>
					<Text>{promedio}</Text>
					{/* Valor Medido */}
				</View>
				<View
					style={[
						styles.flexRowElementWithHight,
						{ borderRight: "1px solid black", width: `${COLUMNWIDTH[9]}%` },
					]}
				>
					<Text>{area.valorRequerido}</Text>
					{/* Valor requerido */}
				</View>
			</View>
		</View>
	)
}

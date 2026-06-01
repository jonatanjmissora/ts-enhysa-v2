import { Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import MembreteSuperior from "./membrete-superior"
import MembreteInferior from "./membrete-inferior"
import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"
import type { EmpresaType } from "../../../../../db/empresas/schema"
import { getNumeroCeldas } from "#/lib/utils"
import { ChartAreaPDF } from "./ChartAreaPDF"

// Create styles
const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#fff",
		fontFamily: "Roboto",
		padding: "0px 60px",
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
		fontSize: 9,
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
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		fontSize: 9,
		height: 100,
	},
})

export default function Page6({
	areas,
	tecnico,
	empresa,
}: {
	areas: AreaIluminacionType[]
	tecnico: TecnicoType
	empresa: EmpresaType
}) {
	return (
		<>
			{areas.map(area => (
				<Area key={area.id} area={area} tecnico={tecnico} empresa={empresa} />
			))}
		</>
	)
}

function Area({
	area,
	tecnico,
	empresa,
}: {
	area: AreaIluminacionType
	tecnico: TecnicoType
	empresa: EmpresaType
}) {
	const ancho = area.ancho
	const largo = area.largo
	const alto = area.alto
	const div = Math.sqrt(getNumeroCeldas(ancho, largo, alto))
	let cellW = 75
	let cellH = (largo * cellW) / ancho

	if (cellW * div >= 470 || cellH * div >= 450) {
		if (ancho > largo) {
			cellW = 470 / div
			cellH = (largo * cellW) / ancho
		} else {
			cellH = 450 / div
			cellW = (ancho * cellH) / largo
		}
	}

	return (
		<Page size="A4" style={styles.page}>
			<MembreteSuperior empresa={empresa} />
			<Text
				style={{
					width: "100%",
					textAlign: "center",
					fontSize: 12,
					margin: 10,
					fontWeight: "900",
				}}
			>
				Anexo 6
			</Text>

			<View
				style={{
					flex: 1,
					width: "100%",
					margin: "0 auto",
				}}
			>
				<ChartAreaPDF puntos={area.puntos} />
			</View>

			<MembreteInferior tecnico={tecnico} />
		</Page>
	)
}

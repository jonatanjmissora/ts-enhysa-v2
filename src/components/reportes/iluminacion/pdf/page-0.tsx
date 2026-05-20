import { Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import MembreteSuperior from "./membrete-superior"
import MembreteInferior from "./membrete-inferior"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"
import type { EmpresaType } from "../../../../../db/empresas/schema"

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
		fontSize: 20,
		fontWeight: 900,
		textAlign: "center",
		padding: "10px 35px",
		color: "black",
		backgroundColor: "gray",
		letterSpacing: "1px",
		border: "1px solid black",
	},
})

export default function Page0({
	tecnico,
	empresa,
}: {
	tecnico: TecnicoType
	empresa: EmpresaType
}) {
	return (
		<Page size="A4" style={styles.page}>
			<MembreteSuperior empresa={empresa} />

			<View
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",

					gap: "30px",
				}}
			>
				<View style={[styles.title]}>
					<Text>INFORME TÉCNICO DE MEDICIÓN</Text>
					<Text>DE ILUMINACIÓN</Text>
					<Text style={{ fontSize: 12, fontWeight: 500, paddingTop: "10px" }}>
						Protocolo según Resolución SRT 84/2012
					</Text>
				</View>

				<View
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
						letterSpacing: "1px",
					}}
				>
					<Text style={{ fontSize: 12, fontWeight: 900, color: "darkblue" }}>
						1. OBJ ETIVO Y MARCO LEGAL
					</Text>
					<Text style={{ fontSize: 10, padding: "10px 25px" }}>
						El presente informe tiene como objeto verificar las condiciones de
						iluminación en los puestos de trabajo del establecimiento, dando
						cumplimiento a lo establecido en:
					</Text>
					<Text style={{ fontSize: 10, padding: "2px 35px" }}>
						• Ley 19.587 de Higiene y Seguridad en el Trabajo.
					</Text>
					<Text style={{ fontSize: 10, padding: "2px 35px" }}>
						• Decreto Reglamentario 351/79, Capítulo 12, Anexo IV.
					</Text>
					<Text style={{ fontSize: 10, padding: "2px 35px" }}>
						• Resolución SRT 84/2012: Protocolo para la Medición de la
						Iluminación en el Ambiente Laboral. El presente protocolo tiene
						vigencia de actualización Anual.
					</Text>
				</View>
				<View
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
						letterSpacing: "1px",
					}}
				>
					<Text style={{ fontSize: 12, fontWeight: 900, color: "darkblue" }}>
						2. METODOLOGÍA DE MEDICIÓN
					</Text>
					<Text style={{ fontSize: 10, padding: "10px 25px" }}>
						Las mediciones se realizaron sobre el plano de trabajo (o a 0.80m
						del suelo para iluminación general). Se consideraron los puntos
						críticos y áreas de tránsito. Se realizan los cálculos de cada área
						de medición según el método de cuadrilla. Calculando el Índice del
						Local (K), tomando el Largo (L) x Ancho (W) por altura de Luminarias
						al Plano de Trabajo (h) según la fórmula K = (LxW)/(h x (L+W)).
						Tomaremos el número X como el K redondeado a su entero superior.
						Luego N es el Número de Puntos mínimos de Medición. N = (X + 2 )2
					</Text>
					<Text style={{ fontSize: 10, padding: "2px 35px" }}>
						Ejemplo: Si K= 1,3888; X=2 y N = (2 + 2)2 = 16
					</Text>
				</View>
				<View
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
						letterSpacing: "1px",
					}}
				>
					<Text style={{ fontSize: 12, fontWeight: 900, color: "darkblue" }}>
						3. PROTOCOLO DE MEDICIÓN (PLANILLA DE DATOS)
					</Text>
				</View>
			</View>

			<MembreteInferior tecnico={tecnico} />
		</Page>
	)
}

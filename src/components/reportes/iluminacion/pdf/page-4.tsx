import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import MembreteSuperior from "./membrete-superior"
import MembreteInferior from "./membrete-inferior"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"
import type { EmpresaType } from "../../../../../db/empresas/schema"
import type { InstrumentoType } from "../../../../../db/instrumentos/schema"
import Watermark from "./watermark"

// Create styles
const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#fff",
		fontFamily: "Roboto",
		padding: "0px 60px",
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

export default function Page4({
	tecnico,
	empresa,
	instrumento,
	showWatermark = true,
}: {
	tecnico: TecnicoType
	empresa: EmpresaType
	instrumento: InstrumentoType
	showWatermark?: boolean
}) {
	return (
		<Page size="A4" style={styles.page}>
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
				Anexo 4
			</Text>
			<View style={[styles.pagePadding, { flex: 1, border: "none" }]}>
				<Text style={styles.title}>INSTRUMENTO</Text>
				<View
					style={[
						styles.row,
						{
							padding: "10px 5px",
							margin: "10px 0px",
							flexDirection: "row",
							justifyContent: "space-between",
						},
					]}
				>
					<Text>
						(A) {instrumento.nombre.toUpperCase()} -{" "}
						{instrumento.marca.toUpperCase()} -{" "}
						{instrumento.modelo.toUpperCase()}
					</Text>
					<Text>
						Fecha de Calibración:{" "}
						{instrumento.fechaCalibracion.toLocaleDateString("it-IT")}
					</Text>
				</View>

				<View
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-around",
						alignItems: "center",
						marginTop: "5px",
						marginBottom: "5px",
						maxHeight: "700px",
					}}
				>
					<View
						style={{
							flex: 1,
							width: "100%",
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							gap: 3,
							paddingTop: 5,
							paddingBottom: 0,
						}}
					>
						{instrumento.imagenesCalibracion.map((img, index) => (
							<Image
								key={index}
								src={img}
								style={{
									flex: 1,
									height: "100%",
									objectFit: "contain",
								}}
							/>
						))}
					</View>

					<View
						style={{
							flex: 1,
							width: "100%",
							maxHeight: "200px",
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							gap: 3,
							paddingTop: 15,
							paddingBottom: 0,
						}}
					>
						{instrumento.imagenes.map((img, index) => (
							<Image
								key={index}
								src={img}
								style={{
									flex: 1,
									height: "100%",
									objectFit: "contain",
								}}
							/>
						))}
					</View>
				</View>
			</View>

			<MembreteInferior tecnico={tecnico} />
		</Page>
	)
}

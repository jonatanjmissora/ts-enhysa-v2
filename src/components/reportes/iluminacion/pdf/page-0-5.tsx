import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
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

export default function Page05({
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
					<Text>{tecnico.nombre.toUpperCase()}</Text>
					<Text style={{ fontSize: 12, fontWeight: 900, paddingTop: "10px" }}>
						MATRICULA {tecnico.matricula}
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
					<Text
						style={{
							fontSize: 10,
							padding: "10px 15px",
							marginLeft: "auto",
							fontWeight: "900",
							borderBottom: "1px solid black",
						}}
					>
						CONTACTO: {tecnico.telefono}
					</Text>
					<Text
						style={{
							fontSize: 10,
							padding: "10px 15px",
							marginLeft: "auto",
							fontWeight: "900",
							borderBottom: "1px solid black",
						}}
					>
						CARGO: {tecnico.cargo.toUpperCase()}
					</Text>
					<Text
						style={{
							fontSize: 10,
							padding: "10px 15px",
							marginLeft: "auto",
							borderBottom: "1px solid black",
						}}
					>
						LOCALIDAD: {tecnico.localidad.toUpperCase()}
					</Text>
				</View>

				<View
					style={{
						flex: 1,
						width: "100%",
						maxHeight: "300px",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						gap: 10,
						paddingTop: 15,
						paddingBottom: 0,
					}}
				>
					<Image
						src={tecnico.matriculaImg}
						style={{
							flex: 1,
							height: "95%",
							objectFit: "contain",
						}}
					/>
				</View>
			</View>

			<MembreteInferior tecnico={tecnico} />
		</Page>
	)
}

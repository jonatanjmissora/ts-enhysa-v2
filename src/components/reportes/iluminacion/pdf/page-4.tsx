import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import MembreteSuperior from "./membrete-superior"
import MembreteInferior from "./membrete-inferior"
import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"
import type { EmpresaType } from "../../../../../db/empresas/schema"

function getCeldasWidth(ancho: number) {
	if (ancho === 3) return 50
	const baseSize = 475
	const celdaWidth = baseSize / (ancho + 1) - 1
	return celdaWidth
}

function getCeldasHeight(largo: number) {
	const baseSize = 475
	const celdaHeight = baseSize / (largo + 1) - 1
	return celdaHeight
}

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

export default function Page4({
	areas,
	tecnico,
	empresa,
}: {
	areas: AreaIluminacionType[]
	tecnico: TecnicoType
	empresa: EmpresaType
}) {
	const celdaWidth: number = 475 / (areas[0].ancho + 1) - 1
	const celdaHeight: number = 475 / (areas[0].largo + 1) - 1

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
				Anexo 4
			</Text>
			<View style={[styles.pagePadding, { flex: 1, border: "none" }]}>
				<Text style={styles.title}>PLANOS</Text>
				<Text style={[styles.row, { padding: "10px 5px", margin: "10px 0px" }]}>
					(A) {areas[0].nombre.toUpperCase()} - {areas[0].tipo.toUpperCase()}
				</Text>

				<View
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
					}}
				>
					<View
						style={{
							position: "relative",
							width: `475px`,
							height: `475px`,
							border: "1px solid cyan",
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
						}}
					>
						{areas[0].puntos.map((punto, index) => (
							<View
								key={index}
								style={{
									width: `${celdaWidth}px`,
									height: `${celdaHeight}px`,
									border: "0.5px solid gray",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Text style={{ fontSize: 7 }}>{punto}</Text>
							</View>
						))}
						{/* {Array.from({ length: areas[0].ancho + 1 }).map((_, index) => (
							<View
								key={index}
								style={{ display: "flex", flexDirection: "row" }}
							>
								{Array.from({ length: areas[0].largo + 1 }).map((_, index2) => (
									<View
										key={index2}
										style={{
											width: `50px`,
											height: `50px`,
											border: "0.5px solid gray",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Text style={{ fontSize: 7 }}>
											{areas[0].puntos[index + index2]}
										</Text>
									</View>
								))}
							</View>
						))} */}

						{/* {areas[0].puntos.map(punto => (
							<View
								key={punto.nombre}
								style={{
									position: "absolute",
									top: `${punto.valorY - 10}`,
									left: `${punto.valorX - 12}`,
									padding: "2px 4px",
									backgroundColor: "#ddd",
									borderRadius: "5px",
								}}
							>
								<Text style={{ fontSize: 12, fontWeight: "bold" }}>
									{punto.valor}
								</Text>
							</View>
						))} */}

						<Cotas ancho={areas[0].ancho} largo={areas[0].largo} />
					</View>

					<View
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							gap: 2,
							paddingTop: "30px",
						}}
					>
						{areas[0].imagenes.map((img, index) => (
							<Image
								key={index}
								src={img}
								style={{ width: "24%", height: "auto", objectFit: "contain" }}
							/>
						))}
					</View>
				</View>
			</View>
			<MembreteInferior tecnico={tecnico} />
		</Page>
	)
}

function Cotas({ ancho, largo }: { ancho: number; largo: number }) {
	return (
		<>
			<View
				style={{
					position: "absolute",
					bottom: "-14px",
					left: 0,
					right: 0,
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Text style={{ fontSize: 7, color: "gray", textAlign: "center" }}>
					Ancho {ancho}m
				</Text>
			</View>
			<View
				style={{
					position: "absolute",
					bottom: 0,
					right: 0,
					width: "100%",
				}}
			>
				<Text
					style={{
						fontSize: 7,
						color: "gray",
						textAlign: "center",
						transform: "rotate(90deg)",
						transformOrigin: "bottom right",
						padding: 0,
						width: "100%",
					}}
				>
					Largo {largo}m
				</Text>
			</View>
		</>
	)
}

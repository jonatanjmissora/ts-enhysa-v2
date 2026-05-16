import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import MembreteSuperior from "./membrete-superior"
import MembreteInferior from "./membrete-inferior"
import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"
import type { EmpresaType } from "../../../../../db/empresas/schema"

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
	const puntos = [1, 2, 3, 4, 5, 6, 0, 8, 0, 10, 11, 12, 13, 14, 15, 16]
	const ancho = area.ancho
	const largo = area.largo
	const div = Math.sqrt(puntos.length)
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
				Anexo 4
			</Text>
			<View
				style={[
					styles.pagePadding,
					{
						flex: 1,
						border: "none",
					},
				]}
			>
				<Text style={styles.title}>PLANOS</Text>
				<Text style={[styles.row, { padding: "10px 5px", margin: "10px 0px" }]}>
					(A) {area.nombre.toUpperCase()} - {area.tipo.toUpperCase()}
				</Text>

				<View
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<View
						style={{
							position: "relative",
							marginTop: "10px",
							width: `${div * cellW}px`,
							height: `${div * cellH}px`,
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
						}}
					>
						{area.puntos.map((punto, index) => (
							<View
								key={index}
								style={{
									width: `${cellW - 1}px`,
									height: `${cellH - 1}px`,
									border: "0.5px solid gray",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{punto !== 0 && (
									<>
										<Text style={{ fontSize: 4, opacity: 0.5 }}>
											({index + 1})
										</Text>
										<Text style={{ fontSize: 7 }}>{punto}</Text>
									</>
								)}
							</View>
						))}

						<Cotas ancho={ancho} largo={largo} cellH={cellH * div} />
					</View>

					<View
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							flexWrap: "wrap",
							gap: 2,
							paddingTop: "15px",
						}}
					>
						{area.imagenes.map((img, index) => (
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

function Cotas({
	ancho,
	largo,
	cellH,
}: {
	ancho: number
	largo: number
	cellH: number
}) {
	return (
		<>
			<View
				style={{
					position: "absolute",
					top: "-14px",
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
					left: -4,
					width: "100%",
				}}
			>
				<Text
					style={{
						fontSize: 7,
						color: "gray",
						textAlign: "center",
						transform: "rotate(-90deg)",
						transformOrigin: "bottom left",
						padding: 0,
						width: `${cellH}px`,
					}}
				>
					Largo {largo}m
				</Text>
			</View>
		</>
	)
}

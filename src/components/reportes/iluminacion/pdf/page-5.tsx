import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import MembreteSuperior from "./membrete-superior"
import MembreteInferior from "./membrete-inferior"
import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"
import type { EmpresaType } from "../../../../../db/empresas/schema"
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

export default function Page5({
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
	const MAX_WIDTH = 470
	const MAX_HEIGHT = area.imagenes?.length > 0 ? 375 : 500
	let cellW = 75
	let cellH = (cellW * largo) / ancho

	if (cellW * div > MAX_WIDTH) {
		cellW = MAX_WIDTH / div
		cellH = (cellW * largo) / ancho
		if (cellH * div > MAX_HEIGHT) {
			cellH = MAX_HEIGHT / div
			cellW = (cellH * ancho) / largo
		}
	}
	if (cellH * div > MAX_HEIGHT) {
		cellH = MAX_HEIGHT / div
		cellW = (cellH * ancho) / largo
	}

	return (
		<Page size="A4" style={styles.page}>
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
				Anexo 5
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
				<View
					style={[
						styles.flexrow,
						{
							padding: "10px 5px",
							margin: "10px 0px",
							justifyContent: "space-between",
							alignItems: "flex-end",
						},
					]}
				>
					<Text style={{ fontSize: 11 }}>
						(A) {area.nombre.toUpperCase()} - {area.tipo.toUpperCase()}
					</Text>
					<Text style={{ fontSize: 8, opacity: 0.75 }}>
						Medidas: {area.largo.toFixed(0)} mts x {area.ancho.toFixed(0)} mts
					</Text>
					<Text style={{ fontSize: 8, opacity: 0.75 }}>
						Divisiones: {div ** 2} ({(area.ancho / div).toFixed(1)}m x{" "}
						{(area.largo / div).toFixed(1)}m)
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-around",
						alignItems: "center",
						marginTop: "15px",
						marginBottom: "5px",
						maxHeight: "700px",
					}}
				>
					<View
						style={{
							position: "relative",
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
							height: `${cellH * div}px`,
							width: `${cellW * div}px`,
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

					{area.imagenes.length > 0 && (
						<View
							style={{
								flex: 1,
								width: "470px",
								maxHeight: "180px",
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								gap: 10,
								paddingTop: 15,
								paddingBottom: 0,
							}}
						>
							{area.imagenes.map((img, index) => (
								<Image
									key={index}
									src={img}
									style={{
										flex: 1,
										height: "95%",
										objectFit: "contain",
									}}
								/>
							))}
						</View>
					)}
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

export const getIndiceDeLocal = (
	cantidadFilas: number,
	cantidadColumnas: number,
	cantidadAltura: number
) => {
	return (
		(cantidadFilas * cantidadColumnas) /
		(cantidadAltura * (cantidadFilas + cantidadColumnas))
	)
}

export const getIndiceRedondeo = (indiceDeLocal: number) =>
	Math.abs(indiceDeLocal % 1) > 0
		? Math.trunc(indiceDeLocal) + 1
		: Math.trunc(indiceDeLocal)

export const getNumeroCeldas = (
	cantidadFilas: number,
	cantidadColumnas: number,
	cantidadAltura: number
) => {
	const indiceRedondeo = getIndiceRedondeo(
		getIndiceDeLocal(cantidadFilas, cantidadColumnas, cantidadAltura)
	)
	const indice = (indiceRedondeo + 2) ** 2
	return indice
}

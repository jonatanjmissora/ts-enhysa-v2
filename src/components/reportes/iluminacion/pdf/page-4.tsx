// import { Page, Text, View, StyleSheet } from "@react-pdf/renderer"
// import MembreteSuperior from "./membrete-superior"
// import MembreteInferior from "./membrete-inferior"
// import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"

// // Create styles
// const styles = StyleSheet.create({
// 	page: {
// 		flexDirection: "column",
// 		backgroundColor: "#fff",
// 		fontFamily: "Roboto",
// 		padding: "0px 60px",
// 	},
// 	pagePadding: {
// 		border: "1px solid black",
// 	},
// 	title: {
// 		fontSize: 10,
// 		fontWeight: 700,
// 		textAlign: "center",
// 		padding: "7px 0px",
// 		color: "white",
// 		backgroundColor: "black",
// 		letterSpacing: "1px",
// 	},
// 	subtitle: {
// 		fontSize: 10,
// 		fontWeight: 500,
// 		textAlign: "center",
// 		padding: "5px 0px",
// 		color: "black",
// 		backgroundColor: "gray",
// 		letterSpacing: "1px",
// 		borderBottom: "1px solid black",
// 	},
// 	row: {
// 		fontSize: 9,
// 		borderBottom: "1px solid black",
// 		padding: "5px 10px",
// 	},
// 	flexrow: {
// 		width: "100%",
// 		display: "flex",
// 		flexDirection: "row",
// 		borderBottom: "1px solid black",
// 	},
// 	flexrowelement: {
// 		flex: 1,
// 		display: "flex",
// 		flexDirection: "column",
// 		justifyContent: "center",
// 		alignItems: "center",
// 		fontSize: 9,
// 		height: 100,
// 	},
// })

// export default function Page4({
// 	sector,
// 	croquis,
// 	puntos,
// 	tecnico,
// }: {
// 	sector: AreaIluminacionType
// 	croquis: CroquisType
// 	puntos: PuntoType[]
// 	tecnico: TecnicoType
// }) {
// 	return (
// 		<Page size="A4" style={styles.page}>
// 			<MembreteSuperior />
// 			<Text
// 				style={{
// 					width: "100%",
// 					textAlign: "center",
// 					fontSize: 12,
// 					margin: 10,
// 					fontWeight: "900",
// 				}}
// 			>
// 				Anexo 4
// 			</Text>
// 			<View style={[styles.pagePadding, { flex: 1, border: "none" }]}>
// 				<Text style={styles.title}>PLANOS</Text>
// 				<Text style={[styles.row, { padding: "10px 5px", margin: "10px 0px" }]}>
// 					(A) {sector.nombre.toUpperCase()} - {sector.tipo.toUpperCase()}
// 				</Text>

// 				<View
// 					style={{
// 						display: "flex",
// 						flexDirection: "row",
// 					}}
// 				>
// 					<View
// 						style={{
// 							position: "relative",
// 							border: "1px solid black",
// 						}}
// 					>
// 						{Array.from({ length: croquis.largo }).map((_, index) => (
// 							<View
// 								key={index}
// 								style={{ display: "flex", flexDirection: "row" }}
// 							>
// 								{Array.from({ length: croquis.ancho }).map((_, index) => (
// 									<View
// 										key={index}
// 										style={{
// 											width: `${CELDASIZE}`,
// 											height: `${CELDASIZE}`,
// 											border: "0.5px solid gray",
// 										}}
// 									></View>
// 								))}
// 							</View>
// 						))}

// 						{puntos.map(punto => (
// 							<View
// 								key={punto.nombre}
// 								style={{
// 									position: "absolute",
// 									top: `${punto.valorY - 10}`,
// 									left: `${punto.valorX - 12}`,
// 									padding: "2px 4px",
// 									backgroundColor: "#ddd",
// 									borderRadius: "5px",
// 								}}
// 							>
// 								<Text style={{ fontSize: 12, fontWeight: "bold" }}>
// 									{punto.valor}
// 								</Text>
// 							</View>
// 						))}

// 						<Cotas ancho={croquis.ancho} largo={croquis.largo} />
// 					</View>
// 					<View style={{ flex: 1 }}></View>
// 				</View>
// 			</View>
// 			<MembreteInferior tecnico={tecnico} />
// 		</Page>
// 	)
// }

// function Cotas({ ancho, largo }: { ancho: number; largo: number }) {
// 	return (
// 		<>
// 			<View
// 				style={{
// 					position: "absolute",
// 					bottom: "-18px",
// 					left: 0,
// 					right: 0,
// 					borderTop: "1px solid gray",
// 					display: "flex",
// 					justifyContent: "center",
// 				}}
// 			>
// 				<Text style={{ fontSize: 7, color: "gray", textAlign: "center" }}>
// 					Ancho {ancho}m
// 				</Text>
// 			</View>
// 			<View
// 				style={{
// 					position: "absolute",
// 					top: 0,
// 					bottom: 0,
// 					right: "-40px",
// 					borderLeft: "1px solid gray",
// 					display: "flex",
// 					flexDirection: "column",
// 					justifyContent: "center",
// 					alignItems: "center",
// 				}}
// 			>
// 				<Text
// 					style={{
// 						fontSize: 7,
// 						color: "gray",
// 						textAlign: "center",
// 						transform: "rotate(90deg)",
// 						transformOrigin: "center",
// 						padding: 0,
// 					}}
// 				>
// 					Largo {largo}m
// 				</Text>
// 			</View>
// 		</>
// 	)
// }

import { View, Text, Image } from "@react-pdf/renderer"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"

export default function MembreteInferior({
	tecnico,
}: {
	tecnico: TecnicoType
}) {
	return (
		<View style={{ display: "flex", flexDirection: "column" }}>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					borderBottom: "1px solid black",
					padding: "2px 0px",
				}}
			>
				<View
					style={{
						flex: 1,
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "flex-start",
						paddingTop: 20,
					}}
				>
					<Text style={{ fontSize: 14, fontWeight: "bold" }}>
						Logo consultora
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						position: "relative",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						justifyContent: "space-between",
					}}
				>
					<Text style={{ fontSize: 10, textAlign: "right" }}>
						{tecnico.nombre.toUpperCase()}
					</Text>
					<Text style={{ fontSize: 10, textAlign: "right" }}>
						MAT {tecnico.matricula}
					</Text>
					<Image
						src={tecnico.firmaImg}
						style={{
							width: "auto",
							height: "40px",
							objectFit: "contain",
							position: "absolute",
							right: 0,
							bottom: 0,
						}}
					/>
				</View>
			</View>
			<View
				style={{
					fontSize: 10,
					width: "100%",
					display: "flex",
					flexDirection: "row",
					paddingBottom: 20,
				}}
			>
				<Text style={{ flex: 1, textAlign: "left" }}>Seguridad e Higiene</Text>
				<Text
					style={{ flex: 1, textAlign: "right" }}
					render={({ pageNumber, totalPages }) =>
						`Hoja ${pageNumber} de ${totalPages}`
					}
					fixed
				/>
			</View>
		</View>
	)
}

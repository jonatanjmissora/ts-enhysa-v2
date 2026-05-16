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
						padding: "10px 0",
					}}
				>
					<Text style={{ fontSize: 14, fontWeight: "bold" }}>
						Logo consultora
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-end",
					}}
				>
					<View
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-end",
							alignItems: "center",
						}}
					>
						<Text style={{ fontSize: 10, textAlign: "right" }}>
							{tecnico.nombre.toUpperCase()}
						</Text>
						<Text style={{ fontSize: 10, textAlign: "right" }}>
							MAT {tecnico.matricula}
						</Text>
					</View>
					<Image
						src={tecnico.firmaImg}
						style={{
							width: "auto",
							height: "50px",
							objectFit: "contain",
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

import { View, Text } from "@react-pdf/renderer"

const membreteSupDerecho = [
	"Seguridad e Higiene en el trabajo",
	"Informe técnico - Medición de iluminación",
]

export default function MembreteSuperior() {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				borderBottom: "1px solid black",
				padding: "20px 0px",
				justifyContent: "space-between",
			}}
		>
			<View
				style={{
					flex: 1,
					display: "flex",
					alignItems: "center",
				}}
			>
				<Text style={{ fontSize: 14, fontWeight: "bold", textAlign: "left" }}>
					LOGO
				</Text>
			</View>
			<View style={{ flex: 1 }}>
				{membreteSupDerecho.map((line, index) => (
					<Text key={index} style={{ fontSize: 11, textAlign: "right" }}>
						{line}
					</Text>
				))}
			</View>
		</View>
	)
}

import { View, Text, Image } from "@react-pdf/renderer"
import type { EmpresaType } from "../../../../../db/empresas/schema"

const membreteSupDerecho = [
	"Seguridad e Higiene en el trabajo",
	"Informe técnico - Medición de iluminación",
]

export default function MembreteSuperior({
	empresa,
}: {
	empresa: EmpresaType
}) {
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
					alignItems: "flex-start",
				}}
			>
				{(empresa.logo !== "" && (
					<Image
						src={empresa.logo}
						style={{
							width: "auto",
							height: "50px",
							objectFit: "contain",
						}}
					/>
				)) || (
					<Text
						style={{
							fontSize: 14,
							fontWeight: "bold",
							textAlign: "left",
						}}
					>
						{empresa.razonSocial.toUpperCase()}
					</Text>
				)}
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

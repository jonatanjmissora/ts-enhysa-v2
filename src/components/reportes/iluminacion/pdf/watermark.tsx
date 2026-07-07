import { Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
	watermarkContainer: {
		position: "absolute",
		top: "-40%",
		bottom: "-40%",
		left: "-40%",
		right: "-40%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
		gap: "10px",
		zIndex: -1, // Envía la marca de agua al fondo del contenido principal
		transform: "rotate(-45deg)", // Rotación diagonal típica de marcas de agua
		transformOrigin: "center",
		border: "1px solid blue",
		overflow: "hidden",
	},
	watermarkText: {
		fontSize: 40,
		color: "#eeeeee",
		// opacity: 0.1, // Nivel de transparencia
		width: "100%",
		overflow: "hidden",
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
		whiteSpace: "nowrap",
	},
})

export default function Watermark() {
	return (
		<View style={styles.watermarkContainer} fixed>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
			<Text style={styles.watermarkText}>
				EnHySa - EnHySa - EnHySa - EnHySa - EnHySa - EnHySa
			</Text>
		</View>
	)
}

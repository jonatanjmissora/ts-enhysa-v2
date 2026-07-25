import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer"

type Perfil = "licenciado" | "tecnico"

interface TareaRow {
	id: string
	cantidad: number
	servicioIndex: number
	importeCustom?: number
}

interface AdicionalRow {
	id: string
	cantidad: number
	nombre: string
	valorUnitario: number
}

interface HonorarioServicio {
	nombre: string
	importe: number
}

type HonorariosDb = Record<Perfil, HonorarioServicio[]>

const honorariosDb: HonorariosDb = {
	licenciado: [
		{ nombre: "Capacitación (Hasta 4 hs) - Estándar", importe: 120000 },
		{ nombre: "Capacitación Autoelevadores - Curso y Credencial", importe: 350000 },
		{ nombre: "Medición Puesta a Tierra - 1 Jabalina / 3 Disyuntores", importe: 220000 },
		{ nombre: "Medición Puesta a Tierra - Jabalina Adicional", importe: 44000 },
		{ nombre: "Medición Puesta a Tierra - Disyuntor Adicional", importe: 44000 },
		{ nombre: "Estudio de Ergonomía por Puesto (Res. 295/03) - Por puesto", importe: 94000 },
		{ nombre: "Ruido Ambiental - Hasta 30 minutos", importe: 118000 },
		{ nombre: "Dosimetría de Ruido - Hasta 2 hs", importe: 145000 },
		{ nombre: "Dosimetría de Ruido - Hasta 4 hs", importe: 210000 },
		{ nombre: "Dosimetría de Ruido - Hasta 8 hs", importe: 290000 },
		{ nombre: "Medición de Iluminación - Punto Individual", importe: 26000 },
		{ nombre: "Medición de Iluminación - Sector (9 a 16 puntos con protocolo)", importe: 94000 },
		{ nombre: "Medición de Iluminación - Sector (Más de 16 puntos con protocolo)", importe: 140000 },
		{ nombre: "Medición de Vibraciones - Miembros Superiores", importe: 160000 },
		{ nombre: "Medición de Vibraciones - Cuerpo Entero", importe: 200000 },
		{ nombre: "Estudio Carga de Fuego - 0 a 300 m²", importe: 315000 },
		{ nombre: "Estudio Carga de Fuego - 301 a 600 m²", importe: 410000 },
		{ nombre: "Estudio Carga de Fuego - 601 a 1000 m²", importe: 500000 },
		{ nombre: "Informe Antisiniestral - 0 a 300 m²", importe: 315000 },
		{ nombre: "Informe Antisiniestral - 301 a 600 m²", importe: 410000 },
		{ nombre: "Informe Antisiniestral - 601 a 1000 m²", importe: 500000 },
	],
	tecnico: [
		{ nombre: "Capacitación (Hasta 4 hs) - Estándar", importe: 118000 },
		{ nombre: "Capacitación Autoelevadores - Curso y Credencial", importe: 355000 },
		{ nombre: "Medición Puesta a Tierra - 1 Jabalina / 3 Disyuntores", importe: 220000 },
		{ nombre: "Medición Puesta a Tierra - Jabalina Adicional", importe: 44000 },
		{ nombre: "Medición Puesta a Tierra - Disyuntor Adicional", importe: 44000 },
		{ nombre: "Estudio de Ergonomía por Puesto (Res. 295/03) - Por puesto", importe: 94000 },
		{ nombre: "Ruido Ambiental - Hasta 30 minutos", importe: 118000 },
		{ nombre: "Dosimetría de Ruido - Hasta 2 hs", importe: 145000 },
		{ nombre: "Dosimetría de Ruido - Hasta 4 hs", importe: 210000 },
		{ nombre: "Dosimetría de Ruido - Hasta 8 hs", importe: 290000 },
		{ nombre: "Medición de Iluminación - Punto Individual", importe: 26000 },
		{ nombre: "Medición de Iluminación - Sector (9 a 16 puntos con protocolo)", importe: 94000 },
		{ nombre: "Medición de Iluminación - Sector (Más de 16 puntos con protocolo)", importe: 140000 },
		{ nombre: "Medición de Vibraciones - Miembros Superiores", importe: 160000 },
		{ nombre: "Medición de Vibraciones - Cuerpo Entero", importe: 200000 },
		{ nombre: "Estudio Carga de Fuego - 0 a 300 m²", importe: 315000 },
		{ nombre: "Estudio Carga de Fuego - 301 a 600 m²", importe: 410000 },
		{ nombre: "Estudio Carga de Fuego - 601 a 1000 m²", importe: 500000 },
		{ nombre: "Informe Antisiniestral - 0 a 300 m²", importe: 315000 },
		{ nombre: "Informe Antisiniestral - 301 a 600 m²", importe: 410000 },
		{ nombre: "Informe Antisiniestral - 601 a 1000 m²", importe: 500000 },
	],
}

function formatPrice(n: number) {
	return new Intl.NumberFormat("es-AR", {
		style: "currency",
		currency: "ARS",
		minimumFractionDigits: 2,
	}).format(n)
}

function getImporte(perfil: Perfil, tarea: TareaRow): number {
	if (tarea.importeCustom !== undefined) return tarea.importeCustom
	const servicio = honorariosDb[perfil]?.[tarea.servicioIndex]
	return servicio?.importe ?? 0
}

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#fff",
		fontFamily: "Helvetica",
		padding: 40,
		fontSize: 9,
	},
	header: {
		flexDirection: "column",
		alignItems: "center",
		textAlign: "center",
		borderBottomWidth: 2,
		borderBottomColor: "#1b5e20",
		paddingBottom: 12,
		marginBottom: 16,
	},
	logoWrapper: {
		width: 199,
		height: 112,
		borderRadius: 8,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	logoImage: {
		width: "100%",
		height: "100%",
		objectFit: "contain",
	},
	companyName: {
		fontSize: 18,
		fontWeight: "bold",
		textTransform: "uppercase",
		letterSpacing: 1,
		color: "#111",
	},
	subtitle: {
		fontSize: 10,
		fontWeight: "bold",
		color: "#1b5e20",
		letterSpacing: 2,
		marginTop: 2,
	},
	sectionTitle: {
		fontSize: 11,
		fontWeight: "bold",
		color: "#1b5e20",
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		paddingBottom: 4,
		marginTop: 14,
		marginBottom: 8,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	infoRow: {
		flexDirection: "row",
		marginBottom: 4,
	},
	infoLabel: {
		fontWeight: "bold",
		width: 130,
		fontSize: 9,
	},
	infoValue: {
		flex: 1,
		fontSize: 9,
	},
	tableHeader: {
		flexDirection: "row",
		borderBottomWidth: 2,
		borderBottomColor: "#1b5e20",
		paddingVertical: 4,
		marginTop: 4,
	},
	tableHeaderText: {
		fontSize: 8,
		fontWeight: "bold",
		color: "#1b5e20",
		textTransform: "uppercase",
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
		paddingVertical: 4,
		alignItems: "center",
	},
	tableCell: {
		fontSize: 8,
	},
	condiciones: {
		backgroundColor: "#f9f9f9",
		borderLeftWidth: 3,
		borderLeftColor: "#1b5e20",
		padding: 10,
		marginTop: 14,
		fontSize: 8,
		lineHeight: 1.5,
		color: "#333",
	},
	totalPanel: {
		backgroundColor: "#f5f5f5",
		borderWidth: 1,
		borderColor: "#1b5e20",
		padding: 14,
		marginTop: 12,
		alignItems: "flex-end",
	},
	totalLabel: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#111",
	},
	totalAmount: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#1b5e20",
		marginTop: 4,
	},
})

export function PresupuestoPDF({
	perfil,
	actividad,
	logo,
	cliente,
	tareas,
	adicionales,
	nombreEmpresa = "EnHySa Consultora",
	condiciones,
}: {
	perfil: Perfil
	actividad: number
	logo: string | null
	cliente: { nombre: string; cuit: string; direccion: string; fecha: string }
	tareas: TareaRow[]
	adicionales: AdicionalRow[]
	nombreEmpresa?: string
	condiciones?: {
		facturacion: string
		formaPago: string
		responsable: string
		contacto: string
	}
}) {
	const perfilLabel = perfil === "licenciado" ? "Licenciado en Higiene y Seguridad" : "Técnico en Higiene y Seguridad"
	const actividadLabel = actividad === 0 ? "Estándar (Sin Adicional)" : "Química, Energía, Minería, Gas o Petróleo (+30%)"

	const total = (() => {
		let sum = 0
		for (const t of tareas) {
			const base = getImporte(perfil, t)
			sum += base * (1 + actividad) * t.cantidad
		}
		for (const a of adicionales) {
			sum += a.valorUnitario * a.cantidad
		}
		return sum
	})()

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<View style={styles.logoWrapper}>
						{logo ? (
							<Image src={logo} style={styles.logoImage} />
						) : null}
					</View>
					<Text style={styles.companyName}>{nombreEmpresa}</Text>
					<Text style={styles.subtitle}>COTIZADOR PROFESIONAL HSE</Text>
				</View>

				<Text style={styles.sectionTitle}>Información del Cliente</Text>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Razón Social:</Text>
					<Text style={styles.infoValue}>{cliente.nombre || "-"}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>CUIT:</Text>
					<Text style={styles.infoValue}>{cliente.cuit || "-"}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Dirección / Planta:</Text>
					<Text style={styles.infoValue}>{cliente.direccion || "-"}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Fecha de Emisión:</Text>
					<Text style={styles.infoValue}>{cliente.fecha || "-"}</Text>
				</View>

				<Text style={styles.sectionTitle}>1. Definición de Perfil Profesional</Text>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Categoría Profesional:</Text>
					<Text style={styles.infoValue}>{perfilLabel}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Adicional por Actividad:</Text>
					<Text style={styles.infoValue}>{actividadLabel}</Text>
				</View>

				{tareas.length > 0 && (
					<>
						<Text style={styles.sectionTitle}>2. Tareas y Protocolos Requeridos</Text>
						<View style={styles.tableHeader}>
							<Text style={[styles.tableHeaderText, { width: "10%" }]}>Cant.</Text>
							<Text style={[styles.tableHeaderText, { width: "50%" }]}>Servicio</Text>
							<Text style={[styles.tableHeaderText, { width: "15%", textAlign: "right" }]}>Importe</Text>
							<Text style={[styles.tableHeaderText, { width: "15%", textAlign: "right" }]}>Subtotal</Text>
						</View>
						{tareas.map(t => {
							const importe = getImporte(perfil, t)
							const subtotal = importe * (1 + actividad) * t.cantidad
							return (
								<View key={t.id} style={styles.tableRow}>
									<Text style={[styles.tableCell, { width: "10%" }]}>{t.cantidad}</Text>
									<Text style={[styles.tableCell, { width: "50%" }]}>{t.servicioIndex >= 0 ? honorariosDb[perfil][t.servicioIndex]?.nombre ?? "-" : "-"}</Text>
									<Text style={[styles.tableCell, { width: "15%", textAlign: "right" }]}>
										{importe > 0 ? formatPrice(importe) : "-"}
									</Text>
									<Text style={[styles.tableCell, { width: "15%", textAlign: "right", fontWeight: "bold" }]}>
										{subtotal > 0 ? formatPrice(subtotal) : "-"}
									</Text>
								</View>
							)
						})}
					</>
				)}

				{adicionales.length > 0 && (
					<>
						<Text style={styles.sectionTitle}>3. Adicionales, Gastos y Logística</Text>
						<View style={styles.tableHeader}>
							<Text style={[styles.tableHeaderText, { width: "10%" }]}>Cant.</Text>
							<Text style={[styles.tableHeaderText, { width: "45%" }]}>Concepto</Text>
							<Text style={[styles.tableHeaderText, { width: "25%", textAlign: "right" }]}>Valor Unit.</Text>
							<Text style={[styles.tableHeaderText, { width: "20%", textAlign: "right" }]}>Subtotal</Text>
						</View>
						{adicionales.map(a => {
							const subtotal = a.valorUnitario * a.cantidad
							return (
								<View key={a.id} style={styles.tableRow}>
									<Text style={[styles.tableCell, { width: "10%" }]}>{a.cantidad}</Text>
									<Text style={[styles.tableCell, { width: "45%" }]}>{a.nombre || "-"}</Text>
									<Text style={[styles.tableCell, { width: "25%", textAlign: "right" }]}>
										{a.valorUnitario > 0 ? formatPrice(a.valorUnitario) : "-"}
									</Text>
									<Text style={[styles.tableCell, { width: "20%", textAlign: "right", fontWeight: "bold" }]}>
										{subtotal > 0 ? formatPrice(subtotal) : "-"}
									</Text>
								</View>
							)
						})}
					</>
				)}

				<View style={styles.condiciones}>
					<Text style={{ fontWeight: "bold", color: "#111", marginBottom: 4, fontSize: 9 }}>
						Condiciones del Servicio y Datos Comerciales:
					</Text>
					<Text>• Facturación: {condiciones?.facturacion ?? "Factura Tipo C."}</Text>
					<Text>• Forma de Pago: {condiciones?.formaPago ?? "Efectivo"}</Text>
					<Text>• Equipamiento: Todo instrumental de medición utilizado se encuentra calibrado con certificación oficial vigente.</Text>
					<Text>• Responsable Técnico: {condiciones?.responsable ?? "Tecnico en Seguridad e Higiene."}</Text>
					<Text>• Matrícula Profesional: Habilitado bajo regulaciones de Ley e Higiene correspondientes.</Text>
					<Text>• Contacto: {condiciones?.contacto ?? "EnHySa Consultora."}</Text>
				</View>

				<View style={styles.totalPanel}>
					<Text style={styles.totalLabel}>Presupuesto Estimado Neto</Text>
					<Text style={styles.totalAmount}>{formatPrice(total)}</Text>
				</View>
			</Page>
		</Document>
	)
}

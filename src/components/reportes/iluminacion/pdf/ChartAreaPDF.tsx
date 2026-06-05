import { Svg, Path, Rect, Text, View, Circle } from "@react-pdf/renderer"
import React from "react"

export function ChartAreaPDF({
	puntos,
	requerido,
}: {
	puntos: number[]
	requerido: string
}) {
	const puntosWithValue = puntos?.filter(punto => punto > 0)
	if (!puntosWithValue || puntosWithValue.length === 0)
		return <Text>No hay datos</Text>

	const data = [...puntosWithValue]

	const maxY = Math.max(...data) // 400 in the example
	const maxX = data.length - 1 // last index (8)

	// Normalization factors (0‑100 range for both axes) with padding for labels
	const paddingX = 8 // space on left for Y‑axis values
	const paddingY = 8 // space at bottom for X‑axis labels
	const chartWidth = 95 - paddingX
	const chartHeight = 95 - paddingY
	const xFactor = maxX === 0 ? 0 : chartWidth / maxX
	const yFactor = maxY === 0 ? 0 : chartHeight / maxY
	// Determine step size (50 or 100) based on the maximum Y value
	const step = maxY <= 200 ? 50 : 100
	const maxTick = Math.ceil(maxY / step) * step
	const yTicks = [] as number[]
	for (let v = 0; v <= maxTick; v += step) {
		yTicks.push(v)
	}

	// Build SVG path points – X and Y are scaled to chart area with padding
	const points = data
		.map(
			(value, i) =>
				`${i * xFactor + paddingX},${paddingY + chartHeight - value * yFactor}`
		)
		.join(" L")

	// Path that draws the area (baseline at the bottom = y = 100)
	const pathData = `M${paddingX},${paddingY + chartHeight} L${points} L${paddingX + chartWidth},${paddingY + chartHeight} Z`

	//obtenemos el rango de requerido
	const requeridoValue = requerido.split(" ")
	const min = parseInt(requeridoValue[0], 10)
	const hayMax = requeridoValue.length > 1
	const max = hayMax ? parseInt(requeridoValue[2], 10) : min + 1

	const puntoMin = Math.min(...data)
	const puntoMax = Math.max(...data)
	const valorPromedio = data.reduce((a, b) => a + b, 0) / data.length
	const uniformidadGeneral = puntoMin / valorPromedio
	const uniformidadCyD = puntoMin / puntoMax

	return (
		<View
			style={{
				flex: 1,
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				gap: 10,
			}}
		>
			{/* viewBox is a square 0‑100 × 0‑100. Width/height are set by the parent container */}
			<Svg viewBox="0 0 100 100" width="400" height="auto">
				{/* AREA */}
				<Path d={pathData} fill="#b7b7ff" stroke="#000" strokeWidth={0.1} />

				{/* EJE VERTICAL */}
				<Path
					d={`M${paddingX},${paddingY + chartHeight} L${paddingX},${paddingY - 10}`}
					stroke="#444"
					strokeWidth="0.25"
				/>
				{/* EJE VERTICAL */}
				<Path
					d={`M${paddingX},${paddingY + chartHeight} L${paddingX + chartWidth},${paddingY + chartHeight}`}
					stroke="#444"
					strokeWidth="0.25"
				/>

				{/* EJE HORIZONTAL VALORES */}
				{data.map((_, idx) => (
					<Text
						key={idx}
						x={paddingX + idx * xFactor}
						y={paddingY + chartHeight + 4}
						style={{ fontSize: 1.5 }}
						fill="#444"
						textAnchor="middle"
					>
						{idx + 1}
					</Text>
				))}

				{/* EJE VERTICAL VALORES */}
				{yTicks.map((val, idx) => (
					<Text
						key={idx}
						x={paddingX - 2}
						y={paddingY + chartHeight - val * yFactor}
						style={{ fontSize: 1.5 }}
						fill="#444"
						textAnchor="end"
					>
						{val}
					</Text>
				))}

				{/* REQUERIDO*/}
				{hayMax ? (
					<Rect
						x={paddingX}
						y={paddingY + chartHeight - max * yFactor}
						width={chartWidth}
						height={(max - min) * yFactor}
						fill="#ffbb63"
						opacity={0.5}
						stroke="#000"
						strokeWidth={0.1}
					/>
				) : (
					<Rect
						x={paddingX}
						y={paddingY + chartHeight - min * yFactor - 0.5}
						width={chartWidth}
						height={0.5}
						fill="#ee9016"
					/>
				)}

				{/* PUNTOS */}
				{data.map((val, idx) => (
					<React.Fragment key={idx}>
						{/* Value label */}
						<Text
							key={`val-${idx}`}
							x={paddingX + idx * xFactor}
							y={paddingY + chartHeight - val * yFactor - 2}
							style={{ fontSize: 2, color: "#000" }}
							fill="#000"
							textAnchor="middle"
						>
							{val}
						</Text>
						{/* Small blue circle at the point */}
						<Circle
							cx={paddingX + idx * xFactor}
							cy={paddingY + chartHeight - val * yFactor}
							r={0.4} // radius – small enough to look like a dot
							fill="#00f" // blue fill
							stroke="none"
						/>
					</React.Fragment>
				))}
			</Svg>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					gap: 8,
				}}
			>
				<Text style={{ fontSize: 7 }}>Eje vertical: mediciones (lx)</Text>
				<Text style={{ fontSize: 7 }}>Eje horizontal: cantidad de puntos</Text>
				<View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
					<View
						style={{
							backgroundColor: hayMax ? "#ffbb63" : "#ee9016",
							width: 10,
							height: 10,
							borderRadius: 100,
							border: "0.5px solid #888",
						}}
					></View>
					<Text style={{ fontSize: 7 }}>
						{hayMax
							? `Requerido: (${min} - ${max}) lx`
							: `Requerido: ${min} lx`}
					</Text>
				</View>
			</View>

			<View
				style={{
					display: "flex",
					flexDirection: "column",
					width: "350px",
					marginLeft: "14px",
					gap: 2,
				}}
			>
				<View
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						gap: 2,
					}}
				>
					<Text
						style={{
							fontSize: 7,
							textDecoration: "underline",
						}}
					>
						UNIFORMIDAD GENERAL
					</Text>
					<Text style={{ fontSize: 7, color: "#222", marginLeft: "auto" }}>
						(Todas las áreas, principalmente en interiores)
					</Text>
				</View>
				<View
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						gap: 2,
					}}
				>
					<Text style={{ fontSize: 7, color: "#583a00" }}>
						U0 = {uniformidadGeneral.toFixed(2)}
					</Text>
					<Text style={{ fontSize: 7, color: "#222", marginLeft: "auto" }}>
						(Valor Min/Valor Promedio)
					</Text>
				</View>
				<Text style={{ fontSize: 7 }}>
					{`${conclusionTecnica(uniformidadGeneral)} `}
				</Text>
			</View>

			<View
				style={{
					display: "flex",
					flexDirection: "column",
					width: "350px",
					marginLeft: "14px",
					gap: 2,
				}}
			>
				<View
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						gap: 2,
					}}
				>
					<Text
						style={{
							fontSize: 7,
							textDecoration: "underline",
						}}
					>
						UNIFORMIDAD de CONTRASTE y DESLUMBRAMIENTO
					</Text>
					<Text style={{ fontSize: 7, color: "#222", marginLeft: "auto" }}>
						(Áreas Grandes y al aire Libre)
					</Text>
				</View>
				<View
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						gap: 2,
					}}
				>
					<Text style={{ fontSize: 7, color: "#583a00" }}>
						U1 = {uniformidadCyD.toFixed(2)}
					</Text>
					<Text style={{ fontSize: 7, color: "#222", marginLeft: "auto" }}>
						(Valor Min/Valor Máximo)
					</Text>
				</View>
				<Text style={{ fontSize: 7 }}>
					{`${conclusionTecnica(uniformidadGeneral)} `}
				</Text>
			</View>
		</View>
	)
}

function conclusionTecnica(uniformidad: number) {
	let conclusionTecnica = ""
	if (uniformidad >= 0.65)
		conclusionTecnica =
			"CUMPLIMIENTO OPTIMIZADO. Iluminación homogénea y equilibrada en el plano de trabajo. No requiere acciones correctivas."
	else if (uniformidad >= 0.4 && uniformidad < 0.65)
		conclusionTecnica =
			"OPORTUNIDAD DE MEJORA. Se observa una dispersión lumínica moderada con baches de luz puntuales. Tomar acciones para homogeneizar el sector."
	else if (uniformidad < 0.4)
		conclusionTecnica =
			"MEJORAS NECESARIAS E INMEDIATAS. Distribución lumínica severamente deficiente con zonas de sombra críticas. Exige intervención correctiva inmediata."

	return conclusionTecnica
}

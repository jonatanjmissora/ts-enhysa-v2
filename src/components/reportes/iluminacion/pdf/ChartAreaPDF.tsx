import {
	Svg,
	Path,
	Defs,
	LinearGradient,
	Stop,
	Rect,
	Text,
} from "@react-pdf/renderer"

// Simple area chart for PDF rendering using react-pdf primitives
export function ChartAreaPDF({
	puntos,
	requerido,
}: {
	puntos: number[]
	requerido?: number
}) {
	if (!puntos || puntos.length === 0) return null

	const puntosWithValue = puntos?.filter(punto => punto > 0)
	if (!puntosWithValue || puntosWithValue.length === 0)
		return <span>No hay datos</span>
	const uniformidad = Math.ceil(
		puntosWithValue?.reduce((acc, valor) => acc + valor, 0) /
			puntosWithValue?.length /
			2
	)

	const max = Math.max(...puntosWithValue)
	const min = Math.min(...puntosWithValue)
	const range = max - min || 1
	// Helper to convert a value to y coordinate in viewBox
	const yFromValue = (val: number) => 50 - ((val - min) / range) * 50
	// Compute y positions for required and uniformidad
	const yRequerido = requerido !== undefined ? yFromValue(requerido) : null
	const yUniformidad = yFromValue(uniformidad)
	// Normalize points to viewBox (0,0)-(100,50)
	const points = puntosWithValue.map((p, i) => {
		const x = (i / (puntosWithValue.length - 1)) * 100
		const y = 50 - ((p - min) / range) * 50
		return `${x},${y}`
	})

	const pathData = `M0,50 L${points.join(" L")} L100,50 Z`
	const ejeHorizontalDiv = 100 / (puntosWithValue.length - 1)

	return (
		<Svg viewBox="0 0 110 50" width="100%" height="100%">
			<Defs>
				<LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" stopColor="#00f" stopOpacity="0.6" />
					<Stop offset="1" stopColor="#00f" stopOpacity="0" />
				</LinearGradient>
			</Defs>

			<Rect x="0" y="0" width="100" height="50" fill="#fff" />

			{/* Axes */}
			{/* Required line */}
			{yRequerido !== null && (
				<Path
					d={`M0,${yRequerido} L100,${yRequerido}`}
					stroke="pink"
					strokeWidth="0.5"
				/>
			)}

			{/* Uniformidad line */}
			<Path
				d={`M0,${yUniformidad} L100,${yUniformidad}`}
				stroke="cyan"
				strokeWidth="0.5"
			/>

			<Path d="M0,50 L100,50" stroke="#000" strokeWidth="0.5" />
			<Path d="M0,0 L0,50" stroke="#000" strokeWidth="0.5" />

			{/* Axis Labels */}
			<Text x={-8} y={0} style={{ fontSize: 4 }} fill="#000">
				{max.toFixed(0)}
			</Text>
			<Text x={-8} y={48} style={{ fontSize: 4 }} fill="#000">
				{min.toFixed(0)}
			</Text>

			<EjeHorizontal
				ejeHorizontalDiv={ejeHorizontalDiv}
				puntosWithValueLength={puntosWithValue.length}
			/>

			<Grilla />

			<Path d={pathData} fill="lightblue" stroke="blue" strokeWidth="0.5" />
		</Svg>
	)
}

function EjeHorizontal({
	ejeHorizontalDiv,
	puntosWithValueLength,
}: {
	ejeHorizontalDiv: number
	puntosWithValueLength: number
}) {
	return (
		<>
			{Array.from({ length: puntosWithValueLength }).map((_, index) => (
				<Text
					key={index}
					x={index * ejeHorizontalDiv}
					y={55}
					style={{ fontSize: 2 }}
					fill="#000"
					textAnchor="middle"
				>
					{index + 1}
				</Text>
			))}
		</>
	)
}

function Grilla() {
	return null
}

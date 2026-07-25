import { Area, AreaChart, CartesianGrid, XAxis, Line } from "recharts"
import React from "react"
import { CardContent } from "@/components/ui/card"
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive area chart"

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	uniformidad: {
		label: "uniformidad",
		color: "cyan",
	},
	medicion: {
		label: "medicion",
		color: "yellow",
	},
} satisfies ChartConfig

type Props = {
	puntos: number[]
}

function ChartAreaInteractive({ puntos }: Props) {
	// Filter positive points
	const puntosWithValue = React.useMemo(
		() => puntos?.filter(p => p > 0) ?? [],
		[puntos]
	)

	const hasData = puntosWithValue.length > 0
	const MAX_POINTS = 100

	// Compute uniformidad
	const uniformidad = React.useMemo(() => {
		if (!hasData) return 0
		const total = puntosWithValue.reduce((acc, v) => acc + v, 0)
		return Math.ceil(total / puntosWithValue.length / 2)
	}, [puntosWithValue, hasData])

	// Prepare chart data
	const chartData = React.useMemo(() => {
		if (!hasData) return []
		const slice = puntosWithValue.slice(0, MAX_POINTS)
		return slice.map((punto, index) => ({
			punto: (index + 1).toString(),
			uniformidad,
			medicion: punto,
		}))
	}, [puntosWithValue, uniformidad, hasData])

	// Gradients
	const ChartGradients = React.useMemo(
		() => (
			<defs>
				<linearGradient id="fillMedicion" x1="0" y1="0" x2="0" y2="1">
					<stop
						offset="5%"
						stopColor="var(--color-medicion)"
						stopOpacity={0.8}
					/>
					<stop
						offset="95%"
						stopColor="var(--color-medicion)"
						stopOpacity={0.1}
					/>
				</linearGradient>
				<linearGradient id="fillUniformidad" x1="0" y1="0" x2="0" y2="0">
					<stop
						offset="5%"
						stopColor="var(--color-uniformidad)"
						stopOpacity={0.8}
					/>
					<stop
						offset="95%"
						stopColor="var(--color-uniformidad)"
						stopOpacity={0.1}
					/>
				</linearGradient>
			</defs>
		),
		[]
	)

	const chartWidth = Math.max(chartData.length * 55, 400)

	return (
		<div className="mt-10 bg-accent py-10 rounded-lg w-full">
			{hasData ? (
				<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 overflow-x-auto">
					<div style={{ width: `${chartWidth}px` }}>
						<ChartContainer
							config={chartConfig}
							className="aspect-auto h-[250px]"
						>
							<AreaChart data={chartData}>
								{ChartGradients}
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="punto"
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									minTickGap={32}
									tickFormatter={value => value.toString()}
								/>
								<ChartTooltip
									cursor={false}
									content={
										<ChartTooltipContent
											labelFormatter={value => `Punto ${value}`}
											indicator="dot"
										/>
									}
								/>
								<Line
									dataKey="uniformidad"
									type="natural"
									stroke="var(--color-uniformidad)"
									dot={false}
								/>
								<Area
									dataKey="medicion"
									type="natural"
									fill="url(#fillMedicion)"
									stroke="var(--color-medicion)"
								/>
								<ChartLegend content={<ChartLegendContent />} />
							</AreaChart>
						</ChartContainer>
					</div>
				</CardContent>
			) : (
				<span className="flex justify-center">No hay datos</span>
			)}
		</div>
	)
}

export default React.memo(ChartAreaInteractive)

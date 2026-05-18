import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export function ChartAreaInteractive({ puntos }: { puntos: number[] }) {
	const puntosWithValue = puntos?.filter(punto => punto > 0)
	if (!puntosWithValue || puntosWithValue.length === 0)
		return <span>No hay datos</span>
	const uniformidad = Math.ceil(
		puntosWithValue?.reduce((acc, valor) => acc + valor, 0) /
			puntosWithValue?.length /
			2
	)
	const chartData = puntosWithValue?.map((punto, index) => {
		return {
			punto: (index + 1).toString(),
			uniformidad,
			medicion: punto,
		}
	})

	return (
		<div className="mt-10 bg-accent py-10 rounded-lg w-[96dvw] sm:w-full mx-auto">
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 w-full">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={chartData}>
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
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="punto"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={value => {
								return value.toString()
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={value => {
										return `Punto ${value}`
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="uniformidad"
							type="natural"
							fill="url(#fillUniformidad)"
							stroke="var(--color-uniformidad)"
							stackId="a"
						/>
						<Area
							dataKey="medicion"
							type="natural"
							fill="url(#fillMedicion)"
							stroke="var(--color-medicion)"
							stackId="a"
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</div>
	)
}

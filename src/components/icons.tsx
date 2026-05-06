import { CheckCircle2, Clock, FileChartColumn } from "lucide-react"

export default function FileChart({ className }: { className?: string }) {
	return (
		<FileChartColumn
			className={`size-12 rounded-lg my-shadow text-blue-500 dark:text-blue-600 p-2 bg-[#90a2dd] dark:bg-blue-900 ${className}`}
		/>
	)
}

export function CheckCircle({ className }: { className?: string }) {
	return (
		<CheckCircle2
			className={`size-12 rounded-lg  my-shadow text-green-600 dark:text-green-600 p-2 bg-[#8bb9a0] dark:bg-green-900 ${className}`}
		/>
	)
}

export function ClockComponent({ className }: { className?: string }) {
	return (
		<Clock
			className={`size-12 rounded-lg  my-shadow text-amber-600 dark:text-amber-600 p-2 bg-[#caa58c] dark:bg-amber-900 ${className}`}
		/>
	)
}

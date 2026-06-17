import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

export default function BackChevron({
	className,
	to = "/",
	params,
}: {
	className?: string
	to?: string
	params?: Record<string, string>
}) {
	return (
		<Link
			to={to}
			params={params}
			className={`absolute top-4 left-4 ${className}`}
		>
			<ChevronLeft size={24} />
		</Link>
	)
}

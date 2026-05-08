import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

export default function BackChevron({
	className,
	to = "/",
}: {
	className?: string
	to?: string
}) {
	return (
		<Link to={to} className={`absolute top-4 left-4 ${className}`}>
			<ChevronLeft size={24} />
		</Link>
	)
}

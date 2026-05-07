import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"

export default function BackChevron({ className }: { className?: string }) {
	return (
		<Link to="/" className={`absolute top-4 left-4 ${className}`}>
			<ChevronLeft size={24} />
		</Link>
	)
}

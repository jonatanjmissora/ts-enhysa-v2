import {
	ErrorComponent,
	Link,
	rootRouteId,
	useMatch,
	useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { isOfflineNoCacheError } from "@/lib/offline/errors"
import { OfflineRouteBlock } from "@/components/offline-route-block"

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
	// Si el error es offline sin cache, mostrar UI dedicada
	if (isOfflineNoCacheError(error)) {
		return <OfflineRouteBlock />
	}

	const router = useRouter()
	const isRoot = useMatch({
		strict: false,
		select: state => state.id === rootRouteId,
	})

	console.error("DefaultCatchBoundary Error:", error)

	return (
		<div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
			<ErrorComponent error={error} />
			<div className="flex gap-2 items-center flex-wrap">
				<Button
					onClick={() => {
						router.invalidate()
					}}
				>
					Try Again
				</Button>
				{isRoot ? (
					<Link
						to="/"
						className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`}
					>
						Home
					</Link>
				) : (
					<Link
						to="/"
						className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`}
						onClick={e => {
							e.preventDefault()
							if (typeof window !== "undefined") {
								window.history.back()
							}
						}}
					>
						Go Back
					</Link>
				)}
			</div>
		</div>
	)
}

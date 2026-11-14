import { useQuery } from "@tanstack/react-query"
import { ImageOff } from "lucide-react"
import { useState } from "react"
import { getImageUrlServer } from "../../../server/images/get-image-url-server"
import { authClient } from "#/lib/auth-client"
import { isImageId } from "#/lib/image-value"
import { cn } from "#/lib/utils"

type ImageWithFallbackProps = {
	src?: string | null
	alt: string
	className?: string
	placeholderClassName?: string
}

/**
 * Imagen con placeholder cuando el archivo remoto ya no existe (404) o la URL
 * está vacía. Para el caso "metadata en DB pero binario perdido".
 */
export function ImageWithFallback({
	src,
	alt,
	className,
	placeholderClassName,
}: ImageWithFallbackProps) {
	const [failedSrc, setFailedSrc] = useState<string | null>(null)
	const { data: session } = authClient.useSession()
	const userId = session?.user.id
	const imageId = isImageId(src) ? src : null

	const { data: resolvedUrl, isPending } = useQuery({
		queryKey: ["image-url", userId, imageId],
		queryFn: () => getImageUrlServer({ data: { id: imageId as string } }),
		enabled: Boolean(imageId && userId),
		staleTime: Number.POSITIVE_INFINITY,
	})

	if (!src) return null

	if (imageId && userId && isPending) {
		return <div className={cn("animate-pulse bg-muted", className)} />
	}

	const resolvedSrc = imageId ? resolvedUrl : src

	if (!resolvedSrc) {
		return (
			<div
				role="img"
				aria-label="Archivo no disponible"
				className={cn(
					"flex flex-col items-center justify-center gap-1 overflow-hidden bg-muted p-1 text-center text-[10px] font-medium text-muted-foreground",
					className,
					placeholderClassName
				)}
			>
				<ImageOff className="size-5 shrink-0" aria-hidden />
				<span className="leading-tight">Archivo no disponible</span>
			</div>
		)
	}

	if (failedSrc === resolvedSrc) {
		return (
			<div
				role="img"
				aria-label={
					alt ? `${alt} no disponible` : "Archivo no disponible"
				}
				className={cn(
					"flex flex-col items-center justify-center gap-1 overflow-hidden bg-muted p-1 text-center text-[10px] font-medium text-muted-foreground",
					className,
					placeholderClassName
				)}
			>
				<ImageOff className="size-5 shrink-0" aria-hidden />
				<span className="leading-tight">Archivo no disponible</span>
			</div>
		)
	}

	return (
		<img
			src={resolvedSrc}
			alt={alt}
			className={className}
			onError={() => setFailedSrc(resolvedSrc)}
		/>
	)
}

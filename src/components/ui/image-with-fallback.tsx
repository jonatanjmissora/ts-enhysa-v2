import { ImageOff } from "lucide-react"
import { useState } from "react"
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

	if (!src) return null

	if (failedSrc === src) {
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
			src={src}
			alt={alt}
			className={className}
			onError={() => setFailedSrc(src)}
		/>
	)
}

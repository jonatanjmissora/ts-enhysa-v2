import { useRef, useState, useEffect, useCallback } from "react"
import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "../../server/uploadthing"
import { Eraser, Check, Loader, Pen, Upload, X } from "lucide-react"
import { FileDropzone } from "./upload-button"
import { Button } from "@/components/ui/button"

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

interface SignaturePadProps {
	defaultValue?: string
	onUploaded?: (url: string) => void
}

export function SignaturePad({ defaultValue, onUploaded }: SignaturePadProps) {
	const [firmaUrl, setFirmaUrl] = useState(defaultValue || "")
	const [mode, setMode] = useState<"draw" | "upload" | null>("upload")

	const handleChange = useCallback(
		(url: string) => {
			setFirmaUrl(url)
			onUploaded?.(url)
		},
		[onUploaded]
	)

	if (firmaUrl) {
		return (
			<div className="w-full relative bg-white/75 rounded">
				<img
					src={firmaUrl}
					alt="Firma"
					className="object-contain w-full h-20"
				/>
				<button
					type="button"
					aria-label="Eliminar firma"
					onClick={() => handleChange("")}
					className="absolute top-0 right-0"
				>
					<X size={20} className="text-background bg-amber-700" />
				</button>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="flex gap-2 justify-around items-center py-2">
				<button
					type="button"
					onClick={() => setMode("draw")}
					className={`flex items-center gap-1 px-5 py-2 text-xs rounded-md transition-colors ${
						mode === "draw"
							? "bg-amber-700 text-white"
							: "bg-accent text-foreground-soft hover:bg-accent/80"
					}`}
				>
					<Pen size={14} />
					Dibujar
				</button>
				<button
					type="button"
					onClick={() => setMode("upload")}
					className={`flex items-center gap-1 px-5 py-2 text-xs rounded-md transition-colors ${
						mode === "upload"
							? "bg-amber-700 text-white"
							: "bg-accent text-foreground-soft hover:bg-accent/80"
					}`}
				>
					<Upload size={14} />
					Subir
				</button>
			</div>
			{mode === "draw" && (
				<DrawingPad onUploaded={handleChange} setMode={setMode} />
			)}
			{mode === "upload" && (
				<FileDropzone text="Imagen Firma" onUploaded={handleChange} />
			)}
		</div>
	)
}

function DrawingPad({
	onUploaded,
	setMode,
}: {
	onUploaded: (url: string) => void
	setMode: (mode: "draw" | "upload" | null) => void
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [isDrawing, setIsDrawing] = useState(false)
	const [hasDrawn, setHasDrawn] = useState(false)
	const [isUploading, setIsUploading] = useState(false)

	const { startUpload } = useUploadThing("imageUploader", {
		onClientUploadComplete: res => {
			setIsUploading(false)
			const url = res[0]?.ufsUrl
			if (url) onUploaded(url)
		},
		onUploadError: () => {
			setIsUploading(false)
			alert("Error al subir la firma")
		},
	})

	const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
		const canvas = canvasRef.current
		if (!canvas) return { x: 0, y: 0 }
		const rect = canvas.getBoundingClientRect()
		const scaleX = canvas.width / rect.width
		const scaleY = canvas.height / rect.height
		if ("touches" in e) {
			return {
				x: (e.touches[0].clientX - rect.left) * scaleX,
				y: (e.touches[0].clientY - rect.top) * scaleY,
			}
		}
		return {
			x: (e.clientX - rect.left) * scaleX,
			y: (e.clientY - rect.top) * scaleY,
		}
	}

	const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault()
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		if (!ctx) return
		const { x, y } = getCanvasPos(e)
		ctx.beginPath()
		ctx.moveTo(x, y)
		setIsDrawing(true)
		setHasDrawn(true)
	}

	const draw = (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault()
		if (!isDrawing) return
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		if (!ctx) return
		const { x, y } = getCanvasPos(e)
		ctx.lineTo(x, y)
		ctx.stroke()
	}

	const stopDrawing = () => setIsDrawing(false)

	const clearCanvas = () => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		if (!ctx) return
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		setHasDrawn(false)
	}

	const confirmSignature = async () => {
		if (!hasDrawn) return
		const canvas = canvasRef.current
		if (!canvas) return
		setIsUploading(true)
		const blob = await new Promise<Blob | null>(resolve =>
			canvas.toBlob(resolve, "image/png")
		)
		if (!blob) {
			setIsUploading(false)
			return
		}
		const file = new File([blob], "firma.png", { type: "image/png" })
		startUpload([file])
	}

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		if (!ctx) return
		ctx.strokeStyle = "#1a1a2e"
		ctx.lineWidth = 2.5
		ctx.lineCap = "round"
		ctx.lineJoin = "round"
	}, [])

	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="relative rounded-lg overflow-hidden">
				<canvas
					ref={canvasRef}
					width={600}
					height={300}
					onMouseDown={startDrawing}
					onMouseMove={draw}
					onMouseUp={stopDrawing}
					onMouseLeave={stopDrawing}
					onTouchStart={startDrawing}
					onTouchMove={draw}
					onTouchEnd={stopDrawing}
					className="w-full touch-none bg-white/70"
				/>
				{!hasDrawn && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
						<span className="text-foreground-soft/30 text-sm">Firma aquí</span>
					</div>
				)}
			</div>
			<div className="flex gap-2 justify-around items-center">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setMode("upload")}
				>
					<X size={14} className="mr-1" />
					<span className="hidden sm:block">Cancelar</span>
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={clearCanvas}
					disabled={!hasDrawn || isUploading}
				>
					<Eraser size={14} className="mr-1" />
					<span className="hidden sm:block">Limpiar</span>
				</Button>
				<Button
					type="button"
					size="sm"
					onClick={confirmSignature}
					disabled={!hasDrawn || isUploading}
				>
					{isUploading ? (
						<>
							<Loader size={14} className="animate-spin mr-1" />
							<span className="hidden sm:block">Subiendo...</span>
						</>
					) : (
						<>
							<Check size={14} className="mr-1" />
							<span className="hidden sm:block">Confirmar</span>
						</>
					)}
				</Button>
			</div>
		</div>
	)
}

import { Suspense, useState } from "react"
import { UploadDropzone } from "@uploadthing/react"
import type { OurFileRouter, OurFilesRouter } from "../../server/uploadthing"
import { CloudUpload, X } from "lucide-react"
import { deleteUploadthingFile } from "../../server/upload-file-delete"
import { createImageServer } from "../../server/images/create-image-server"
import { deleteImageServer } from "../../server/images/delete-image-server"
import {
	getNormalizedImageDimensions,
	normalizeImageFiles,
} from "#/lib/normalize-image-file"
import { isImageId } from "#/lib/image-value"
import { ImageWithFallback } from "./ui/image-with-fallback"

type UploadedFile = {
	key: string
	ufsUrl: string
	name: string
	size: number
	type: string
}

function loadRemoteImageDimensions(
	url: string
): Promise<{ width: number; height: number }> {
	return new Promise(resolve => {
		const image = new Image()
		image.crossOrigin = "anonymous"
		image.onload = () =>
			resolve({ width: image.naturalWidth, height: image.naturalHeight })
		image.onerror = () => resolve({ width: 0, height: 0 })
		image.src = url
	})
}

async function registerUploadedImage(file: UploadedFile): Promise<string> {
	try {
		const dimensions =
			getNormalizedImageDimensions(file.name) ??
			(await loadRemoteImageDimensions(file.ufsUrl))

		const result = await createImageServer({
			data: {
				key: file.key,
				url: file.ufsUrl,
				name: file.name,
				mimeType: file.type,
				size: file.size,
				width: dimensions.width,
				height: dimensions.height,
			},
		})
		return result.id
	} catch (error) {
		console.error("[upload] no se pudo registrar la imagen:", error)
		return file.ufsUrl
	}
}

async function removeImageValue(value: string): Promise<void> {
	if (isImageId(value)) {
		await deleteImageServer({ data: { id: value } })
		return
	}

	const fileKey = value.split("/").pop()
	if (fileKey) await deleteUploadthingFile({ data: { fileKey } })
}

interface FileDropzoneProps {
	text?: string
	onUploaded?: (urls: string) => void
	defaultValue?: string
}

interface FilesDropzoneProps {
	text?: string
	onUploaded?: (urls: string[]) => void
	defaultValue?: string[]
}

export function FileDropzone({
	text = "Arrastra archivos aqui",
	onUploaded,
	defaultValue,
}: FileDropzoneProps) {
	const [file, setFile] = useState<string>(defaultValue || "")
	const [error, setError] = useState<string>("")

	const deleteImage = async () => {
		try {
			await removeImageValue(file)
		} catch (error) {
			console.error("Error al eliminar archivo", error)
			alert("Error al eliminar archivo")
			return
		}
		setFile("")
		if (onUploaded) onUploaded("")
	}

	return (
		<div className="w-full">
			{file ? (
				<div className="w-full relative h-20">
					{file &&
						(file?.includes(".pdf") ? (
							<a
								href={file}
								target="_blank"
								className="border rounded p-4 flex items-center justify-center bg-accent hover:bg-accent/80 transition-colors"
							>
								Ver PDF
							</a>
						) : (
							<>
								<ImageWithFallback
									src={file}
									alt=""
									className="object-contain w-full h-full border border-foreground/10"
								/>
								<button
									type="button"
									aria-label="Eliminar imagen"
									className="absolute top-0 right-0"
									onClick={deleteImage}
								>
									<X size={20} className="text-background bg-amber-700" />
								</button>
							</>
						))}
				</div>
			) : (
				<div className="flex flex-col w-full items-center gap-2">
					<UploadDropzone<OurFileRouter, "imageUploader">
						endpoint="imageUploader"
						config={{ mode: "auto" }}
						content={{
							label: text,
							allowedContent: "Imágenes hasta 4MB",
							button({ ready, isUploading, uploadProgress }) {
								if (isUploading) return `Subiendo ${uploadProgress}%`
								if (ready)
									return (
										<CloudUpload className="size-8 text-foreground-soft/70" />
									)
								return "Cargando..."
							},
						}}
						onBeforeUploadBegin={async files => {
							const allowed = files.filter(file => {
								const extension = file.name.split(".").pop()?.toLowerCase()
								const isAllowed = ["jpg", "jpeg", "png"].includes(
									extension || ""
								)
								if (!isAllowed) {
									alert(
										"No es una extensión válida. Sólo se permiten archivos jpg, jpeg y png"
									)
								}
								return isAllowed
							})
							return await normalizeImageFiles(allowed)
						}}
						onClientUploadComplete={async res => {
							setError("")
							const uploaded = res?.[0]
							if (!uploaded) return
							const value = await registerUploadedImage(uploaded)
							setFile(value)
							if (onUploaded) onUploaded(value)
						}}
						onUploadError={error => {
							if (error.message === "Invalid config: FileSizeMismatch")
								setError("El archivo es demasiado grande")
							else setError(error.message)
						}}
						appearance={{
							container:
								"border-1 border-dashed rounded-xl bg-accent/50 !p-0 !my-2 !gap-0 flex flex-row-reverse w-full",
							label: "text-sm text-foreground-soft font-medium !mt-0",
							allowedContent: "hidden",
							button: "bg-transparent w-30 text-sm tracking-wide !mt-0",
							uploadIcon: "hidden",
						}}
					/>
					{error && (
						<span className="text-red-700/50 italic text-sm">{error}</span>
					)}
				</div>
			)}
		</div>
	)
}
export function FilesDropzone({
	text = "Arrastra archivos aqui",
	onUploaded,
	defaultValue,
}: FilesDropzoneProps) {
	const [files, setFiles] = useState<string[]>(defaultValue ?? [])
	const [error, setError] = useState<string>("")

	const deleteImage = async (file: string) => {
		try {
			await removeImageValue(file)
		} catch (error) {
			console.error("Error al eliminar archivo", error)
			alert("Error al eliminar archivo")
			return
		}
		setFiles(prev => {
			const newFiles = prev.filter(f => f !== file)
			if (onUploaded) onUploaded(newFiles)
			return newFiles
		})
	}

	return (
		<>
			{files.length < 4 && (
				<div className="flex flex-col w-full items-center gap-2">
					<UploadDropzone<OurFilesRouter, "mixedUploader">
						endpoint="mixedUploader"
						config={{ mode: "auto" }}
						content={{
							label: text,
							allowedContent: "Imágenes hasta 4MB",
							button({ ready, isUploading, uploadProgress }) {
								if (isUploading) return `Subiendo ${uploadProgress}%`
								if (ready)
									return (
										<CloudUpload className="size-8 text-foreground-soft/70" />
									)
								return "Cargando..."
							},
						}}
						onBeforeUploadBegin={files => {
							return files.filter(file => {
								const extension = file.name.split(".").pop()?.toLowerCase()
								const isAllowed = ["jpg", "jpeg", "png"].includes(
									extension || ""
								)
								if (!isAllowed) {
									alert(
										"No es una extension valida. Solo se permiten archivos jpg, jpeg y png"
									)
								}
								return isAllowed
							})
						}}
						onClientUploadComplete={async res => {
							setError("")
							if (!res) return
							const values = await Promise.all(
								res.map(uploaded => registerUploadedImage(uploaded))
							)
							setFiles(prev => {
								const newFiles = [...prev, ...values]
								if (onUploaded) onUploaded(newFiles)
								return newFiles
							})
						}}
						onUploadError={error => {
							if (error.message === "Invalid config: FileSizeMismatch")
								setError("El archivo es demasiado grande")
							else setError(error.message)
						}}
						appearance={{
							container:
								"border-1 border-dashed rounded-xl bg-accent/50 !p-3 !my-2 !gap-0 flex-col-reverse w-full",
							label: "text-sm text-foreground-soft font-medium !m-0 !p-0",
							allowedContent: "text-xs text-foreground-soft/70",
							button: "bg-transparent w-max text-sm tracking-wide !mt-0",
							uploadIcon: "hidden",
						}}
					/>
					{error && (
						<span className="text-red-700/50 italic text-sm">{error}</span>
					)}
				</div>
			)}
			{files[0] !== "" && (
				<Suspense fallback={<div>Cargando imagenes...</div>}>
					<FilesPreview files={files} deleteImage={deleteImage} />
				</Suspense>
			)}
		</>
	)
}

function FilesPreview({
	files,
	deleteImage,
}: {
	files: string[]
	deleteImage: (file: string) => Promise<void>
}) {
	return (
		<div className="w-full">
			<div className="flex w-full grid-cols-4 gap-2 content-center">
				{files.map(url => {
					const isPdf = url.includes(".pdf")

					if (isPdf) {
						return (
							<a
								key={url}
								href={url}
								target="_blank"
								className="border rounded p-4 flex items-center justify-center bg-accent hover:bg-accent/80 transition-colors"
							>
								Ver PDF
							</a>
						)
					}

					return (
						<div className="relative w-full h-20 " key={url}>
							<ImageWithFallback
								src={url}
								alt=""
								className="h-full w-full object-contain rounded border border-foreground/10"
							/>
							<button
								type="button"
								aria-label="Eliminar imagen"
								onClick={() => deleteImage(url)}
								className="absolute top-0 right-0"
							>
								<X size={20} className="text-background bg-amber-700" />
							</button>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export function ImageUploader({ onUploaded }: FilesDropzoneProps) {
	const [images, setImages] = useState<{ value: string; name: string }[]>([])

	return (
		<div className="flex flex-col items-center gap-6 w-full">
			<UploadDropzone<OurFilesRouter, "mixedUploader">
				endpoint="mixedUploader"
					onBeforeUploadBegin={async files => {
						const allowed = files.filter(file => {
							const extension = file.name.split(".").pop()?.toLowerCase()
							const isAllowed = ["jpg", "jpeg", "png"].includes(extension || "")
							if (!isAllowed) {
								alert(
									"No es una extension valida. Solo se permiten archivos jpg, jpeg y png"
								)
							}
							return isAllowed
						})
						return await normalizeImageFiles(allowed)
					}}
				onClientUploadComplete={async res => {
					if (!res) return
					const values = await Promise.all(
						res.map(async file => ({
							value: await registerUploadedImage(file),
							name: file.name,
						}))
					)
					setImages(prev => [...prev, ...values])
					if (onUploaded) onUploaded(values.map(item => item.value))
				}}
				onUploadError={error => {
					alert(error.message)
				}}
			/>

			{images.length > 0 && (
				<Suspense fallback={<div>Cargando imagenes...</div>}>
					<ImagesPreview2 images={images} />
				</Suspense>
			)}
		</div>
	)
}

function ImagesPreview2({
	images,
}: {
	images: { value: string; name: string }[]
}) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
			{images.map((img, i) => (
				<div
					key={i}
					className="relative aspect-square rounded-xl overflow-hidden border border-foreground/10 group hover:scale-[1.02] transition-all duration-300"
				>
					<ImageWithFallback
						src={img.value}
						alt={img.name}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
						<p className="text-white text-xs truncate w-full">{img.name}</p>
					</div>
				</div>
			))}
		</div>
	)
}

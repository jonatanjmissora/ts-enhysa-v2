import { useState } from "react"
import { UploadDropzone } from "@uploadthing/react"
import type { OurFileRouter, OurFilesRouter } from "../../server/uploadthing"
import { CloudUpload, X } from "lucide-react"
import { deleteUploadthingFile } from "../../server/upload-file-delete"

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
		const fileKey = file.split("/").pop()
		if (!fileKey) return
		const res = await deleteUploadthingFile({ data: { fileKey } })
		if (!res.success) {
			console.log("Error al eliminar archivo")
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
								<img
									src={file}
									alt=""
									className="object-contain w-full h-full border border-foreground/10"
								/>
								<button
									type="button"
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
							allowedContent: "Imágenes hasta 2MB",
							button({ ready, isUploading, uploadProgress }) {
								if (isUploading) return `Subiendo ${uploadProgress}%`
								if (ready)
									return (
										<CloudUpload className="size-8 text-muted-foreground/70" />
									)
								return "Cargando..."
							},
						}}
						onClientUploadComplete={res => {
							setError("")
							if (res) {
								const url = res[0]?.ufsUrl
								if (url) setFile(url)
								if (onUploaded) onUploaded(url)
							}
						}}
						onUploadError={error => {
							if (error.message === "Invalid config: FileSizeMismatch")
								setError("El archivo es demasiado grande")
							else setError(error.message)
						}}
						appearance={{
							container:
								"border-1 border-dashed rounded-xl bg-accent/50 !p-0 !my-2 !gap-0 flex flex-row-reverse w-full",
							label: "text-sm text-muted-foreground font-medium !mt-0",
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
		const fileKey = file.split("/").pop()
		if (!fileKey) return
		const res = await deleteUploadthingFile({ data: { fileKey } })
		if (!res.success) {
			console.log("Error al eliminar archivo")
			alert("Error al eliminar archivo")
			return
		}
		setFiles(prev => prev.filter(f => f !== file))
		if (onUploaded) onUploaded(files.filter(f => f !== file))
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
							allowedContent: "Imágenes hasta 2MB",
							button({ ready, isUploading, uploadProgress }) {
								if (isUploading) return `Subiendo ${uploadProgress}%`
								if (ready)
									return (
										<CloudUpload className="size-8 text-muted-foreground/70" />
									)
								return "Cargando..."
							},
						}}
						onClientUploadComplete={res => {
							setError("")
							if (res) {
								const urls = res.map(x => x.ufsUrl)
								setFiles(prev => [...prev, ...urls])
								if (onUploaded) onUploaded(urls)
							}
						}}
						onUploadError={error => {
							if (error.message === "Invalid config: FileSizeMismatch")
								setError("El archivo es demasiado grande")
							else setError(error.message)
						}}
						appearance={{
							container:
								"border-1 border-dashed rounded-xl bg-accent/50 !p-3 !my-2 !gap-0 flex-col-reverse w-full",
							label: "text-sm text-muted-foreground font-medium !m-0 !p-0",
							allowedContent: "text-xs text-muted-foreground/70",
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
									<img
										src={url}
										alt=""
										className="h-full w-full object-contain rounded shadow-md border border-foreground/10"
									/>
									<button
										type="button"
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
			)}
		</>
	)
}

export function ImageUploader({ onUploaded }: FilesDropzoneProps) {
	const [images, setImages] = useState<{ url: string; name: string }[]>([])

	return (
		<div className="flex flex-col items-center gap-6 w-full">
			<UploadDropzone<OurFilesRouter, "mixedUploader">
				endpoint="mixedUploader"
				onClientUploadComplete={res => {
					if (res) {
						const urls = res.map(file => ({
							url: file.ufsUrl,
							name: file.name,
						}))
						setImages(prev => [...prev, ...urls])
						if (onUploaded) onUploaded(urls.map(u => u.url))
					}
				}}
				onUploadError={error => {
					alert(error.message)
				}}
			/>

			{images.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
					{images.map((img, i) => (
						<div
							key={i}
							className="relative aspect-square rounded-xl overflow-hidden border border-foreground/10 shadow-lg group hover:scale-[1.02] transition-all duration-300"
						>
							<img
								src={img.url}
								alt={img.name}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
								<p className="text-white text-xs truncate w-full">{img.name}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

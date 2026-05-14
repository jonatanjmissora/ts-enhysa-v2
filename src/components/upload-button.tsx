import { useState } from "react"
import { UploadDropzone } from "@uploadthing/react"
import type { OurFileRouter, OurFilesRouter } from "../../server/uploadthing"
import { CloudUpload } from "lucide-react"

interface FileDropzoneProps {
	filesNumber?: number
	text?: string
	onUploaded?: (urls: string[]) => void
}

export function FileDropzone({
	filesNumber = 1,
	text = "Arrastra archivos aqui",
	onUploaded,
}: FileDropzoneProps) {
	const [files, setFiles] = useState<string[]>([])

	if (filesNumber === 1) {
		return (
			<div className="w-5/6 mx-auto">
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
					// onUploadBegin={name => {
					// 	console.log("Iniciando subida de:", name)
					// }}
					// onUploadProgress={progress => {
					// 	console.log(`Progreso: ${progress}%`)
					// }}
					onClientUploadComplete={res => {
						if (res) {
							const urls = res.map(x => x.ufsUrl)
							setFiles(prev => [...prev, ...urls])
							if (onUploaded) onUploaded(urls)
						}
					}}
					onUploadError={error => {
						alert(error.message)
					}}
					appearance={{
						container:
							"border-1 border-dashed rounded-xl bg-accent/50 !p-0 !my-2 !gap-0 flex flex-row-reverse",
						label: "text-sm text-muted-foreground font-medium !mt-0",
						allowedContent: "hidden",
						button: "bg-transparent w-30 text-sm tracking-wide !mt-0",
						uploadIcon: "hidden",
					}}
				/>
				<div className="grid grid-cols-2 gap-4">
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
							<img
								key={url}
								src={url}
								alt=""
								className="w-full h-40 object-cover rounded shadow-md border border-foreground/10"
							/>
						)
					})}
				</div>
			</div>
		)
	}

	return (
		<div className="w-5/6 mx-auto">
			<UploadDropzone<OurFilesRouter, "mixedUploader">
				endpoint="mixedUploader"
				config={{ mode: "auto" }}
				content={{
					label: "Arrastra archivos aquí",
					allowedContent: "Imágenes hasta 2MB",
					button({ ready, isUploading, uploadProgress }) {
						if (isUploading) return `Subiendo ${uploadProgress}%`
						if (ready)
							return <CloudUpload className="size-8 text-muted-foreground/70" />
						return "Cargando..."
					},
				}}
				// onUploadBegin={name => {
				// 	console.log("Iniciando subida de:", name)
				// }}
				// onUploadProgress={progress => {
				// 	console.log(`Progreso: ${progress}%`)
				// }}
				onClientUploadComplete={res => {
					if (res) {
						const urls = res.map(x => x.ufsUrl)
						setFiles(prev => [...prev, ...urls])
						if (onUploaded) onUploaded(urls)
					}
				}}
				onUploadError={error => {
					alert(error.message)
				}}
				appearance={{
					container:
						"border-1 border-dashed rounded-xl bg-accent/50 !p-3 !my-2 !gap-0 flex-col-reverse",
					label: "text-sm text-muted-foreground font-medium !m-0 !p-0",
					allowedContent: "text-xs text-muted-foreground/70",
					button: "bg-transparent w-max text-sm tracking-wide !mt-0",
					uploadIcon: "hidden",
				}}
			/>
			<div className="grid grid-cols-2 gap-4">
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
						<img
							key={url}
							src={url}
							alt=""
							className="w-full h-40 object-cover rounded shadow-md border border-foreground/10"
						/>
					)
				})}
			</div>
		</div>
	)
}

export function ImageUploader({ onUploaded }: FileDropzoneProps) {
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
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
								<p className="text-white text-xs truncate w-full">{img.name}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

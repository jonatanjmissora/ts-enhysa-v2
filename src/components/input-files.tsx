import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemMetadata,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { CloudUpload, X } from "lucide-react"

export const InputFiles = ({
	text,
	files,
	setFiles,
	maxFiles = 4,
	editMode,
}: {
	text: string
	files: File[]
	setFiles: (files: File[]) => void
	maxFiles?: number
	editMode?: boolean
}) => {
	if (maxFiles === 1) {
		return (
			<article className="w-full">
				{files.length < maxFiles && (
					<FileUpload
						maxFiles={maxFiles}
						maxSize={5 * 1024 * 1024}
						className="w-full"
						value={files}
						onValueChange={setFiles}
						multiple
					>
						<FileUploadDropzone className="p-0 border-none">
							<FileUploadTrigger asChild disabled={!editMode}>
								<div className="flex items-center justify-center flex-wrap gap-0 w-full cursor-pointer">
									<CloudUpload className="size-6 mx-2 text-foreground/20 pointer-events-none" />
									<span className="text-foreground/20 sm:text-sm 2xl:text-lg text-pretty">
										{text}
									</span>
								</div>
							</FileUploadTrigger>
						</FileUploadDropzone>
					</FileUpload>
				)}
				<FileUpload
					maxFiles={maxFiles}
					maxSize={5 * 1024 * 1024}
					className="w-full"
					value={files}
					onValueChange={setFiles}
					multiple
				>
					<FileUploadList className="w-full flex flex-row flex-wrap">
						{files.map((file, index) => (
							<FileUploadItem
								key={index}
								value={file}
								className="w-full p-0 m-0 mx-1"
							>
								<FileUploadItemPreview />
								<FileUploadItemMetadata className="w-5 font-semibold text-foreground/50 tracking-wider sm:text-lg 2xl:text-xl cursor-pointer" />
								<FileUploadItemDelete asChild>
									<Button variant="ghost" size="icon" className="size-7">
										<X className="size-4" />
									</Button>
								</FileUploadItemDelete>
							</FileUploadItem>
						))}
					</FileUploadList>
				</FileUpload>
			</article>
		)
	}

	return (
		<article className="w-full">
			{files.length < maxFiles && (
				<FileUpload
					maxFiles={maxFiles}
					maxSize={5 * 1024 * 1024}
					className="w-full sm:px-6"
					value={files}
					onValueChange={setFiles}
					multiple
				>
					<FileUploadDropzone className="flex flex-col items-center justify-center border-dotted-2 text-center gap-0 py-2 w-full sm:border-foreground/20 p-0 sm:p-2">
						<FileUploadTrigger asChild disabled={!editMode}>
							<div className="flex items-center justify-center flex-wrap gap-0 w-full cursor-pointer">
								<CloudUpload className="size-7 sm:mx-2 text-foreground/20 pointer-events-none" />
								<span className="text-foreground/50 textXS text-pretty">
									{text}
								</span>
							</div>
						</FileUploadTrigger>
						<p className="text-xs tracking-wide text-foreground/30 italic">
							hasta {maxFiles} archivos de menos de 5MB
						</p>
					</FileUploadDropzone>
				</FileUpload>
			)}
			<FileUpload
				maxFiles={maxFiles}
				maxSize={5 * 1024 * 1024}
				className="w-full"
				value={files}
				onValueChange={setFiles}
				multiple
			>
				<FileUploadList className="w-full flex flex-row gap-0 flex-wrap">
					{files.map((file, index) => (
						<FileUploadItem
							key={index}
							value={file}
							className="w-full p-0 m-0 mx-4 my-1"
						>
							<FileUploadItemPreview />
							<FileUploadItemMetadata />
							<FileUploadItemDelete asChild>
								<Button variant="ghost" size="icon" className="size-7">
									<X className="size-4" />
								</Button>
							</FileUploadItemDelete>
						</FileUploadItem>
					))}
				</FileUploadList>
			</FileUpload>
		</article>
	)
}

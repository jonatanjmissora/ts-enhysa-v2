import { FileDropzone, ImageUploader } from "#/components/upload-button"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/test/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-screen min-h-svh flex flex-col items-center justify-center gap-6">
			<h1>Test</h1>
			<FileDropzone
				filesNumber={1}
				onUploaded={urls => {
					console.log("QUE PASO!!!:", urls)
				}}
			/>

			<FileDropzone
				filesNumber={4}
				onUploaded={urls => {
					console.log("QUE PASO!!!:", urls)
				}}
			/>

			<ImageUploader
				onUploaded={urls => {
					console.log("QUE PASO!!!:", urls)
				}}
			/>
		</div>
	)
}

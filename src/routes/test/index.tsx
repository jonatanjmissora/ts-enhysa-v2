// import {
// 	FileDropzone,
// 	FilesDropzone,
// 	ImageUploader,
// } from "#/components/upload-button"
import BackChevron from "#/components/back-chevron"
import { ClientComponent } from "#/components/client-component"
import Loading from "#/components/loading"
import { lazy } from "react"
const MyDocumentTest = lazy(() =>
	import("#/components/reportes/iluminacion/pdf/XXXmy-document-test").then(
		m => ({ default: m.MyDocumentTest })
	)
)
import Title from "#/components/title"
import useScrollTop from "#/hooks/scroll-top"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/test/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		// 		<div className="w-screen min-h-svh flex flex-col items-center justify-center gap-6">
		// 			<h1>Test</h1>
		// 			<FileDropzone
		// 				onUploaded={url => {
		// 					console.log("QUE PASO!!!:", url)
		// 				}}
		// 			/>

		// 			<FilesDropzone
		// 				onUploaded={urls => {
		// 					console.log("QUE PASO!!!:", urls)
		// 				}}
		// 			/>

		// 			<ImageUploader
		// 				onUploaded={urls => {
		// 					console.log("QUE PASO!!!:", urls)
		// 				}}
		// 			/>
		// 		</div>

		<MyNewOne />
	)
}

function MyNewOne() {
	useScrollTop()
	return (
		<article className="w-full min-h-svh flex flex-col items-center gap-0 relative mb-60">
			<BackChevron to="/iluminacion/reportes" />
			<div className="flex flex-col gap-0 items-center justify-center w-full mb-12">
				<Title text="Reporte Iluminación PDF" className="mt-15" />
			</div>
			<Prueba />
		</article>
	)
}
import { Suspense } from "react"
function Prueba() {
	return (
		<ClientComponent
			fallback={
				<Loading
					text="generando pdf..."
					className="scale-50 justify-start  max-h-[50svh]"
				/>
			}
		>
			hola
			<Suspense fallback={<span>cargando...</span>}>
				<MyDocumentTest />
			</Suspense>
		</ClientComponent>
	)
}

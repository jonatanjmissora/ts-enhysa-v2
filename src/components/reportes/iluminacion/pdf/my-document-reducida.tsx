import { memo, useState, useEffect } from "react"
import {
	Document as PDFRendererDocument,
	Font,
	usePDF,
} from "@react-pdf/renderer"

Font.register({
	family: "Roboto",
	src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
})

import type { ReporteIluminacionType } from "../../../../../db/reportes/iluminacion/schema"
import Page1 from "./page-1"
import type { TecnicoType } from "../../../../../db/tecnicos/schema"
import type { EmpresaType } from "../../../../../db/empresas/schema"
import type { InstrumentoType } from "../../../../../db/instrumentos/schema"
import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"
import Page3 from "./page-3"
import Page4 from "./page-4"
import Page5 from "./page-5"
import Loading from "#/components/loading"
import { Button } from "#/components/ui/button"
import Page0 from "./page-0"
import Page6 from "./page-6"
import Page2Reducida from "./page-2-reducida"
import Page05 from "./page-0-5"
import type { LocalizadaIluminacionType } from "../../../../../db/reportes/iluminacion/localizadas/schema"

export const MyDocumentReducida = memo(
	({
		reporte,
		localizadas,
		areas,
		tecnico,
		empresa,
		instrumento,
	}: {
		reporte: ReporteIluminacionType
		localizadas: LocalizadaIluminacionType[]
		areas: AreaIluminacionType[]
		tecnico: TecnicoType
		empresa: EmpresaType
		instrumento: InstrumentoType
	}) => {
		const [instance] = usePDF({
			document: (
				<MyDocumentData
					reporte={reporte}
					localizadas={localizadas}
					areas={areas}
					tecnico={tecnico}
					empresa={empresa}
					instrumento={instrumento}
				/>
			),
		})

		if (instance.loading) {
			return (
				<Loading
					text="generando pdf..."
					className="scale-50 justify-start  max-h-[50svh]"
				/>
			)
		}

		if (instance.error) {
			return <div>Error al generar el PDF: {String(instance.error)}</div>
		}

		return (
			<div className="flex flex-col items-center w-full gap-4 pb-12">
				<div className="flex justify-center w-full mb-6">
					<a
						// biome-ignore lint/style/noNonNullAssertion: <la conozco>
						href={instance.url!}
						download={`Informe Iluminacion ${empresa.razonSocial} - ${reporte.finishedAt?.toLocaleDateString("it-IT")}.pdf`}
						className=""
					>
						<Button>Descargar PDF</Button>
					</a>
				</div>

				<div className="w-full max-w-full overflow-hidden flex flex-col items-center bg-muted/20 py-8">
					<PdfViewerClient
						url={instance.url}
						loading={
							<Loading
								text="cargando visor..."
								className="scale-50 justify-start  max-h-[50svh]"
							/>
						}
					/>
				</div>
			</div>
		)
	}
)

function MyDocumentData({
	reporte,
	localizadas,
	areas,
	tecnico,
	empresa,
	instrumento,
}: {
	reporte: ReporteIluminacionType
	localizadas: LocalizadaIluminacionType[]
	areas: AreaIluminacionType[]
	tecnico: TecnicoType
	empresa: EmpresaType
	instrumento: InstrumentoType
}) {
	return (
		<PDFRendererDocument title={reporte.title}>
			<Page0 tecnico={tecnico} empresa={empresa} />
			<Page05 tecnico={tecnico} empresa={empresa} />
			<Page1
				reporte={reporte}
				tecnico={tecnico}
				empresa={empresa}
				instrumento={instrumento}
			/>
			<Page2Reducida
				localizadas={localizadas}
				areas={areas}
				tecnico={tecnico}
				empresa={empresa}
			/>
			<Page3 reporte={reporte} tecnico={tecnico} empresa={empresa} />
			<Page4 tecnico={tecnico} empresa={empresa} instrumento={instrumento} />
			<Page5 areas={areas} tecnico={tecnico} empresa={empresa} />
			<Page6 areas={areas} tecnico={tecnico} empresa={empresa} />
		</PDFRendererDocument>
	)
}

function PdfViewerClient({
	url,
	loading,
}: {
	url: string | null | undefined
	loading: React.ReactNode
}) {
	const [numPages, setNumPages] = useState<number>()
	const [width, setWidth] = useState<number>(window.innerWidth)
	const [ReactPdf, setReactPdf] = useState<any>(null)

	useEffect(() => {
		const handleResize = () => setWidth(window.innerWidth)
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	useEffect(() => {
		let isMounted = true
		import("react-pdf").then(async m => {
			if (!isMounted) return
			m.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${m.pdfjs.version}/build/pdf.worker.min.mjs`

			// Dynamically import CSS
			await import("react-pdf/dist/Page/AnnotationLayer.css")
			await import("react-pdf/dist/Page/TextLayer.css")

			setReactPdf({
				Document: m.Document,
				Page: m.Page,
			})
		})
		return () => {
			isMounted = false
		}
	}, [])

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages)
	}

	if (!ReactPdf) return loading

	const { Document, Page } = ReactPdf

	return (
		<Document
			file={url}
			onLoadSuccess={onDocumentLoadSuccess}
			className="flex flex-col gap-8"
			loading={loading}
		>
			{Array.from(new Array(numPages), (_el, index) => (
				<div key={`page_${index + 1}`} className="ring-1 ring-black/5">
					<Page
						pageNumber={index + 1}
						renderTextLayer={false}
						renderAnnotationLayer={false}
						width={Math.min(width - 32, 800)}
					/>
				</div>
			))}
		</Document>
	)
}

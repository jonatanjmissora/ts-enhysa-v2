import { memo, useState, useEffect } from "react"
import { Page, Text, Document } from "@react-pdf/renderer"
import {
	Document as PDFRendererDocument,
	Font,
	usePDF,
} from "@react-pdf/renderer"
import {
	Document as ReactPdfDocument,
	Page as ReactPdfPage,
	pdfjs,
} from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

Font.register({
	family: "Roboto",
	src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
})

export const MyDocumentTest = memo(() => {
	const [numPages, setNumPages] = useState<number>()
	const [width, setWidth] = useState<number>(window.innerWidth)

	useEffect(() => {
		const handleResize = () => setWidth(window.innerWidth)
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	const [instance] = usePDF({
		document: <MyDocumentData />,
	})

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages)
	}

	if (instance.loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50svh]">
				<span className="italic text-foreground/50 animate-pulse tracking-wider text-sm h-[46px] flex items-center">
					Generando PDF...
				</span>
			</div>
		)
	}

	if (instance.error) {
		return <div>Error al generar el PDF: {String(instance.error)}</div>
	}

	return (
		<div className="flex flex-col items-center w-full gap-4 pb-12">
			<div className="flex justify-center w-full mb-6">
				<a
					href={instance.url!}
					download={`Reporte Iluminacion.pdf`}
					className="bg-primary/10 hover:bg-primary/20 text-primary py-3 px-10 rounded-lg tracking-wider text-sm ring-[1px] ring-primary/30 transition-colors duration-300"
				>
					Descargar PDF
				</a>
			</div>

			<div className="w-full max-w-full overflow-hidden flex flex-col items-center border border-border/50 rounded-xl bg-muted/20 py-8">
				<ReactPdfDocument
					file={instance.url}
					onLoadSuccess={onDocumentLoadSuccess}
					className="flex flex-col gap-8"
					loading={
						<span className="italic text-foreground/50 animate-pulse tracking-wider text-sm">
							Cargando visor...
						</span>
					}
				>
					{Array.from(new Array(numPages), (el, index) => (
						<div
							key={`page_${index + 1}`}
							className="shadow-xl ring-1 ring-black/5"
						>
							<ReactPdfPage
								pageNumber={index + 1}
								renderTextLayer={false}
								renderAnnotationLayer={false}
								width={Math.min(width - 32, 800)}
							/>
						</div>
					))}
				</ReactPdfDocument>
			</div>
		</div>
	)
})

function MyDocumentData() {
	return (
		<PDFRendererDocument>
			<PageTest />
		</PDFRendererDocument>
	)
}

function PageTest() {
	return (
		<>
			<Page>
				<Text>Page 1</Text>
			</Page>
			<Page>
				<Text>Page 2</Text>
			</Page>
		</>
	)
}

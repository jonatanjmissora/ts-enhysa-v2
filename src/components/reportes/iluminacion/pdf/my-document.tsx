import { memo, useEffect, useState } from "react"
import { Document, Font, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer"

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
import Page2 from "./page-2"
import Page3 from "./page-3"
import Page4 from "./page-4"
import Page5 from "./page-5"

export const MyDocument = memo(
	({
		reporte,
		areas,
		tecnico,
		empresa,
		instrumento,
	}: {
		reporte: ReporteIluminacionType
		areas: AreaIluminacionType[]
		tecnico: TecnicoType
		empresa: EmpresaType
		instrumento: InstrumentoType
	}) => {
		return (
			<>
				{/*<div className="flex justify-center w-full mb-6">
					 <DownloadButton
						reporte={reporte}
						areas={areas}
						tecnico={tecnico}
						empresa={empresa}
						instrumento={instrumento}
					/> 
				</div>*/}
				<PDFViewer
					width="100%"
					height="100%"
					className="min-h-svh w-full overflow-hidden"
				>
					<MyDocumentData
						reporte={reporte}
						areas={areas}
						tecnico={tecnico}
						empresa={empresa}
						instrumento={instrumento}
					/>
				</PDFViewer>
			</>
		)
	}
)

// function DownloadButton({
// 	reporte,
// 	areas,
// 	tecnico,
// 	empresa,
// 	instrumento,
// }: {
// 	reporte: ReporteIluminacionType
// 	areas: AreaIluminacionType[]
// 	tecnico: TecnicoType
// 	empresa: EmpresaType
// 	instrumento: InstrumentoType
// }) {
// 	const [show, setShow] = useState(false)

// useEffect(() => {
// 	const timer = setTimeout(() => setShow(true), 2500)
// 	return () => clearTimeout(timer)
// }, [])

// if (!show) {
// 	return (
// 		<span className="italic text-foreground/30 tracking-wider text-xs h-[46px] flex items-center">
// 			Preparando enlace de descarga...
// 		</span>
// 	)
// }

// return (
// 	<PDFDownloadLink
// 		document={
// 			<MyDocumentData
// 				reporte={reporte}
// 				areas={areas}
// 				tecnico={tecnico}
// 				empresa={empresa}
// 				instrumento={instrumento}
// 			/>
// 		}
// 		fileName={`Reporte Iluminacion ${empresa.razonSocial} - ${reporte.finishedAt?.toLocaleDateString("it-IT")}.pdf`}
// 	>
// 		{({ loading }) =>
// 			loading ? (
// 				<span className="italic text-foreground/50 animate-pulse tracking-wider text-xs h-[46px] flex items-center">
// 					Generando PDF...
// 				</span>
// 			) : (
// 				<span className="bg-primary/10 hover:bg-primary/20 text-primary py-3 px-10 rounded-lg tracking-wider text-sm ring-[1px] ring-primary/30 transition-colors duration-300">
// 					Descargar PDF
// 				</span>
// 			)
// 		}
// 	</PDFDownloadLink>
// )
// }

function MyDocumentData({
	reporte,
	areas,
	tecnico,
	empresa,
	instrumento,
}: {
	reporte: ReporteIluminacionType
	areas: AreaIluminacionType[]
	tecnico: TecnicoType
	empresa: EmpresaType
	instrumento: InstrumentoType
}) {
	return (
		<Document title={reporte.title}>
			<Page1
				reporte={reporte}
				tecnico={tecnico}
				empresa={empresa}
				instrumento={instrumento}
			/>
			<Page2 areas={areas} tecnico={tecnico} empresa={empresa} />
			<Page3 reporte={reporte} tecnico={tecnico} empresa={empresa} />
			<Page4 tecnico={tecnico} empresa={empresa} instrumento={instrumento} />
			<Page5 areas={areas} tecnico={tecnico} empresa={empresa} />
		</Document>
	)
}

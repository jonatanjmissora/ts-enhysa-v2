import { Document, Font, Page, Text, PDFViewer } from "@react-pdf/renderer"

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

export const MyDocument = ({
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
		<PDFViewer width="100%" height="100%" className="min-h-svh w-full">
			<Document title={reporte.title}>
				<Page1
					reporte={reporte}
					tecnico={tecnico}
					empresa={empresa}
					instrumento={instrumento}
				/>
				<Page2
					reporte={reporte}
					areas={areas}
					tecnico={tecnico}
					empresa={empresa}
				/>
				<Page3 reporte={reporte} tecnico={tecnico} empresa={empresa} />
			</Document>
		</PDFViewer>
	)
}

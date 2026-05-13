import { Document, Font, Page, Text, PDFViewer } from "@react-pdf/renderer"

Font.register({
	family: "Roboto",
	src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
})

import type { ReporteIluminacionType } from "../../../../../db/reportes/iluminacion/schema"

export const MyDocument = ({
	reporte,
}: {
	reporte: ReporteIluminacionType
}) => {
	return (
		<PDFViewer width="100%" height="100%" className="min-h-[75svh] w-full">
			<Document title={reporte.title}>
				<Page size="A4">
					<Text
						style={{
							width: "100%",
							textAlign: "center",
							fontSize: 12,
							margin: 10,
							fontWeight: "900",
						}}
					>
						Anexo 1
					</Text>
				</Page>
			</Document>
		</PDFViewer>
	)
}

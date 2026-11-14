import { useEffect, useRef, useState } from "react"
import { getImageUrlsServer } from "../../server/images/get-image-url-server"
import { isImageId } from "./image-value"
import type { EmpresaType } from "../../db/empresas/schema"
import type { TecnicoType } from "../../db/tecnicos/schema"
import type { InstrumentoType } from "../../db/instrumentos/schema"
import type { AreaIluminacionType } from "../../db/reportes/iluminacion/areas/schema"
import type { LocalizadaIluminacionType } from "../../db/reportes/iluminacion/localizadas/schema"

export type PdfImageData = {
	empresa: EmpresaType
	tecnico: TecnicoType
	instrumento: InstrumentoType
	areas: AreaIluminacionType[]
	localizadas: LocalizadaIluminacionType[]
}

const imageCache = new Map<string, Promise<string>>()

function uniqueUrls(data: PdfImageData): string[] {
	const urls = [
		data.empresa.logo,
		data.tecnico.matriculaImg,
		data.tecnico.firmaImg,
		data.tecnico.empresaLogo,
		...(data.instrumento.imagenesCalibracion ?? []),
		...(data.instrumento.imagenes ?? []),
		...(data.areas ?? []).flatMap(area => area.imagenes ?? []),
		...(data.localizadas ?? []).flatMap(localizada => localizada.imagenes ?? []),
	]

	return Array.from(
		new Set(urls.filter((url): url is string => typeof url === "string" && !!url))
	)
}

/**
 * Normaliza una imagen para el PDF.
 *
 * `@react-pdf/renderer` no aplica la orientación EXIF. El navegador sí la aplica
 * al dibujar un `<img>` en canvas, así que re-encodeamos a JPEG con la
 * orientación ya "horneada" y sin EXIF.
 */
async function normalizeImage(src: string): Promise<string> {
	if (!src || src.startsWith("data:")) return src
	if (!/^(https?:|blob:|\/)/i.test(src)) return src

	const cached = imageCache.get(src)
	if (cached) return cached

	const promise = (async () => {
		const image = new Image()
		image.crossOrigin = "anonymous"
		image.decoding = "async"
		image.src = src

		if (typeof image.decode === "function") {
			await image.decode()
		} else {
			await new Promise<void>((resolve, reject) => {
				image.onload = () => resolve()
				image.onerror = () => reject(new Error("No se pudo cargar la imagen"))
			})
		}

		const canvas = document.createElement("canvas")
		canvas.width = image.naturalWidth
		canvas.height = image.naturalHeight

		const context = canvas.getContext("2d")
		if (!context) return src

		// Fondo blanco: evita que los PNG con transparencia queden negros en JPEG.
		context.fillStyle = "#ffffff"
		context.fillRect(0, 0, canvas.width, canvas.height)
		context.drawImage(image, 0, 0)
		return canvas.toDataURL("image/jpeg", 0.92)
	})().catch(() => src)

	imageCache.set(src, promise)
	return promise
}

function mapImageValues(
	data: PdfImageData,
	map: (value: string) => string
): PdfImageData {
	return {
		...data,
		empresa: {
			...data.empresa,
			logo: map(data.empresa.logo),
		},
		tecnico: {
			...data.tecnico,
			matriculaImg: map(data.tecnico.matriculaImg),
			firmaImg: map(data.tecnico.firmaImg),
			empresaLogo: map(data.tecnico.empresaLogo),
		},
		instrumento: {
			...data.instrumento,
			imagenesCalibracion: (data.instrumento.imagenesCalibracion ?? []).map(
				map
			),
			imagenes: (data.instrumento.imagenes ?? []).map(map),
		},
		areas: (data.areas ?? []).map(area => ({
			...area,
			imagenes: (area.imagenes ?? []).map(map),
		})),
		localizadas: (data.localizadas ?? []).map(localizada => ({
			...localizada,
			imagenes: (localizada.imagenes ?? []).map(map),
		})),
	}
}

export async function normalizePdfImages(
	data: PdfImageData
): Promise<PdfImageData> {
	const rawUrls = uniqueUrls(data)
	const ids = rawUrls.filter(isImageId)

	let idUrls: Record<string, string> = {}
	if (ids.length > 0) {
		try {
			idUrls = await getImageUrlsServer({ data: { ids } })
		} catch {
			idUrls = {}
		}
	}

	const withUrls = mapImageValues(data, value =>
		isImageId(value) ? (idUrls[value] ?? value) : value
	)

	const urls = uniqueUrls(withUrls)
	const resolved = new Map<string, string>()

	await Promise.all(
		urls.map(async url => {
			resolved.set(url, await normalizeImage(url))
		})
	)

	return mapImageValues(withUrls, value => resolved.get(value) ?? value)
}

export function usePdfImages(data: PdfImageData): PdfImageData | null {
	const [normalized, setNormalized] = useState<PdfImageData | null>(null)
	const dataRef = useRef(data)
	dataRef.current = data

	const urlsKey = uniqueUrls(data).join("|")

	// biome-ignore lint/correctness/useExhaustiveDependencies: se re-normaliza solo cuando cambian las URLs de imágenes
	useEffect(() => {
		let cancelled = false

		void normalizePdfImages(dataRef.current)
			.then(result => {
				if (!cancelled) setNormalized(result)
			})
			.catch(() => {
				if (!cancelled) setNormalized(dataRef.current)
			})

		return () => {
			cancelled = true
		}
	}, [urlsKey])

	return normalized
}

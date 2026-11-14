export const MAX_IMAGE_DIMENSION = 3000
export const JPEG_QUALITY = 0.88

const normalizedDimensions = new Map<
	string,
	{ width: number; height: number }
>()

/** Dimensiones de una imagen normalizada, por nombre de archivo. */
export function getNormalizedImageDimensions(
	name: string
): { width: number; height: number } | undefined {
	return normalizedDimensions.get(name)
}

type LoadedImage = {
	source: CanvasImageSource
	width: number
	height: number
	close: () => void
}

async function loadImage(file: File): Promise<LoadedImage> {
	if (typeof createImageBitmap === "function") {
		try {
			const bitmap = await createImageBitmap(file, {
				imageOrientation: "from-image",
			})
			return {
				source: bitmap,
				width: bitmap.width,
				height: bitmap.height,
				close: () => bitmap.close(),
			}
		} catch {
			// Fallback para navegadores sin createImageBitmap con orientación.
		}
	}

	const url = URL.createObjectURL(file)
	try {
		const image = new Image()
		image.decoding = "async"
		image.src = url

		if (typeof image.decode === "function") {
			await image.decode()
		} else {
			await new Promise<void>((resolve, reject) => {
				image.onload = () => resolve()
				image.onerror = () => reject(new Error("No se pudo cargar la imagen"))
			})
		}

		return {
			source: image,
			width: image.naturalWidth,
			height: image.naturalHeight,
			close: () => URL.revokeObjectURL(url),
		}
	} catch (error) {
		URL.revokeObjectURL(url)
		throw error
	}
}

function canvasToBlob(
	canvas: HTMLCanvasElement,
	type: string,
	quality: number
): Promise<Blob | null> {
	return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}

/**
 * Normaliza una imagen elegida en la web antes de subirla a UploadThing:
 * - aplica la orientación EXIF (canvas/createImageBitmap)
 * - redimensiona si supera MAX_IMAGE_DIMENSION
 * - re-encodea a JPEG sin EXIF
 *
 * Es el equivalente web de `normalizeImage` de la APK.
 */
export async function normalizeImageFile(file: File): Promise<File> {
	if (!file.type.startsWith("image/")) return file

	let loaded: LoadedImage | null = null

	try {
		loaded = await loadImage(file)

		const maxSide = Math.max(loaded.width, loaded.height)
		const scale = maxSide > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / maxSide : 1
		const width = Math.max(1, Math.round(loaded.width * scale))
		const height = Math.max(1, Math.round(loaded.height * scale))

		const canvas = document.createElement("canvas")
		canvas.width = width
		canvas.height = height

		const context = canvas.getContext("2d")
		if (!context) return file

		// Fondo blanco para PNG con transparencia (JPEG no tiene alpha).
		context.fillStyle = "#ffffff"
		context.fillRect(0, 0, width, height)
		context.drawImage(loaded.source, 0, 0, width, height)

		const blob = await canvasToBlob(canvas, "image/jpeg", JPEG_QUALITY)
		if (!blob) return file

		const token =
			typeof crypto !== "undefined" && "randomUUID" in crypto
				? crypto.randomUUID().slice(0, 8)
				: Math.random().toString(36).slice(2, 10)
		const name = `${file.name.replace(/\.[^.]+$/, "")}-${token}.jpg`
		normalizedDimensions.set(name, { width, height })

		return new File([blob], name, {
			type: "image/jpeg",
			lastModified: Date.now(),
		})
	} catch {
		return file
	} finally {
		loaded?.close()
	}
}

export async function normalizeImageFiles(files: File[]): Promise<File[]> {
	return Promise.all(files.map(normalizeImageFile))
}

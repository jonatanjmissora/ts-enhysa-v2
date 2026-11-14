const IMAGE_ID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** `true` si el valor es un `expo_images.id` (UUID) y no una URL. */
export function isImageId(value: string | null | undefined): boolean {
	return typeof value === "string" && IMAGE_ID_REGEX.test(value)
}

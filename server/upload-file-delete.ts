import { UTApi } from "uploadthing/server"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

const fileKeyValidator = z.object({
	fileKey: z.string(),
})

export const deleteUploadthingFile = createServerFn({ method: "POST" })
	.inputValidator(fileKeyValidator)
	.handler(async ({ data }) => {
		const utapi = new UTApi()
		const res = await utapi.deleteFiles(data.fileKey)

		return { success: res.deletedCount === 1 }
	})

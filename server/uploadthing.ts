import { createUploadthing, type FileRouter } from "uploadthing/server"

const f = createUploadthing()

export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "2MB",
			maxFileCount: 1,
		},
	}).onUploadComplete(async ({ file }) => {
		return {
			url: file.ufsUrl,
		}
	}),

	pdfUploader: f({
		pdf: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	}).onUploadComplete(async ({ file }) => {
		return {
			url: file.ufsUrl,
		}
	}),

	mixedUploader: f({
		image: {
			maxFileSize: "2MB",
			maxFileCount: 4,
		},
		pdf: {
			maxFileSize: "4MB",
			maxFileCount: 4,
		},
	}).onUploadComplete(async ({ file }) => {
		return {
			url: file.ufsUrl,
		}
	}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
export type OurFilesRouter = typeof ourFileRouter


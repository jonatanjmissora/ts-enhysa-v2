import { createServerFn } from "@tanstack/react-start"
import { getCpshFormData } from "@/lib/cpsh/is-registered"

export const getCpshTokenServer = createServerFn({ method: "GET" }).handler(
	async (): Promise<{ csrfToken: string; cookies: string }> => {
		return await getCpshFormData()
	}
)

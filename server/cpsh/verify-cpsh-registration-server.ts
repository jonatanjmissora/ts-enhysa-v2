import { createServerFn } from "@tanstack/react-start"
import { verifyProfessionalRegistration } from "@/lib/cpsh/is-registered"

export const verifyCpshRegistrationServer = createServerFn({ method: "POST" })
	.inputValidator((d: { dniOrCuit: string }) => d)
	.handler(async ({ data }) => {
		return await verifyProfessionalRegistration(data.dniOrCuit)
	})

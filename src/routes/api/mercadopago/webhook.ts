import { createFileRoute } from "@tanstack/react-router"
import { handleWebhook } from "../../../../server/mercadopago/webhook"

export const Route = createFileRoute("/api/mercadopago/webhook")({
	server: {
		handlers: {
			POST: ({ request }) => handleWebhook(request),
		},
	},
})

import { protectedServerFn } from "@/lib/protected-server-fn"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { Preference } from "mercadopago"
import { mpClient } from "./config"

export const createPreferenceServer = createServerFn({ method: "POST" })
	.validator((data: { planId: string; title: string; price: number }) => data)
	.handler(async ({ data }) => {
		const request = getRequest()
		const session = await protectedServerFn(request)

		const baseUrl = process.env.BETTER_AUTH_BASE_URL
		const notificationUrl = `${baseUrl}/api/mercadopago/webhook`
		console.log("[MP] notification_url:", notificationUrl)

		try {
			const preference = new Preference(mpClient)
			const result = await preference.create({
				body: {
					items: [
						{
							id: data.planId,
							title: data.title,
							description: `Plan ${data.planId} - EnHySa`,
							quantity: 1,
							unit_price: data.price,
							currency_id: "ARS",
						},
					],
					external_reference: session.user.id,
					metadata: { plan_id: data.planId },
					notification_url: notificationUrl,
					back_urls: {
						success: `${baseUrl}/suscripcion?status=approved`,
						failure: `${baseUrl}/suscripcion?status=failure`,
						pending: `${baseUrl}/suscripcion?status=pending`,
					},
					auto_return: "approved",
				},
			})
			// console.log("[MP] Preference created:", JSON.stringify(result, null, 2))
			return {
				preferenceId: result.id,
				initPoint: result.init_point,
				sandboxInitPoint: result.sandbox_init_point,
			}
		} catch (mpErr) {
			console.error("[MP] Error creating preference:", mpErr)
			throw new Error(
				`MP error: ${mpErr instanceof Error ? mpErr.message : String(mpErr)}`
			)
		}
	})

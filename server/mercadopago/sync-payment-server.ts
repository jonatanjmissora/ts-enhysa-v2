import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { protectedServerFn } from "@/lib/protected-server-fn"
import { syncPayment } from "./sync-payment"

export const syncPaymentServer = createServerFn({ method: "POST" })
	.validator((d: { paymentId: number }) => d)
	.handler(async ({ data }) => {
		const request = getRequest()
		await protectedServerFn(request)
		return await syncPayment(data.paymentId)
	})

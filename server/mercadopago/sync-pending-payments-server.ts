import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { protectedServerFn } from "@/lib/protected-server-fn"
import { syncPendingPayments } from "./sync-pending-payments"

export const syncPendingPaymentsServer = createServerFn({ method: "GET" }).handler(async () => {
	const request = getRequest()
	const session = await protectedServerFn(request)
	return await syncPendingPayments(session.user.id)
})

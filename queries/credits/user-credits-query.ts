import { queryOptions } from "@tanstack/react-query"
import { getUserCreditsServer } from "../../server/credits/get-user-credits-server"

export const userCreditsOptions = queryOptions({
	queryKey: ["user-credits"],
	queryFn: getUserCreditsServer,
	staleTime: 1000 * 60 * 5,
})

import { queryOptions } from "@tanstack/react-query"
import { getTecnicosServer } from "../../server/tecnico/get-tecnicos-server"

export const tecnicosQueryOptions = queryOptions({
	queryKey: ["tecnicos"],
	queryFn: () => getTecnicosServer(),
})

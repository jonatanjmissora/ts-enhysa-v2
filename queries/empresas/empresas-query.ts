import { queryOptions } from "@tanstack/react-query"
import { getEmpresasServer } from "../../server/empresas/get-empresas-server"

export const empresasQueryOptions = queryOptions({
	queryKey: ["empresas"],
	queryFn: () => getEmpresasServer(),
})

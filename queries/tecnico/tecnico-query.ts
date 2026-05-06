import { queryOptions } from "@tanstack/react-query"
import { getTecnicoServer } from "../../server/tecnico/get-tecnico-server"

export const tecnicoQueryOptions = queryOptions({
	queryKey: ["tecnico"],
	queryFn: () => getTecnicoServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

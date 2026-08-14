import { queryOptions } from "@tanstack/react-query"
import { empresasRepository } from "../../repositories/empresas/empresas-repository"

export const empresasQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["empresas", userId],
		queryFn: () => empresasRepository.get(userId),
	})

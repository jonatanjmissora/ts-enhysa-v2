import { queryOptions } from "@tanstack/react-query"
import { instrumentosRepository } from "../../repositories/instrumentos/instrumentos-repository"

export const instrumentosQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["instrumentos", userId],
		queryFn: () => instrumentosRepository.get(userId),
	})

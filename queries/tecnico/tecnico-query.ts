import { queryOptions } from "@tanstack/react-query"
import { tecnicoRepository } from "../../repositories/tecnicos/tecnico-repository"

export const tecnicoQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["tecnico", userId],
		queryFn: () => tecnicoRepository.get(userId),
	})

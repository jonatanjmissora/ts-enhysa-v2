import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTecnicoServer } from "../../server/tecnico/create-tecnico-server"

export function useCreateTecnico() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createTecnicoServer,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tecnico"] })
		},
	})
}

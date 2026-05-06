import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TecnicoType } from "../../db/tecnicos/schema"
import { updateTecnicoServer } from "../../server/tecnico/update-tecnico-server"

export function useUpdateTecnico() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateTecnicoServer,
		onSuccess: data => {
			queryClient.setQueryData<TecnicoType>(["tecnico"], data)
		},
	})
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InstrumentoType } from "../../db/instrumentos/schema"
import { deleteInstrumentoServer } from "../../server/instrumentos/delete-instrumento-server"

export function useDeleteInstrumento(instrumentoId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: { id: string } }) =>
			deleteInstrumentoServer({ data }),
		onSuccess: () => {
			queryClient.setQueryData<InstrumentoType[]>(["instrumentos"], oldData => {
				if (!oldData) return oldData
				return oldData.filter(item => item.id !== instrumentoId)
			})
		},
	})
}

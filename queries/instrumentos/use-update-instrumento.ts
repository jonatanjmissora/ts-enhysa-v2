import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { InstrumentoType } from "../../db/instrumentos/schema"
import { updateInstrumentoServer } from "../../server/instrumentos/update-instrumento-server"

export function useUpdateInstrumento() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateInstrumentoServer,
		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<InstrumentoType[]>(["instrumentos"], oldData => {
				if (!oldData) return oldData
				const oldInstrumento = oldData.find(
					oldInstrumento => oldInstrumento.id === data.id
				)
				if (!oldInstrumento) return oldData
				return oldData.map(oldInstrumento =>
					oldInstrumento.id === data.id ? data : oldInstrumento
				)
			})
		},
	})
}

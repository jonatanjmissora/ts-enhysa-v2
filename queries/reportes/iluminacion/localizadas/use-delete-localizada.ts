import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/delete-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"

export function useDeleteLocalizada(localizadaId: string, reportId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: { id: string } }) =>
			deleteLocalizadaServer({ data }),
		onSuccess: () => {
			queryClient.setQueryData<LocalizadaIluminacionType[]>(
				["localizadas-iluminacion", reportId],
				oldData => {
					if (!oldData) return oldData
					return oldData.filter(item => item.id !== localizadaId)
				}
			)
			queryClient.setQueryData<LocalizadaIluminacionType[]>(
				["localizada-iluminacion", localizadaId],
				undefined
			)
		},
	})
}

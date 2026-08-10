import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/update-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"
import type { UpdateLocalizadaType } from "../../../../db/reportes/iluminacion/localizadas/localizada-validator"

export function useUpdateLocalizada() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: UpdateLocalizadaType }) =>
			updateLocalizadaServer({ data }),
		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<LocalizadaIluminacionType[]>(
				["localizadas-iluminacion", data.reportId],
				oldData => {
					if (!oldData) return oldData
					const oldLocalizada = oldData.find(
						oldLocalizada => oldLocalizada.id === data.id
					)
					if (!oldLocalizada) return oldData
					return oldData.map(oldLocalizada =>
						oldLocalizada.id === data.id ? data : oldLocalizada
					)
				}
			)
			queryClient.setQueryData<LocalizadaIluminacionType>(
				["localizada-iluminacion", data.id],
				data
			)
		},
	})
}

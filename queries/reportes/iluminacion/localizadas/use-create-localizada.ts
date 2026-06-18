import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sortedByName } from "#/lib/utils"
import { createLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/create-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"

export function useCreateLocalizada() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createLocalizadaServer,
		onSuccess: data => {
			// queryClient.invalidateQueries({ queryKey: ["empresas"] })
			queryClient.setQueryData<LocalizadaIluminacionType[]>(
				["localizadas-iluminacion", data.reportId],
				oldData => {
					if (!oldData) return oldData
					return sortedByName([data, ...oldData])
				}
			)
			queryClient.setQueryData(["localizada-iluminacion", data.id], data)
		},
	})
}

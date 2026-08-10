import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sortedByName } from "#/lib/utils"
import { createLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/create-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"
import type { LocalizadaServerType } from "../../../../db/reportes/iluminacion/localizadas/localizada-validator"

export function useCreateLocalizada() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: LocalizadaServerType }) =>
			createLocalizadaServer({ data }),
		onSuccess: data => {
			if (!data) return
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

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sortedByName } from "#/lib/utils"
import { createAreaServer } from "../../../../server/reportes/iluminacion/areas/create-area-server"
import type { AreaIluminacionType } from "../../../../db/schema"

export function useCreateArea() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createAreaServer,
		onSuccess: data => {
			// queryClient.invalidateQueries({ queryKey: ["empresas"] })
			queryClient.setQueryData<AreaIluminacionType[]>(
				["areas_iluminacion", data.reportId],
				oldData => {
					if (!oldData) return oldData
					return sortedByName([data, ...oldData])
				}
			)
			queryClient.setQueryData(["area-iluminacion", data.id], data)
		},
	})
}

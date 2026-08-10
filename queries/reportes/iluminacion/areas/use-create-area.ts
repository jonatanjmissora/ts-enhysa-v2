import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sortedByName } from "#/lib/utils"
import { createAreaServer } from "../../../../server/reportes/iluminacion/areas/create-area-server"
import type { AreaIluminacionType } from "../../../../db/schema"
import type { AreaServerType } from "../../../../db/reportes/iluminacion/areas/area-validator"

export function useCreateArea() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: AreaServerType }) => createAreaServer({ data }),
		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<AreaIluminacionType[]>(
				["areas-iluminacion", data.reportId],
				oldData => {
					if (!oldData) return oldData
					return sortedByName([data, ...oldData])
				}
			)
			queryClient.setQueryData(["area-iluminacion", data.id], data)
		},
	})
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAreaServer } from "../../../../server/reportes/iluminacion/areas/update-area-server"
import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"

export function useUpdateArea() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateAreaServer,
		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<AreaIluminacionType[]>(
				["areas_iluminacion", data.reportId],
				oldData => {
					if (!oldData) return oldData
					const oldArea = oldData.find(oldArea => oldArea.id === data.id)
					if (!oldArea) return oldData
					return oldData.map(oldArea =>
						oldArea.id === data.id ? data : oldArea
					)
				}
			)
		},
	})
}

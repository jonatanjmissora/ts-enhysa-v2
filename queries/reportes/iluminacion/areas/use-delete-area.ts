import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAreaServer } from "../../../../server/reportes/iluminacion/areas/delete-area-server"
import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"

export function useDeleteArea(areaId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: { id: string } }) =>
			deleteAreaServer({ data }),
		onSuccess: () => {
			queryClient.setQueryData<AreaIluminacionType[]>(
				["areas_iluminacion"],
				oldData => {
					if (!oldData) return oldData
					return oldData.filter(item => item.id !== areaId)
				}
			)
		},
	})
}

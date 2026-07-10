import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAreaServer } from "../../../../server/reportes/iluminacion/areas/delete-area-server"
import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"
import {
	addMutationToQueue,
	removeEntityFromCache,
} from "@/lib/offline/db"

export function useDeleteArea(areaId: string, reportId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ data }: { data: { id: string } }) => {
			try {
				return await deleteAreaServer({ data })
			} catch {
				await addMutationToQueue({
					entity: "areas-iluminacion-cache",
					type: "delete",
					payload: data,
				})
				await removeEntityFromCache("areas-iluminacion-cache", data.id)
				return data
			}
		},
        onSuccess: () => {
            queryClient.setQueryData<AreaIluminacionType[]>(
                ["areas-iluminacion", reportId],
                oldData => {
                    if (!oldData) return oldData
                    return oldData.filter(item => item.id !== areaId)
                }
            )
            queryClient.setQueryData<AreaIluminacionType[]>(["area-iluminacion", areaId], undefined)
        },
    })
}

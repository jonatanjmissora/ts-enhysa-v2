import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteAreaServer } from "../../../../server/reportes/iluminacion/areas/delete-area-server"
import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"
import {
	addMutationToQueue,
	removeEntityFromCache,
} from "@/lib/offline/db"

const MUTATION_TIMEOUT = 8_000

export function useDeleteArea(areaId: string, reportId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ data }: { data: { id: string } }) => {
			if (typeof window !== "undefined" && !navigator.onLine) {
				await addMutationToQueue({
					entity: "areas-iluminacion-cache",
					type: "delete",
					payload: data,
				})
				await removeEntityFromCache("areas-iluminacion-cache", data.id)
				return data
			}
			try {
				return await Promise.race([
					deleteAreaServer({ data }),
					new Promise<never>((_, reject) =>
						setTimeout(() => reject(new Error("timeout")), MUTATION_TIMEOUT)
					),
				])
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

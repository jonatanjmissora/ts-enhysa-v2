import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAreaServer } from "../../../../server/reportes/iluminacion/areas/update-area-server"
import type { AreaIluminacionType } from "../../../../db/reportes/iluminacion/areas/schema"
import type { UpdateAreaType } from "../../../../db/reportes/iluminacion/areas/area-validator"
import {
	addMutationToQueue,
	putEntityInCache,
} from "@/lib/offline/db"

export function useUpdateArea() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ data }: { data: UpdateAreaType }) => {
			try {
				return await updateAreaServer({ data })
			} catch {
				const updatedEntity: AreaIluminacionType = { ...data }
				await addMutationToQueue({
					entity: "areas-iluminacion-cache",
					type: "update",
					payload: updatedEntity,
				})
				await putEntityInCache("areas-iluminacion-cache", updatedEntity)
				return updatedEntity
			}
		},
		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<AreaIluminacionType[]>(
				["areas-iluminacion", data.reportId],
				oldData => {
					if (!oldData) return oldData
					const oldArea = oldData.find(oldArea => oldArea.id === data.id)
					if (!oldArea) return oldData
					return oldData.map(oldArea =>
						oldArea.id === data.id ? data : oldArea
					)
				}
			)
			queryClient.setQueryData<AreaIluminacionType>(["area-iluminacion", data.id], data)
		},
	})
}

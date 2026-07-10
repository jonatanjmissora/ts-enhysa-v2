import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/update-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"
import type { UpdateLocalizadaType } from "../../../../db/reportes/iluminacion/localizadas/localizada-validator"
import {
	addMutationToQueue,
	putEntityInCache,
} from "@/lib/offline/db"

export function useUpdateLocalizada() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ data }: { data: UpdateLocalizadaType }) => {
			try {
				return await updateLocalizadaServer({ data })
			} catch {
				const updatedEntity: LocalizadaIluminacionType = {
					...data,
				}
				await addMutationToQueue({
					entity: "localizadas-iluminacion-cache",
					type: "update",
					payload: updatedEntity,
				})
				await putEntityInCache("localizadas-iluminacion-cache", updatedEntity)
				return updatedEntity
			}
		},
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

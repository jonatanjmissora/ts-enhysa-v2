import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/update-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"
import type { UpdateLocalizadaType } from "../../../../db/reportes/iluminacion/localizadas/localizada-validator"
import {
	addMutationToQueue,
	putEntityInCache,
} from "@/lib/offline/db"

const MUTATION_TIMEOUT = 8_000

export function useUpdateLocalizada() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ data }: { data: UpdateLocalizadaType }) => {
			if (typeof window !== "undefined" && !navigator.onLine) {
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
			try {
				return await Promise.race([
					updateLocalizadaServer({ data }),
					new Promise<never>((_, reject) =>
						setTimeout(() => reject(new Error("timeout")), MUTATION_TIMEOUT)
					),
				])
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

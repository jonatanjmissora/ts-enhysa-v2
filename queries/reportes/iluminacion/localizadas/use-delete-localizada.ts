import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/delete-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"
import {
	addMutationToQueue,
	removeEntityFromCache,
} from "@/lib/offline/db"

const MUTATION_TIMEOUT = 8_000

export function useDeleteLocalizada(localizadaId: string, reportId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ data }: { data: { id: string } }) => {
			if (typeof window !== "undefined" && !navigator.onLine) {
				await addMutationToQueue({
					entity: "localizadas-iluminacion-cache",
					type: "delete",
					payload: data,
				})
				await removeEntityFromCache("localizadas-iluminacion-cache", data.id)
				return data
			}
			try {
				return await Promise.race([
					deleteLocalizadaServer({ data }),
					new Promise<never>((_, reject) =>
						setTimeout(() => reject(new Error("timeout")), MUTATION_TIMEOUT)
					),
				])
			} catch {
				await addMutationToQueue({
					entity: "localizadas-iluminacion-cache",
					type: "delete",
					payload: data,
				})
				await removeEntityFromCache("localizadas-iluminacion-cache", data.id)
				return data
			}
		},
		onSuccess: () => {
			queryClient.setQueryData<LocalizadaIluminacionType[]>(
				["localizadas-iluminacion", reportId],
				oldData => {
					if (!oldData) return oldData
					return oldData.filter(item => item.id !== localizadaId)
				}
			)
			queryClient.setQueryData<LocalizadaIluminacionType[]>(
				["localizada-iluminacion", localizadaId],
				undefined
			)
		},
	})
}

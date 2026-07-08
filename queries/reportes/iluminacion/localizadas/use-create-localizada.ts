import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sortedByName } from "#/lib/utils"
import { createLocalizadaServer } from "../../../../server/reportes/iluminacion/localizadas/create-localizada-server"
import type { LocalizadaIluminacionType } from "../../../../db/reportes/iluminacion/localizadas/schema"
import type { LocalizadaServerType } from "../../../../db/reportes/iluminacion/localizadas/localizada-validator"
import {
	addMutationToQueue,
	putEntityInCache,
} from "@/lib/offline/db"

const MUTATION_TIMEOUT = 8_000

export function useCreateLocalizada() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ data }: { data: LocalizadaServerType }) => {
			if (typeof window !== "undefined" && !navigator.onLine) {
				const newEntity: LocalizadaIluminacionType = {
					...data,
					userId: "",
				}
				await addMutationToQueue({
					entity: "localizadas-iluminacion-cache",
					type: "create",
					payload: newEntity,
				})
				await putEntityInCache("localizadas-iluminacion-cache", newEntity)
				return newEntity
			}
			try {
				return await Promise.race([
					createLocalizadaServer({ data }),
					new Promise<never>((_, reject) =>
						setTimeout(() => reject(new Error("timeout")), MUTATION_TIMEOUT)
					),
				])
			} catch {
				const newEntity: LocalizadaIluminacionType = {
					...data,
					userId: "",
				}
				await addMutationToQueue({
					entity: "localizadas-iluminacion-cache",
					type: "create",
					payload: newEntity,
				})
				await putEntityInCache("localizadas-iluminacion-cache", newEntity)
				return newEntity
			}
		},
		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<LocalizadaIluminacionType[]>(
				["localizadas-iluminacion", data.reportId],
				oldData => {
					if (!oldData) return oldData
					return sortedByName([data, ...oldData])
				}
			)
			queryClient.setQueryData(["localizada-iluminacion", data.id], data)
		},
	})
}

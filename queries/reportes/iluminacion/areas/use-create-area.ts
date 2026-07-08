import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sortedByName } from "#/lib/utils"
import { createAreaServer } from "../../../../server/reportes/iluminacion/areas/create-area-server"
import type { AreaIluminacionType } from "../../../../db/schema"
import type { AreaServerType } from "../../../../db/reportes/iluminacion/areas/area-validator"
import {
	addMutationToQueue,
	putEntityInCache,
} from "@/lib/offline/db"

const MUTATION_TIMEOUT = 8_000

export function useCreateArea() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ data }: { data: AreaServerType }) => {
			if (typeof window !== "undefined" && !navigator.onLine) {
				const newEntity: AreaIluminacionType = {
					...data,
					userId: "",
				}
				await addMutationToQueue({
					entity: "areas-iluminacion-cache",
					type: "create",
					payload: newEntity,
				})
				await putEntityInCache("areas-iluminacion-cache", newEntity)
				return newEntity
			}
			try {
				return await Promise.race([
					createAreaServer({ data }),
					new Promise<never>((_, reject) =>
						setTimeout(() => reject(new Error("timeout")), MUTATION_TIMEOUT)
					),
				])
			} catch {
				const newEntity: AreaIluminacionType = {
					...data,
					userId: "",
				}
				await addMutationToQueue({
					entity: "areas-iluminacion-cache",
					type: "create",
					payload: newEntity,
				})
				await putEntityInCache("areas-iluminacion-cache", newEntity)
				return newEntity
			}
		},
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

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { unlockReporteServer } from "../../../server/reportes/iluminacion/unlock-reporte-server"

export function useUnlockReporte() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: unlockReporteServer,

		onSuccess: (_data, variables) => {
		queryClient.setQueryData(["reporte-iluminacion", variables.data.reporteId], old => {
			if (!old) return old
			return { ...old, creditConsumed: true, creditConsumedAt: new Date() } as typeof old
		})

		queryClient.setQueryData<number>(["user-credits"], old => {
			return Math.max(0, (old ?? 0) - 1)
		})

			queryClient.invalidateQueries({
				queryKey: ["reporte-iluminacion", variables.data.reporteId],
			})
			queryClient.invalidateQueries({
				queryKey: ["user-credits"],
			})
		},
	})
}

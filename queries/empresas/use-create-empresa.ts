import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { EmpresaType } from "../../db/empresas/schema"
import { createEmpresaServer } from "../../server/empresas/create-empresa-server"
import { sortedByRazonSocial } from "#/lib/utils"

export function useCreateEmpresa() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createEmpresaServer,
		onSuccess: data => {
			// queryClient.invalidateQueries({ queryKey: ["empresas"] })
			queryClient.setQueryData<EmpresaType[]>(["empresas"], oldData => {
				if (!oldData) return oldData
				return sortedByRazonSocial([data, ...oldData])
			})
		},
	})
}

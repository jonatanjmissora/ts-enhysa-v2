import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { EmpresaType } from "../../db/empresas/schema"
import type { EmpresaFormType } from "../../db/empresas/empresa-validator"
import { createEmpresaServer } from "../../server/empresas/create-empresa-server"
import { sortedByRazonSocial } from "#/lib/utils"

export function useCreateEmpresa() {
  const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: EmpresaFormType }) => createEmpresaServer({ data }),
		onSuccess: data => {
			queryClient.setQueryData<EmpresaType[]>(["empresas"], oldData => {
				if (!oldData) return oldData
				return sortedByRazonSocial([data, ...oldData])
			})
		},
	})
}

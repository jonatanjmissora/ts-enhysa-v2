import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { EmpresaType } from "../../db/empresas/schema"
import type { UpdateEmpresaType } from "../../db/empresas/empresa-validator"
import { updateEmpresaServer } from "../../server/empresas/update-empresa-server"

export function useUpdateEmpresa() {
  const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: UpdateEmpresaType }) =>
			updateEmpresaServer({ data }),
		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<EmpresaType>(["empresas", data.id], data)
			queryClient.setQueryData<EmpresaType[]>(["empresas"], old =>
				old ? old.map(e => (e.id === data.id ? data : e)) : old
			)
		},
	})
}

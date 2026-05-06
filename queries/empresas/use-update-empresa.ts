import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { EmpresaType } from "../../db/empresas/schema"
import { updateEmpresaServer } from "../../server/empresas/update-empresa-server"

export function useUpdateEmpresa() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateEmpresaServer,
		onSuccess: data => {
			if (!data) return
			queryClient.setQueryData<EmpresaType[]>(["empresas"], oldData => {
				if (!oldData) return oldData
				const oldEmpresa = oldData.find(oldEmpresa => oldEmpresa.id === data.id)
				if (!oldEmpresa) return oldData
				return oldData.map(oldEmpresa =>
					oldEmpresa.id === data.id ? data : oldEmpresa
				)
			})
		},
	})
}

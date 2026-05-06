import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { EmpresaType } from "../../db/empresas/schema"
import { deleteEmpresaServer } from "../../server/empresas/delete-empresa-server"

export function useDeleteEmpresa(empresaId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ data }: { data: { id: string } }) =>
			deleteEmpresaServer({ data }),
		onSuccess: () => {
			queryClient.setQueryData<EmpresaType[]>(["empresas"], oldEmpresas => {
				if (!oldEmpresas) return oldEmpresas
				return oldEmpresas.filter(item => item.id !== empresaId)
			})
		},
	})
}

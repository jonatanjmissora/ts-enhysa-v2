import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { getEmpresasServer } from "../../server/empresas/get-empresas-server"
import { getEmpresaServer } from "../../server/empresas/get-empresa-server"
import type { EmpresaType } from "../../db/empresas/schema"

export const empresasQueryOptions = queryOptions({
	queryKey: ["empresas"],
	queryFn: () => getEmpresasServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

export const empresaQueryOptions = (id: string, tecnicoId: string) => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["empresa", id],

		queryFn: () => getEmpresaServer({ data: { id, tecnicoId } }), // BACKUP

		initialData: () => {
			const empresas = queryClient.getQueryData<EmpresaType[]>(["empresas"])
			return empresas?.find(item => item.id === id)
		},
	})
}

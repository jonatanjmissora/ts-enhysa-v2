import { queryOptions, useQueryClient } from "@tanstack/react-query"
import type { EmpresaType } from "../../db/empresas/schema"
import { getEmpresaServer } from "../../server/empresas/get-empresa-server"
import { getInstrumentosServer } from "../../server/instrumentos/get-instrumentos-server"

export const instrumentosQueryOptions = queryOptions({
	queryKey: ["instrumentos"],
	queryFn: () => getInstrumentosServer(),
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

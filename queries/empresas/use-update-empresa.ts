import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { EmpresaType } from "../../db/empresas/schema"
import { updateEmpresaServer } from "../../server/empresas/update-empresa-server"
import { sortedByRazonSocial } from "#/lib/utils"
import { addMutationToQueue, putEntityInCache } from "@/lib/offline/db"

export function useUpdateEmpresa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ data }: { data: EmpresaType }) => {
      try {
        return await updateEmpresaServer({ data })
      } catch {
        // Offline fallback
        await addMutationToQueue({ 
          entity: "empresas-cache", 
          type: "update", 
          payload: data 
        })
        await putEntityInCache("empresas-cache", data)
        return data
      }
    },
    onSuccess: data => {
      if (!data) return
      queryClient.setQueryData<EmpresaType>(["empresas", data.id], data)
      queryClient.setQueryData<EmpresaType[]>(["empresas"], old => 
        old ? old.map(e => e.id === data.id ? data : e) : old
      )
    },
  })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { EmpresaType } from "../../db/empresas/schema"
import { createEmpresaServer } from "../../server/empresas/create-empresa-server"
import { sortedByRazonSocial } from "#/lib/utils"
import { addMutationToQueue, putEntityInCache } from "@/lib/offline/db"

export function useCreateEmpresa() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ data }: { data: EmpresaType }) => {
      try {
        return await createEmpresaServer({ data })
      } catch {
        // Offline fallback
        const newEntity: EmpresaType = { 
          ...data, 
          id: crypto.randomUUID() 
        } // Temporary ID
        await addMutationToQueue({ 
          entity: "empresas-cache", 
          type: "create", 
          payload: newEntity 
        })
        await putEntityInCache("empresas-cache", newEntity)
        return newEntity
      }
    },
    onSuccess: data => {
      // queryClient.invalidateQueries({ queryKey: [\"empresas\"] })
      queryClient.setQueryData<EmpresaType[]>(["empresas"], oldData => {
        if (!oldData) return oldData
        return sortedByRazonSocial([data, ...oldData])
      })
    },
  })
}
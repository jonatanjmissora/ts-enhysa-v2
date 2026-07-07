import { queryOptions } from "@tanstack/react-query"
import { getTecnicoServer } from "../../server/tecnico/get-tecnico-server"
import {
  putEntityInCache,
  getCachedEntityList,
} from "@/lib/offline/db"

export const tecnicoQueryOptions = queryOptions({
  queryKey: ["tecnico"],
  queryFn: async () => {
    try {
      const data = await getTecnicoServer()
      if (typeof window !== "undefined" && data) await putEntityInCache("tecnicos-cache", data)
      return data
    } catch (error) {
      if (typeof window !== "undefined" && !navigator.onLine) {
        const cached = await getCachedEntityList("tecnicos-cache")
        if (cached.length > 0) return cached
      }
      throw error
    }
  },
  networkMode: "always",
  // refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
import { queryOptions } from "@tanstack/react-query"
import { getTecnicoServer } from "../../server/tecnico/get-tecnico-server"
import {
  putEntityInCache,
  getCachedEntityList,
} from "@/lib/offline/db"
import { OfflineNoCacheError } from "@/lib/offline/errors"

export const tecnicoQueryOptions = queryOptions({
  queryKey: ["tecnico"],
  queryFn: async () => {
    try {
      const data = await getTecnicoServer()
      if (typeof window !== "undefined" && data) await putEntityInCache("tecnicos-cache", data)
      return data
    } catch {
      if (typeof window !== "undefined") {
        const cached = await getCachedEntityList("tecnicos-cache")
        if (cached.length > 0) return cached
      }
      throw new OfflineNoCacheError()
    }
  },
  networkMode: "always",
})
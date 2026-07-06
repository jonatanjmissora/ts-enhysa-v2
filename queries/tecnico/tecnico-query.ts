import { queryOptions } from "@tanstack/react-query"
import { getTecnicoServer } from "../../server/tecnico/get-tecnico-server"
import { OfflineNoCacheError } from "@/lib/offline/errors"
import {
  saveEntityListToCache,
  getCachedEntityList,
} from "@/lib/offline/db"

const isClient = typeof window !== "undefined"

export const tecnicoQueryOptions = queryOptions({
  queryKey: ["tecnico"],
  queryFn: async () => {
    try {
      const data = await getTecnicoServer()
      if (isClient && data) await saveEntityListToCache("tecnicos-cache", data)
      return data
    } catch {
      if (!isClient) throw new OfflineNoCacheError()
      const cached = await getCachedEntityList("tecnicos-cache")
      if (cached.length === 0) throw new OfflineNoCacheError()
      return cached
    }
  },
  networkMode: "always",
  // refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
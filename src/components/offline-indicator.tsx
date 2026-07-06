"use client"

import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { getPendingCount } from "@/lib/offline/db"
import { processMutationQueue } from "@/lib/offline/sync"
import { Wifi, WifiOff } from "lucide-react"

const PENDING_COUNT_KEY = ["offline", "pending-count"] as const

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const queryClient = useQueryClient()
  const [syncing, setSyncing] = useState(false)
  const [shouldPoll, setShouldPoll] = useState(false)

  // Polling adaptativo: activo solo cuando offline o hay pendientes
  const { data: pending = 0 } = useQuery({
    queryKey: PENDING_COUNT_KEY,
    queryFn: () => getPendingCount(),
    enabled: typeof window !== "undefined" && shouldPoll,
    refetchInterval: shouldPoll ? 5000 : false,
    staleTime: 1000,
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    setShouldPoll(!isOnline || pending > 0)
  }, [isOnline, pending])

  // Auto-sync al reconectarse (único dueño del trigger)
  useEffect(() => {
    if (!isOnline || pending === 0 || syncing) return
    let cancelled = false
    setSyncing(true)
    processMutationQueue()
      .catch(() => {})
      .finally(() => {
        if (cancelled) return
        setSyncing(false)
        // Invalidate queries to refetch with correct IDs from server
        queryClient.invalidateQueries({ queryKey: PENDING_COUNT_KEY })
        queryClient.invalidateQueries({ queryKey: ["empresas"] })
        queryClient.invalidateQueries({ queryKey: ["instrumentos"] })
        queryClient.invalidateQueries({ queryKey: ["tecnico"] })
        queryClient.invalidateQueries({ queryKey: ["reportes-iluminacion"] })
        queryClient.invalidateQueries({ queryKey: ["areas-iluminacion"] })
        queryClient.invalidateQueries({ queryKey: ["localizadas-iluminacion"] })
      })
    return () => { cancelled = true }
  }, [isOnline, pending, syncing, queryClient])

  if (pending === 0 && isOnline) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur-sm text-white px-4 py-2 text-sm flex items-center justify-center gap-2">
      {isOnline ? (
        <>
          <Wifi size={14} />
          <span>
            {syncing
              ? `Sincronizando ${pending} cambio${pending !== 1 ? "s" : ""}...`
              : `${pending} cambio${pending !== 1 ? "s" : ""} pendiente${pending !== 1 ? "s" : ""}`}
          </span>
        </>
      ) : (
        <>
          <WifiOff size={14} />
          <span>
            Sin conexión{pending > 0 ? ` — ${pending} cambio${pending !== 1 ? "s" : ""} pendiente${pending !== 1 ? "s" : ""}` : ""}
          </span>
        </>
      )}
    </div>
  )
}
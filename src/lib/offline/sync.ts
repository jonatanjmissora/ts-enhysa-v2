import { getMutationQueue, removeMutationFromQueue, getPendingCount, openEnhysaDB } from "./db";
import { createEmpresaServer } from "../../../server/empresas/create-empresa-server";
import { updateEmpresaServer } from "../../../server/empresas/update-empresa-server";
import { deleteEmpresaServer } from "../../../server/empresas/delete-empresa-server";
import { createInstrumentoServer } from "../../../server/instrumentos/create-instrumento-server";
import { updateInstrumentoServer } from "../../../server/instrumentos/update-instrumento-server";
import { deleteInstrumentoServer } from "../../../server/instrumentos/delete-instrumento-server";
import { createTecnicoServer } from "../../../server/tecnico/create-tecnico-server";
import { updateTecnicoServer } from "../../../server/tecnico/update-tecnico-server";
import { createReporteNuevoServer } from "../../../server/reportes/iluminacion/create-reporte-nuevo-server";
import { updateReporteServer } from "../../../server/reportes/iluminacion/update-reporte-server";
import { deleteReporteServer } from "../../../server/reportes/iluminacion/delete-reporte-server";
import { createAreaServer } from "../../../server/reportes/iluminacion/areas/create-area-server";
import { updateAreaServer } from "../../../server/reportes/iluminacion/areas/update-area-server";
import { deleteAreaServer } from "../../../server/reportes/iluminacion/areas/delete-area-server";
import { createLocalizadaServer } from "../../../server/reportes/iluminacion/localidades/create-localizada-server";
import { updateLocalizadaServer } from "../../../server/reportes/iluminacion/localidades/update-localizada-server";
import { deleteLocalizadaServer } from "../../../server/reportes/iluminacion/localidades/delete-localizada-server";

let isSyncing = false;

/**
 * Process a single mutation entry.
 */
async function processOneMutation(entry: {
  id?: number;
  entity: "empresas-cache" | "instrumentos-cache" | "tecnicos-cache" | "reportes-iluminacion-cache" | "areas-iluminacion-cache" | "localizadas-iluminacion-cache";
  type: "create" | "update" | "delete";
  payload: any;
}) {
  const { entity, type, payload } = entry;
  try {
    switch (entity) {
      case "empresas-cache": {
        if (type === "create") await createEmpresaServer({ data: payload });
        if (type === "update") await updateEmpresaServer({ data: payload });
        if (type === "delete") await deleteEmpresaServer({ data: { id: payload.id } });
        break;
      }
      case "instrumentos-cache": {
        if (type === "create") await createInstrumentoServer({ data: payload });
        if (type === "update") await updateInstrumentoServer({ data: payload });
        if (type === "delete") await deleteInstrumentoServer({ data: { id: payload.id } });
        break;
      }
      case "tecnicos-cache": {
        if (type === "create") await createTecnicoServer({ data: payload });
        if (type === "update") await updateTecnicoServer({ data: payload });
        // delete not implemented; if needed, add.
        break;
      }
      case "reportes-iluminacion-cache": {
        if (type === "create") await createReporteNuevoServer({ data: payload });
        if (type === "update") await updateReporteServer({ data: payload });
        if (type === "delete") await deleteReporteServer({ data: { id: payload.id } });
        break;
      }
      case "areas-iluminacion-cache": {
        if (type === "create") await createAreaServer({ data: payload });
        if (type === "update") await updateAreaServer({ data: payload });
        if (type === "delete") await deleteAreaServer({ data: { id: payload.id } });
        break;
      }
      case "localizadas-iluminacion-cache": {
        if (type === "create") await createLocalizadaServer({ data: payload });
        if (type === "update") await updateLocalizadaServer({ data: payload });
        if (type === "delete") await deleteLocalizadaServer({ data: { id: payload.id } });
        break;
      }
      default:
        throw new Error(`Unknown entity store: ${entity}`);
    }
  } catch (err) {
    // Log but do not throw; allow continuing with other mutations.
    console.error("Failed to process mutation entry", entry, err);
    throw err; // rethrow so caller knows this item failed; we'll keep it in queue.
  }
}

/**
 * Process the mutation queue FIFO.
 * Returns true if the queue is empty after processing.
 */
export async function processMutationQueue(): Promise<boolean> {
  if (isSyncing) return false; // prevent concurrent syncs
  const count = await getPendingCount();
  if (count === 0) return false;

  isSyncing = true;
  try {
    const queue = await getMutationQueue();
    for (const entry of queue) {
      try {
        await processOneMutation(entry);
        // If successful, remove from queue
        if (entry.id != null) await removeMutationFromQueue(entry.id);
      } catch {
        // Keep the item in queue for retry; continue with next.
        // Optionally could implement a retry limit.
      }
    }
  } finally {
    isSyncing = false;
  }

  const remaining = await getPendingCount();
  // If queue cleared, clear all entity caches to force fresh fetch from server (with correct IDs)
  if (remaining === 0) await clearAllEntityCaches();
  return remaining === 0;
}

/**
 * Clear all entity caches (used after successful sync).
 */
export async function clearAllEntityCaches() {
  const db = await openEnhysaDB();
  for (const storeName of Object.keys({
    "empresas-cache": 1,
    "instrumentos-cache": 1,
    "tecnicos-cache": 1,
    "reportes-iluminacion-cache": 1,
    "areas-iluminacion-cache": 1,
    "localizadas-iluminacion-cache": 1,
  }) as Array<keyof typeof EntityMap>) {
    await db.clear(storeName as string);
  }
}
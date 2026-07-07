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
import { createLocalizadaServer } from "../../../server/reportes/iluminacion/localizadas/create-localizada-server";
import { updateLocalizadaServer } from "../../../server/reportes/iluminacion/localizadas/update-localizada-server";
import { deleteLocalizadaServer } from "../../../server/reportes/iluminacion/localizadas/delete-localizada-server";

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
    console.error("Failed to process mutation entry", entry, err);
    throw err;
  }
}

/**
 * Process the mutation queue FIFO.
 */
export async function processMutationQueue(): Promise<boolean> {
  if (isSyncing) return false;
  const count = await getPendingCount();
  if (count === 0) return false;

  isSyncing = true;
  try {
    const queue = await getMutationQueue();
    for (const entry of queue) {
      try {
        await processOneMutation(entry);
        if (entry.id != null) await removeMutationFromQueue(entry.id);
      } catch {
        // keep in queue for retry
      }
    }
  } finally {
    isSyncing = false;
  }

  const remaining = await getPendingCount();
  if (remaining === 0) await clearAllEntityCaches();
  return remaining === 0;
}

/**
 * Clear all entity caches (used after successful sync).
 */
export async function clearAllEntityCaches() {
  const db = await openEnhysaDB();
  const stores: Array<string> = [
    "empresas-cache",
    "instrumentos-cache",
    "tecnicos-cache",
    "reportes-iluminacion-cache",
    "areas-iluminacion-cache",
    "localizadas-iluminacion-cache",
  ];
  for (const storeName of stores) {
    await db.clear(storeName);
  }
}
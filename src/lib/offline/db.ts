import { openDB, type IDBPDatabase } from "idb"
import type { EmpresaType } from "../../../db/empresas/schema"
import type { InstrumentoType } from "../../../db/instrumentos/schema"
import type { TecnicoType } from "../../../db/tecnicos/schema"
import type { ReporteIluminacionType } from "../../../db/reportes/iluminacion/schema"
import type { AreaIluminacionType } from "../../../db/reportes/iluminacion/areas/schema"
import type { LocalizadaIluminacionType } from "../../../db/reportes/iluminacion/localizadas/schema"

const DB_NAME = "enhysa-offline"
const DB_VERSION = 1

// --- Mapa de stores de entidades → tipo ---
export type EntityStoreName =
	| "empresas-cache"
	| "instrumentos-cache"
	| "tecnicos-cache"
	| "reportes-iluminacion-cache"
	| "areas-iluminacion-cache"
	| "localizadas-iluminacion-cache"

type EntityMap = {
	"empresas-cache": EmpresaType
	"instrumentos-cache": InstrumentoType
	"tecnicos-cache": TecnicoType
	"reportes-iluminacion-cache": ReporteIluminacionType
	"areas-iluminacion-cache": AreaIluminacionType
	"localizadas-iluminacion-cache": LocalizadaIluminacionType
}

const ENTITY_STORES = Object.keys({
	"empresas-cache": 1,
	"instrumentos-cache": 1,
	"tecnicos-cache": 1,
	"reportes-iluminacion-cache": 1,
	"areas-iluminacion-cache": 1,
	"localizadas-iluminacion-cache": 1,
}) as EntityStoreName[]

// --- Mutation queue (preparatorio para Fase 3 — sync de mutaciones) ---
export type MutationEntry = {
	id?: number
	entity: EntityStoreName
	type: "create" | "update" | "delete"
	payload: unknown
	createdAt: number
}

// db.ts define stores homogéneos por entidad; agregamos dinámicamente
// los entity stores al schema del DB sin tiparlos individualmente en la
// interfaz (se accede vía helpers genéricos con EntityMap).

let dbInstance: IDBPDatabase | null = null

export async function openEnhysaDB() {
	if (dbInstance) return dbInstance
	dbInstance = await openDB(DB_NAME, DB_VERSION, {
		upgrade(db) {
			// Mutation queue
			if (!db.objectStoreNames.contains("mutation-queue")) {
				const store = db.createObjectStore("mutation-queue", {
					keyPath: "id",
					autoIncrement: true,
				})
				store.createIndex("by-created", "createdAt")
			}

			// Entity caches
			for (const name of ENTITY_STORES) {
				if (!db.objectStoreNames.contains(name)) {
					db.createObjectStore(name, { keyPath: "id" })
				}
			}
		},
	})
	return dbInstance
}

// ============================================================
// Mutation queue (completo en Fase 3)
// ============================================================

export async function addMutationToQueue(entry: Omit<MutationEntry, "id" | "createdAt">) {
	const db = await openEnhysaDB()
	await db.add("mutation-queue", { ...entry, createdAt: Date.now() })
}

export async function getPendingCount() {
	return (await openEnhysaDB()).count("mutation-queue")
}

export async function getMutationQueue() {
	return (await openEnhysaDB()).getAll("mutation-queue")
}

export async function removeMutationFromQueue(id: number) {
	await (await openEnhysaDB()).delete("mutation-queue", id)
}

export async function clearMutationQueue() {
	await (await openEnhysaDB()).clear("mutation-queue")
}

// ============================================================
// Entity cache — helpers genéricos tipados por EntityMap
// ============================================================

/**
 * Guarda una lista completa en el store, reemplazando todo el contenido.
 * Pensado para queries de lista: write-through al recibir datos del server.
 */
export async function saveEntityListToCache<K extends EntityStoreName>(
	storeName: K,
	entities: EntityMap[K][],
) {
	const db = await openEnhysaDB()
	const tx = db.transaction(storeName, "readwrite")
	await tx.store.clear()
	for (const entity of entities) {
		await tx.store.put(entity)
	}
	await tx.done
}

/**
 * Guarda una única entidad (upsert). Para queries individuales y mutaciones.
 */
export async function putEntityInCache<K extends EntityStoreName>(
	storeName: K,
	entity: EntityMap[K],
) {
	await (await openEnhysaDB()).put(storeName, entity)
}

/**
 * Devuelve todas las entidades del store (para fallback offline de listas).
 */
export async function getCachedEntityList<K extends EntityStoreName>(
	storeName: K,
): Promise<EntityMap[K][]> {
	return (await openEnhysaDB()).getAll(storeName)
}

/**
 * Devuelve una entidad por id (para fallback offline de queries individuales).
 */
export async function getCachedEntityById<K extends EntityStoreName>(
	storeName: K,
	id: string,
): Promise<EntityMap[K] | undefined> {
	return (await openEnhysaDB()).get(storeName, id)
}

/**
 * Filtra entidades por un campo (ej. reportId para áreas/localizadas).
 * Para queries de lista filtradas por parent.
 */
export async function getCachedEntitiesByField<
	K extends EntityStoreName,
	Field extends keyof EntityMap[K],
>(storeName: K, field: Field, value: EntityMap[K][Field]): Promise<EntityMap[K][]> {
	const all = await getCachedEntityList(storeName)
	return all.filter(entity => entity[field] === value)
}

/**
 * Elimina una entidad del cache (para mutaciones delete en Fase 3).
 */
export async function removeEntityFromCache(storeName: EntityStoreName, id: string) {
	await (await openEnhysaDB()).delete(storeName, id)
}

/**
 * Vacía un store de entidad completo.
 * Se usa tras sync exitoso de la cola para forzar refetch con IDs del server.
 */
export async function clearEntityCache(storeName: EntityStoreName) {
	await (await openEnhysaDB()).clear(storeName)
}

import type { InstrumentoType } from "../../db/instrumentos/schema"
import { localDb } from "../database"

export async function getInstrumentosLocal(userId: string) {
	const instrumentos = await localDb.instrumentos
		.where("userId")
		.equals(userId)
		.toArray()
	return instrumentos.length > 0 ? instrumentos : null
}

export async function getInstrumentoLocal(id: string) {
	return (await localDb.instrumentos.get(id)) ?? null
}

export async function saveInstrumentosLocal(instrumentos: InstrumentoType[]) {
	await localDb.instrumentos.bulkPut(instrumentos)
	return { data: instrumentos, status: "ok" }
}

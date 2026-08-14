import { localDb, type TecnicoLocal } from "../database"

export async function getTecnicoLocal(userId: string) {
	return (await localDb.tecnicos.where("userId").equals(userId).first()) ?? null
}

export async function getTecnicoByIdLocal(id: string) {
	return (await localDb.tecnicos.get(id)) ?? null
}

export async function saveTecnicoLocal(tecnico: TecnicoLocal) {
	const res = await localDb.tecnicos.put(tecnico)
	return { data: res, status: "ok" }
}

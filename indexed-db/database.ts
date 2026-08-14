import Dexie, { type EntityTable } from "dexie"
import type { EmpresaType } from "../db/empresas/schema"
import type { InstrumentoType } from "../db/instrumentos/schema"

export interface TecnicoLocal {
	id: string
	nombre: string
	telefono: string
	localidad: string
	cargo: string
	matricula: string
	matriculaImg: string
	firmaImg: string
	empresaLogo: string
	dni: number | null
	userId: string
}

export interface SessionLocal {
	id: string
	email: string
	name: string
}

export type EmpresaLocal = EmpresaType

export type InstrumentoLocal = InstrumentoType

class AppDatabase extends Dexie {
	tecnicos!: EntityTable<TecnicoLocal, "id">
	empresas!: EntityTable<EmpresaLocal, "id">
	instrumentos!: EntityTable<InstrumentoLocal, "id">
	session!: EntityTable<SessionLocal, "id">

	constructor() {
		super("enhysa-db")

		this.version(3).stores({
			tecnicos: "id, userId, updatedAt",
			empresas: "id, userId",
			instrumentos: "id, userId",
			session: "id",
		})
	}
}

export const localDb = new AppDatabase()

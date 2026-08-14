import Dexie, { type EntityTable } from "dexie"
import type { EmpresaType } from "../db/empresas/schema"
import type { InstrumentoType } from "../db/instrumentos/schema"
import type { AreaIluminacionType } from "../db/reportes/iluminacion/areas/schema"
import type { LocalizadaIluminacionType } from "../db/reportes/iluminacion/localizadas/schema"
import type { ReporteIluminacionType } from "../db/reportes/iluminacion/schema"

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

export type ReporteIluminacionLocal = ReporteIluminacionType

export type AreaIluminacionLocal = AreaIluminacionType

export type LocalizadaIluminacionLocal = LocalizadaIluminacionType

class AppDatabase extends Dexie {
	tecnicos!: EntityTable<TecnicoLocal, "id">
	empresas!: EntityTable<EmpresaLocal, "id">
	instrumentos!: EntityTable<InstrumentoLocal, "id">
	reportesIluminacion!: EntityTable<ReporteIluminacionLocal, "id">
	areasIluminacion!: EntityTable<AreaIluminacionLocal, "id">
	localizadasIluminacion!: EntityTable<LocalizadaIluminacionLocal, "id">
	session!: EntityTable<SessionLocal, "id">

	constructor() {
		super("enhysa-db")

		this.version(5).stores({
			tecnicos: "id, userId, updatedAt",
			empresas: "id, userId",
			instrumentos: "id, userId",
			reportesIluminacion: "id, userId, finishedAt, createdAt",
			areasIluminacion: "id, reportId, userId",
			localizadasIluminacion: "id, reportId, userId",
			session: "id",
		})
	}
}

export const localDb = new AppDatabase()

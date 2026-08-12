import Dexie, { type EntityTable } from "dexie"

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
	user: {
		id: string
		email: string
		name: string
	}
}

class AppDatabase extends Dexie {
	tecnicos!: EntityTable<TecnicoLocal, "id">
	session!: EntityTable<SessionLocal, "user">

	constructor() {
		super("enhysa-db")

		this.version(1).stores({
			tecnicos: "id, userId, updatedAt",
			session: "user",
		})
	}
}

export const localDb = new AppDatabase()

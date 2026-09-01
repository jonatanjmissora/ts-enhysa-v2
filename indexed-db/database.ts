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

class AppDatabase extends Dexie {
	tecnicos!: EntityTable<TecnicoLocal, "id">

	constructor() {
		super("app-db")

		this.version(1).stores({
			tecnicos: "id, userId, updatedAt",
		})
	}
}

export const localDb = new AppDatabase()

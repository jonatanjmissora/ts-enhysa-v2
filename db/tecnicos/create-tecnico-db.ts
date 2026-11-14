import { delay } from "@/lib/utils"
import { tecnicos } from "./schema"
import type { TecnicoFormType } from "./tecnico-validator"
import { db } from ".."

export async function createTecnicoDB(
	newTecnico: Omit<TecnicoFormType, "dni"> & {
		id: string
		userId: string
		dni: number
	}
) {
	try {
		await delay()
		return await db
			.insert(tecnicos)
			.values({
				...newTecnico,
				deletedAt: null,
				updatedAt: new Date(),
			})
			.returning()
	} catch (error) {
		console.error(
			"ERROR insertando técnico:",
			error instanceof Error ? error.message : error
		)
	}
}

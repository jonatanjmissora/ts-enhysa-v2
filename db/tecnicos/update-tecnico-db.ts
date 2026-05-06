import { delay } from "@/lib/utils"
import type { UpdateTecnicoType } from "./tecnico-validator"
import { db } from ".."
import { tecnicos } from "../tecnicos/schema"
import { eq } from "drizzle-orm"

export async function updateTecnicoDB(updatedTecnico: UpdateTecnicoType) {
	try {
		await delay()
		const result = await db
			.update(tecnicos)
			.set(updatedTecnico)
			.where(eq(tecnicos.id, updatedTecnico.id))
			.returning()

		return result[0]
	} catch (error) {
		console.error(
			"ERROR actualizando técnico:",
			error instanceof Error ? error.message : error
		)
	}
}

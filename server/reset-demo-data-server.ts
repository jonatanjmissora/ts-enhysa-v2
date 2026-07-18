import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { auth } from "../src/lib/auth"
import { db } from "../db"
import { reportes_iluminacion } from "../db/reportes/iluminacion/schema"
import { creditHistory, userCredits } from "../db/credits/schema"
import { empresas } from "../db/empresas/schema"
import { tecnicos } from "../db/tecnicos/schema"
import { instrumentos } from "../db/instrumentos/schema"
import { eq } from "drizzle-orm"

const DEMO_EMAIL = "demouser@enhysa.demo"

export const resetDemoData = createServerFn({ method: "POST" }).handler(async () => {
	const request = getRequest()
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session) throw new Error("No autorizado")
	if (session.user.email !== DEMO_EMAIL) throw new Error("No es el usuario demo")

	const userId = session.user.id

	await db.delete(reportes_iluminacion).where(eq(reportes_iluminacion.userId, userId))
	await db.delete(empresas).where(eq(empresas.userId, userId))
	await db.delete(tecnicos).where(eq(tecnicos.userId, userId))
	await db.delete(instrumentos).where(eq(instrumentos.userId, userId))
	await db.delete(creditHistory).where(eq(creditHistory.userId, userId))
	await db.delete(userCredits).where(eq(userCredits.userId, userId))

	return { success: true }
})

import { z } from "zod"
import { ESTADO, HUMEDAD, TEMPERATURA } from "../../../src/lib/constants"

export const reporteNuevoFormValidator = z.object({
	empresaId: z.string().min(1, "Id requerido"),
	instrumentoId: z.string().min(1, "Id requerido"),
	clima: z.tuple([z.enum(ESTADO), z.enum(HUMEDAD), z.enum(TEMPERATURA)]),
})

export type ReporteNuevoFormType = z.infer<typeof reporteNuevoFormValidator>

export const defaultReporteData: ReporteNuevoFormType = {
	empresaId: "",
	instrumentoId: "",
	clima: ["despejado", "60", "10"],
}

export const reporteOpinionFormValidator = z.object({
	observacion: z.string(),
	conclusion: z.string(),
	recomendacion: z.string(),
})

export type ReporteOpinionFormType = z.infer<typeof reporteOpinionFormValidator>

export const reporteServerValidator = reporteNuevoFormValidator.extend({
	title: z.string().min(1, "Título requerido"),
	tecnicoId: z.string().min(1, "Id requerido"),
})

export const reporteIluminacionIdValidator = z.object({
	id: z.string().min(1, "Id requerido"),
})

export type ReporteIluminacionIdType = z.infer<
	typeof reporteIluminacionIdValidator
>

export const updateReporteServerValidator =
	reporteNuevoFormValidator.extend({
		id: z.string().min(1, "Id requerido"),
		userId: z.string().min(1, "UserId requerido"),
		tecnicoId: z.string().min(1, "TecnicoId requerido"),
		title: z.string().min(1, "Título requerido"),
		observacion: z.string(),
		conclusion: z.string(),
		recomendacion: z.string(),
		createdAt: z.date(),
		finishedAt: z.date().nullish(),
	})

export type updateReporteServerType = z.infer<
	typeof updateReporteServerValidator
>

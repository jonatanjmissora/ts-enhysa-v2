import { z } from "zod"
import { ESTADO, HUMEDAD, TEMPERATURA } from "../../../src/lib/constants"

// export const reporteFormValidator = z.object({
// 	empresaId: z.string().min(1, "Id requerido"),
// 	instrumentoId: z.string().min(1, "Id requerido"),
// 	clima: z.tuple([z.enum(ESTADO), z.enum(HUMEDAD), z.enum(TEMPERATURA)]),
// 	areasId: z.array(z.string()),
// 	observacion: z.string(),
// 	conclusion: z.string(),
// 	recomendacion: z.string(),
// 	createdAt: z.date(),
// 	finishedAt: z.date().nullish(),
// })

// export type ReporteFormType = z.infer<typeof reporteFormValidator>

// export const reporteServerValidator = reporteFormValidator.extend({
// 	tecnicoId: z.string().min(1, "Id requerido"),
// })

// export type ReporteServerType = z.infer<typeof reporteServerValidator>

// export const reporteIluminacionIdValidator = z.object({
// 	id: z.string().min(1, "Id requerido"),
// })

// export type ReporteIluminacionIdType = z.infer<
// 	typeof reporteIluminacionIdValidator
// >

// export const updateReporteValidator = reporteServerValidator.extend({
// 	id: z.string().min(1, "Id requerido"),
// 	userId: z.string().min(1, "UserId requerido"),
// })

// export type UpdateReporteType = z.infer<typeof updateReporteValidator>

// export const updateReporteFormValidator = z.object({
// 	empresaId: z.string().min(1, "Id requerido"),
// 	instrumentoId: z.string().min(1, "Id requerido"),
// 	clima: z.tuple([z.enum(ESTADO), z.enum(HUMEDAD), z.enum(TEMPERATURA)]),
// })

// export type UpdateReporteFormType = z.infer<typeof updateReporteFormValidator>

// export const reporteNuevoOpinionFormValidator = z.object({
// 	conclusion: z.string(),
// 	observacion: z.string(),
// 	recomendacion: z.string(),
// })

// export type ReporteNuevoOpinionFormType = z.infer<
// 	typeof reporteNuevoOpinionFormValidator
// >

// export const defaultReporteData: ReporteFormType = {
// 	empresaId: "",
// 	instrumentoId: "",
// 	clima: ["soleado", "60", "10"],
// 	areasId: [],
// 	observacion: "",
// 	conclusion: "",
// 	recomendacion: "",
// 	createdAt: new Date(),
// 	finishedAt: null,
// }

export const reporteNuevoFormValidator = z.object({
	empresaId: z.string().min(1, "Id requerido"),
	instrumentoId: z.string().min(1, "Id requerido"),
	clima: z.tuple([z.enum(ESTADO), z.enum(HUMEDAD), z.enum(TEMPERATURA)]),
	areasId: z.array(z.string()),
})

export type ReporteNuevoFormType = z.infer<typeof reporteNuevoFormValidator>

export const defaultReporteData: ReporteNuevoFormType = {
	empresaId: "",
	instrumentoId: "",
	clima: ["soleado", "60", "10"],
	areasId: [],
}

export const reporteOpinionFormValidator = z.object({
	observacion: z.string(),
	conclusion: z.string(),
	recomendacion: z.string(),
})

export type ReporteOpinionFormType = z.infer<typeof reporteOpinionFormValidator>

export const reporteServerValidator = reporteNuevoFormValidator.extend({
	tecnicoId: z.string().min(1, "Id requerido"),
})

export const reporteIluminacionIdValidator = z.object({
	id: z.string().min(1, "Id requerido"),
})

export type ReporteIluminacionIdType = z.infer<
	typeof reporteIluminacionIdValidator
>

export const updateReporteNuevoServerValidator =
	reporteNuevoFormValidator.extend({
		id: z.string().min(1, "Id requerido"),
		userId: z.string().min(1, "UserId requerido"),
		tecnicoId: z.string().min(1, "TecnicoId requerido"),
		observacion: z.string(),
		conclusion: z.string(),
		recomendacion: z.string(),
		createdAt: z.date(),
		finishedAt: z.date().nullish(),
	})

export type updateReporteNuevoServerType = z.infer<
	typeof updateReporteNuevoServerValidator
>

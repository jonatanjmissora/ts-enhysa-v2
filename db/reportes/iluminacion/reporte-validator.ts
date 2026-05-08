import { z } from "zod"
import { ESTADO, HUMEDAD, TEMPERATURA } from "../../../src/lib/constants"

export const reporteFormValidator = z.object({
	empresaId: z.string().min(1, "Id requerido"),
	instrumentoId: z.string().min(1, "Id requerido"),
	clima: z.tuple([z.enum(ESTADO), z.enum(HUMEDAD), z.enum(TEMPERATURA)]),
	areasId: z.array(z.string()).optional(),
	observacion: z.string().optional(),
	conclusion: z.string().optional(),
	recomendacion: z.string().optional(),
	createdAt: z.date().optional(),
	finishedAt: z.date().optional(),
})

export type ReporteFormType = z.infer<typeof reporteFormValidator>

export const reporteServerValidator = z.object({
	tecnicoId: z.string().min(1, "Id requerido"),
	empresaId: z.string().min(1, "Id requerido"),
	instrumentoId: z.string().min(1, "Id requerido"),
	clima: z.tuple([z.enum(ESTADO), z.enum(HUMEDAD), z.enum(TEMPERATURA)]),
	areasId: z.array(z.string()).optional(),
	observacion: z.string().optional(),
	conclusion: z.string().optional(),
	recomendacion: z.string().optional(),
	createdAt: z.date().optional(),
	finishedAt: z.date().optional(),
})

export type ReporteServerType = z.infer<typeof reporteServerValidator>

export const defaultReporteData: ReporteFormType = {
	empresaId: "",
	instrumentoId: "",
	clima: ["soleado", "60", "10"],
	areasId: [],
	observacion: "",
	conclusion: "",
	recomendacion: "",
	createdAt: new Date(),
	finishedAt: undefined,
}

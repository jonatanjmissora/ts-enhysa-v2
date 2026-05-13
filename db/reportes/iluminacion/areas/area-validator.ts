import {
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS,
} from "#/lib/constants"
import { z } from "zod"

export const areaFormValidator = z.object({
	nombre: z.string().min(3, "Mínimo de 3 caracteres"),
	tipo: z.string().min(3, "Mínimo de 3 caracteres"),
	iluminacionTipo: z.enum(ILUMINACION_TIPO),
	iluminacionFuente: z.enum(ILUMINACION_FUENTE),
	iluminacion: z.enum(ILUMINACION),
	valorRequerido: z.enum(VALORES_REQUERIDOS),
	observaciones: z.string(),
	largo: z.number().min(1, "Mínimo de 1 caractere"),
	ancho: z.number().min(1, "Mínimo de 1 caractere"),
	alto: z.number().min(1, "Mínimo de 1 caractere"),
	imagenes: z.array(z.string()),
	puntos: z.array(z.number()),
	timestamps: z.array(z.date()),
})

export type AreaFormType = z.infer<typeof areaFormValidator>

export const areaServerValidator = areaFormValidator.extend({
	reportId: z.string().min(1, "Reporte requerido"),
})

export type AreaServerType = z.infer<typeof areaServerValidator>

export const areaIdValidator = z.object({
	id: z.string().min(1, "Id requerido"),
})

export const updateAreaValidator = areaFormValidator.extend({
	id: z.string().min(1, "Id requerido"),
	userId: z.string().min(1, "Usuario requerido"),
	reportId: z.string().min(1, "Reporte requerido"),
})

export type UpdateAreaType = z.infer<typeof updateAreaValidator>

export const defaultAreaData: AreaFormType = {
	nombre: "",
	tipo: "",
	iluminacionTipo: "natural",
	iluminacionFuente: "mixta",
	iluminacion: "general",
	valorRequerido: "100",
	observaciones: "",
	largo: 0,
	ancho: 0,
	alto: 0,
	imagenes: [],
	puntos: [],
	timestamps: [],
}

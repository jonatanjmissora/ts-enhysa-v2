import {
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS,
} from "#/lib/constants"
import { z } from "zod"

export const localizadaFormValidator = z.object({
	nombre: z.string().min(3, "Mínimo de 3 caracteres"),
	tipo: z.string().min(3, "Mínimo de 3 caracteres"),
	iluminacionTipo: z.enum(ILUMINACION_TIPO),
	iluminacionFuente: z.enum(ILUMINACION_FUENTE),
	iluminacion: z.enum(ILUMINACION),
	valorRequerido: z.enum(VALORES_REQUERIDOS),
	observaciones: z.string(),
	valor: z.number().positive("Debe ser un valor positivo"),
	imagenes: z.array(z.string()),
	timestamps: z.array(z.date()),
})

export type LocalizadaFormType = z.infer<typeof localizadaFormValidator>

export const localizadaServerValidator = localizadaFormValidator.extend({
	reportId: z.string().min(1, "Reporte requerido"),
	id: z.string().min(1, "Id requerido"),
})

export type LocalizadaServerType = z.infer<typeof localizadaServerValidator>

export const localizadaIdValidator = z.object({
	id: z.string().min(1, "Id requerido"),
})

export const updateLocalizadaValidator = localizadaFormValidator.extend({
	id: z.string().min(1, "Id requerido"),
	userId: z.string().min(1, "Usuario requerido"),
	reportId: z.string().min(1, "Reporte requerido"),
})

export type UpdateLocalizadaType = z.infer<typeof updateLocalizadaValidator>

export const defaultLocalizadaData: LocalizadaFormType = {
	nombre: "",
	tipo: "",
	iluminacionTipo: "natural",
	iluminacionFuente: "mixta",
	iluminacion: "general",
	valorRequerido: "100",
	observaciones: "",
	valor: 0,
	imagenes: [],
	timestamps: [],
}

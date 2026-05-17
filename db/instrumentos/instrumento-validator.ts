import { z } from "zod"

export const instrumentoFormValidator = z.object({
	nombre: z.string().min(3, "Mínimo 3 caracteres"),
	marca: z.string().min(3, "Mínimo 3 caracteres"),
	modelo: z.string().min(3, "Mínimo 3 caracteres"),
	serie: z.string().min(3, "Mínimo 3 caracteres"),
	fechaCalibracion: z.date(),
	imagenesCalibracion: z.array(z.string()),
	imagenes: z.array(z.string()),
})

export type InstrumentoFormType = z.infer<typeof instrumentoFormValidator>

export const instrumentoIdValidator = z.object({
	id: z.string().min(1, "Id requerido"),
})

export type InstrumentoIdType = z.infer<typeof instrumentoIdValidator>

export const updateInstrumentoValidator = instrumentoFormValidator.extend({
	id: z.string().min(1, "Id requerido"),
	userId: z.string().min(1, "UserId requerido"),
})

export type UpdateInstrumentoType = z.infer<typeof updateInstrumentoValidator>

export const defaultInstrumento: InstrumentoFormType = {
	nombre: "",
	marca: "",
	modelo: "",
	serie: "",
	fechaCalibracion: new Date(),
	imagenesCalibracion: [],
	imagenes: [],
}

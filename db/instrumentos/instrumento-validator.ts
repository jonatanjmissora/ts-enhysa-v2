import { z } from "zod"

export const instrumentoFormValidator = z.object({
	nombre: z.string().min(3, "Mínimo 3 caracteres"),
	marca: z.string(),
	modelo: z.string(),
	serie: z.string().min(3, "Mínimo 3 caracteres"),
	fechaCalibracion: z.string(),
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

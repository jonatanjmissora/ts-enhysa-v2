import { z } from "zod"

export const tecnicoFormValidator = z.object({
	nombre: z.string().min(3, "Mínimo 3 caracteres"),
	telefono: z.string(),
	localidad: z.string(),
	cargo: z.string().min(4, "Mínimo 4 caracteres"),
	matricula: z.string().min(3, "Mínimo 3 caracteres"),
	matriculaImg: z.string(),
	firmaImg: z.string(),
	membrete: z.string(),
})

export type TecnicoFormType = z.infer<typeof tecnicoFormValidator>

export const updateTecnicoValidator = tecnicoFormValidator.extend({
	id: z.string().min(1, "Id requerido"),
	userId: z.string().min(1, "UserId requerido"),
})

export type UpdateTecnicoType = z.infer<typeof updateTecnicoValidator>

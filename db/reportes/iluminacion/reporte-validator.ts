import { z } from "zod"

export const reporteFormValidator = z.object({
	tecnicoId: z.string().min(1, "Id requerido"),
	empresaId: z.string().min(1, "Id requerido"),
	instrumentoId: z.string().min(1, "Id requerido"),
	areasId: z.array(z.string()).min(1, "Id requerido"),
	clima: z.string().min(1, "Id requerido"),
	observacion: z.string().default(""),
	conclusion: z.string().default(""),
	recomendacion: z.string().default(""),
})

export type ReporteFormType = z.infer<typeof reporteFormValidator>

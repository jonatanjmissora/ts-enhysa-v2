import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { EmpresaType } from "../../db/empresas/schema"
import type { InstrumentoType } from "../../db/instrumentos/schema"
import type { TecnicoFormType } from "../../db/tecnicos/tecnico-validator"
import type { TecnicoType } from "../../db/tecnicos/schema"
import type { InstrumentoFormType } from "../../db/instrumentos/instrumento-validator"
import type { EmpresaFormType } from "../../db/empresas/empresa-validator"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getUserInfo = (session: any) => {
	const avatar = session?.user?.image || ""
	const name = session?.user?.name.split(" ")[0] || ""
	const Name = name.charAt(0).toUpperCase() + name.slice(1)
	const lastName = session?.user?.name.split(" ")[1] || ""
	const LastName = lastName.charAt(0).toUpperCase() + lastName.slice(1)
	return { avatar, fullName: `${Name} ${LastName}` }
}

export const delay = async (ms = 3000) => {
	if (!import.meta.env.DEV) return

	await new Promise(r => setTimeout(r, ms))
}

export const sortedByRazonSocial = (empresas: EmpresaType[]) => {
	return empresas.sort((a, b) => a.razonSocial.localeCompare(b.razonSocial))
}

export const sortedByNombre = (instrumentos: InstrumentoType[]) => {
	return instrumentos.sort((a, b) => a.nombre.localeCompare(b.nombre))
}

export const checkTecnicoDiference = (
	formValues: TecnicoFormType,
	tecnico: TecnicoType
) => {
	return (
		formValues.nombre === tecnico.nombre &&
		formValues.telefono === tecnico.telefono &&
		formValues.localidad === tecnico.localidad &&
		formValues.cargo === tecnico.cargo &&
		formValues.matricula === tecnico.matricula &&
		formValues.matriculaImg === tecnico.matriculaImg &&
		formValues.firmaImg === tecnico.firmaImg &&
		formValues.membrete === tecnico.membrete
	)
}

export const checkEmpresaDiference = (
	formValues: EmpresaFormType,
	empresa: EmpresaType
) => {
	return (
		formValues.cuit === empresa.cuit &&
		formValues.razonSocial === empresa.razonSocial &&
		formValues.direccion === empresa.direccion &&
		formValues.localidad === empresa.localidad &&
		formValues.provincia === empresa.provincia &&
		formValues.codigoPostal === empresa.codigoPostal &&
		formValues.horarios === empresa.horarios &&
		formValues.logo === empresa.logo
	)
}

export const checkInstrumentoDiference = (
	formValues: InstrumentoFormType,
	instrumento: InstrumentoType
) => {
	return (
		formValues.nombre === instrumento.nombre &&
		formValues.marca === instrumento.marca &&
		formValues.modelo === instrumento.modelo &&
		formValues.serie === instrumento.serie &&
		formValues.fechaCalibracion === instrumento.fechaCalibracion &&
		formValues.imagenes === instrumento.imagenes
	)
}

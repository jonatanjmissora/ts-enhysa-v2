import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { EmpresaType } from "../../db/empresas/schema"
import type { InstrumentoType } from "../../db/instrumentos/schema"
import type { TecnicoFormType } from "../../db/tecnicos/tecnico-validator"
import type { TecnicoType } from "../../db/tecnicos/schema"
import type { InstrumentoFormType } from "../../db/instrumentos/instrumento-validator"
import type { EmpresaFormType } from "../../db/empresas/empresa-validator"
import type { ReporteIluminacionType } from "../../db/reportes/iluminacion/schema"

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
		formValues.firmaImg === tecnico.firmaImg
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
		formValues.imagenCalibracion === instrumento.imagenCalibracion &&
		JSON.stringify(formValues.imagenes) === JSON.stringify(instrumento.imagenes)
	)
}

export const sortedByDate = (reportes: ReporteIluminacionType[]) => {
	return reportes.sort((a, b) => {
		const dateA = new Date(a.createdAt).getTime()
		const dateB = new Date(b.createdAt).getTime()
		return dateB - dateA
	})
}

export const sortedByName = <T extends { nombre: string }>(items: T[]): T[] => {
	return items.sort((a, b) => a.nombre.localeCompare(b.nombre))
}

export const getIndiceDeLocal = (
	cantidadFilas: number,
	cantidadColumnas: number,
	cantidadAltura: number
) => {
	return (
		(cantidadFilas * cantidadColumnas) /
		(cantidadAltura * (cantidadFilas + cantidadColumnas))
	)
}

export const getIndiceRedondeo = (indiceDeLocal: number) =>
	Math.abs(indiceDeLocal % 1) > 0
		? Math.trunc(indiceDeLocal) + 1
		: Math.trunc(indiceDeLocal)

export const getNumeroCeldas = (
	cantidadFilas: number,
	cantidadColumnas: number,
	cantidadAltura: number
) => {
	const indiceRedondeo = getIndiceRedondeo(
		getIndiceDeLocal(cantidadFilas, cantidadColumnas, cantidadAltura)
	)
	const indice = (indiceRedondeo + 2) ** 2
	return indice
}

export const setResetPuntos = (length: number) => {
	const resetPuntos: number[] = Array.from({ length: length }, () => 0)
	const resetTimestamps: Date[] = Array.from(
		{ length: length },
		() => new Date(1970, 0, 1, 0, 0, 0)
	)
	return { resetPuntos, resetTimestamps }
}

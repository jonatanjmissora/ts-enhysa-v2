import {
	getTecnicoLocal,
	saveTecnicoLocal,
} from "../../indexed-db/tecnicos/tecnico-local-db"
import { getTecnicoServer } from "../../server/tecnico/get-tecnico-server"

export const tecnicoRepository = {
	async get(userId: string) {
		if (typeof window === "undefined") {
			return await getTecnicoServer()
		}

		const tecnicoL = await getTecnicoLocal(userId)

		if (tecnicoL) {
			console.log("[IndexedDB] Técnico local:", tecnicoL)
			return tecnicoL
		}

		const tecnicoR = await getTecnicoServer()

		if (tecnicoR) {
			console.log("[API] Técnico remoto:", tecnicoR)
			const res = await saveTecnicoLocal(tecnicoR)
			if (res.status === "ok") {
				console.log("[IndexedDB] Técnico guardado:", res.data)
			}
		}

		return tecnicoR
	},
}

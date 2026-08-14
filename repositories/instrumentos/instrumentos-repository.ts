import type { InstrumentoType } from "../../db/instrumentos/schema"
import {
	getInstrumentosLocal,
	saveInstrumentosLocal,
} from "../../indexed-db/instrumentos/instrumentos-local-db"
import { getInstrumentosServer } from "../../server/instrumentos/get-instrumentos-server"

export const instrumentosRepository = {
	async get(userId: string): Promise<InstrumentoType[] | null | undefined> {
		if (typeof window === "undefined") {
			return await getInstrumentosServer()
		}

		const instrumentosL = await getInstrumentosLocal(userId)

		if (instrumentosL) {
			console.log("[IndexedDB] Instrumentos local:", instrumentosL)
			return instrumentosL
		}

		const instrumentosR = await getInstrumentosServer()

		if (instrumentosR) {
			console.log("[API] Instrumentos remotos:", instrumentosR)
			const res = await saveInstrumentosLocal(instrumentosR)
			if (res.status === "ok") {
				console.log("[IndexedDB] Instrumentos guardados:", res.data)
			}
		}

		return instrumentosR
	},
}

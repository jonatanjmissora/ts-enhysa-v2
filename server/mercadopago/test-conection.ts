import { createServerFn } from "@tanstack/react-start"
import { Preference } from "mercadopago"
import { mpClient } from "./config"

export const testMpConnection = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			const preference = new Preference(mpClient)
			const result = await preference.create({
				body: {
					items: [
						{
							id: "test-connection",
							title: "Test de conexión",
							quantity: 1,
							unit_price: 1,
						},
					],
					purpose: "wallet_purchase",
				},
			})
			return {
				success: true,
				preferenceId: result.id,
				message: "Conectado a MP correctamente",
			}
		} catch (error) {
			return {
				success: false,
				message: error instanceof Error ? error.message : "Error desconocido",
			}
		}
	},
)

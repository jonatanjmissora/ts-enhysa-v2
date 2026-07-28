import { MercadoPagoConfig } from "mercadopago"

export const mpClient = new MercadoPagoConfig({
	accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
	options: { timeout: 5000 },
})

import https from "node:https"

const CPSH_BASE_URL = "https://cpsh.com.ar"
const CPSH_SEARCH_PATH = "/matriculacion/web/site/buscar-profesional"
const REQUEST_TIMEOUT = 15_000

export async function getCpshFormData(): Promise<{
	csrfToken: string
	cookies: string
}> {
	const url = `${CPSH_BASE_URL}${CPSH_SEARCH_PATH}`

	try {
		return await fetchCpshWithFetch(url)
	} catch (e) {
		if (
			e instanceof Error &&
			(/unable to verify|certificate|UNABLE_TO_VERIFY|leaf/i.test(e.message) ||
				(e as any).cause instanceof Error &&
				/unable to verify|certificate|UNABLE_TO_VERIFY|leaf/i.test((e as any).cause.message))
		) {
			return await fetchCpshWithHttps(url)
		}
		throw e
	}
}

async function fetchCpshWithFetch(
	url: string
): Promise<{ csrfToken: string; cookies: string }> {
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
				"Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
			},
			signal: controller.signal,
		})

		if (!response.ok) {
			throw new Error(`CPSH responded with status ${response.status}`)
		}

		const html = await response.text()
		const setCookie = response.headers.get("set-cookie")
		const cookieHeader = buildCookieHeader(setCookie)
		const csrfToken = extractCsrfToken(html)

		return { csrfToken, cookies: cookieHeader }
	} finally {
		clearTimeout(timeoutId)
	}
}

async function fetchCpshWithHttps(
	url: string
): Promise<{ csrfToken: string; cookies: string }> {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			req.destroy()
			reject(new Error("CPSH request timeout"))
		}, REQUEST_TIMEOUT)

		const req = https.get(
			url,
			{
				rejectUnauthorized: false,
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
					"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
					"Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
				},
			},
			(res) => {
				const chunks: Buffer[] = []
				res.on("data", (chunk) => chunks.push(chunk))
				res.on("end", () => {
					clearTimeout(timeoutId)
					const html = Buffer.concat(chunks).toString("utf-8")

					if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
						reject(new Error(`CPSH responded with status ${res.statusCode}`))
						return
					}

					const setCookie = res.headers["set-cookie"]
					const cookieHeader = buildCookieHeader(setCookie)
					const csrfToken = extractCsrfToken(html)

					resolve({ csrfToken, cookies: cookieHeader })
				})
			}
		)

		req.on("error", (e) => {
			clearTimeout(timeoutId)
			reject(e)
		})
	})
}

function buildCookieHeader(setCookie: string | string[] | undefined | null): string {
	if (!setCookie) return ""
	const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
	return cookies.map((c) => c.split(";")[0].trim()).join("; ")
}

function extractCsrfToken(html: string): string {
	const inputMatch = html.match(/<input[^>]*name="_csrf"[^>]*value="([^"]+)"[^>]*>/i)
	if (inputMatch?.[1]) return inputMatch[1]

	const metaMatch = html.match(/<meta[^>]*name="csrf-token"[^>]*content="([^"]+)"[^>]*>/i)
	if (metaMatch?.[1]) return metaMatch[1]

	throw new Error("CSRF token not found in CPSH form")
}

export async function searchProfessionalRegistration(
	dniOrCuit: string,
	csrfToken: string,
	cookies: string
): Promise<boolean> {
	const url = `${CPSH_BASE_URL}${CPSH_SEARCH_PATH}`
	const body = new URLSearchParams({
		_csrf: csrfToken,
		matriculado: dniOrCuit,
	})

	try {
		return await searchWithFetch(url, body, cookies)
	} catch (e) {
		if (
			e instanceof Error &&
			(/unable to verify|certificate|UNABLE_TO_VERIFY|leaf/i.test(e.message) ||
				(e as any).cause instanceof Error &&
				/unable to verify|certificate|UNABLE_TO_VERIFY|leaf/i.test((e as any).cause.message))
		) {
			return await searchWithHttps(url, body, cookies)
		}
		throw e
	}
}

export async function verifyProfessionalRegistration(
	dniOrCuit: string
): Promise<boolean> {
	const formData = await getCpshFormData()
	return searchProfessionalRegistration(dniOrCuit, formData.csrfToken, formData.cookies)
}

async function searchWithFetch(
	url: string,
	body: URLSearchParams,
	cookies: string
): Promise<boolean> {
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": cookies,
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
				"Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
			},
			body: body.toString(),
			signal: controller.signal,
		})

		if (!response.ok) {
			throw new Error(`CPSH responded with status ${response.status}`)
		}

		const html = await response.text()
		return extractIsRegistered(html)
	} finally {
		clearTimeout(timeoutId)
	}
}

async function searchWithHttps(
	url: string,
	body: URLSearchParams,
	cookies: string
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			req.destroy()
			reject(new Error("CPSH request timeout"))
		}, REQUEST_TIMEOUT)

		const postData = body.toString()

		const req = https.request(
			url,
			{
				method: "POST",
				rejectUnauthorized: false,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Content-Length": Buffer.byteLength(postData),
					"Cookie": cookies,
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
					"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
					"Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
				},
			},
			(res) => {
				const chunks: Buffer[] = []
				res.on("data", (chunk) => chunks.push(chunk))
				res.on("end", () => {
					clearTimeout(timeoutId)
					const html = Buffer.concat(chunks).toString("utf-8")

					if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
						reject(new Error(`CPSH responded with status ${res.statusCode}`))
						return
					}

					resolve(extractIsRegistered(html))
				})
			}
		)

		req.on("error", (e) => {
			clearTimeout(timeoutId)
			reject(e)
		})

		req.write(postData)
		req.end()
	})
}

function extractIsRegistered(html: string): boolean {
	const hasCredential = /id=["']credencial["']/i.test(html)
	const notFound = /no se encontraron resultados/i.test(html)

	if (hasCredential) return true
	if (notFound) return false

	throw new Error("No se pudo determinar si el profesional está registrado")
}

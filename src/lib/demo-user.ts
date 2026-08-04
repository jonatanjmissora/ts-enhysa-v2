export const DEMO_EMAIL_PREFIX = "demo"
export const DEMO_EMAIL_DOMAIN = "@enhysa.demo"

export function isDemoUserEmail(email: string | null | undefined) {
	return !!(
		email?.startsWith(DEMO_EMAIL_PREFIX) && email?.endsWith(DEMO_EMAIL_DOMAIN)
	)
}

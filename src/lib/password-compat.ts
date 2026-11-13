import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto"
import { verifyPassword as verifyBetterAuthPassword } from "better-auth/crypto"

const KEY_LENGTH = 64

function deriveScrypt(password: string, salt: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		scryptCallback(
			password.normalize("NFKC"),
			salt,
			KEY_LENGTH,
			(error, derivedKey) => {
				if (error) reject(error)
				else resolve(derivedKey)
			}
		)
	})
}

/**
 * Verify passwords in both formats:
 * - APK legacy: `scrypt:<salt>:<hash>` (Node scrypt defaults: N=16384, r=8, p=1)
 * - Better Auth: `<salt>:<hash>` (N=16384, r=16, p=1)
 */
export async function verifyPasswordCompat({
	hash,
	password,
}: {
	hash: string
	password: string
}): Promise<boolean> {
	if (!hash.startsWith("scrypt:")) {
		return verifyBetterAuthPassword({ hash, password })
	}

	const [, salt, expectedHex] = hash.split(":")
	if (!salt || !expectedHex) return false

	const derived = await deriveScrypt(password, salt)
	const expected = Buffer.from(expectedHex, "hex")

	return (
		derived.length === expected.length && timingSafeEqual(derived, expected)
	)
}

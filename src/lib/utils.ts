import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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

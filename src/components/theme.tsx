import { useRouteContext, useRouter } from "@tanstack/react-router"
import { Moon, Monitor, Sun } from "lucide-react"
import { setThemeServerFn } from "../../server/theme"

export const Theme = () => {
	const { theme } = useRouteContext({ from: "__root__" })
	const router = useRouter()

	const toggleTheme = () => {
		const themes = ["light", "dark", "auto"] as const
		const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length]
		setThemeServerFn({ data: nextTheme }).then(() => {
			router.invalidate()
		})
	}

	return (
		<button
			onClick={toggleTheme}
			className="rounded-full p-2 px-3 cursor-pointer hover:ring hover:ring-foreground/50"
		>
			{theme === "dark" ? (
				<Moon size={14} className="text-foreground/75" />
			) : theme === "light" ? (
				<Sun size={14} className="text-foreground/75" />
			) : (
				<Monitor size={14} className="text-foreground/75" />
			)}
		</button>
	)
}

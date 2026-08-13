import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router"
import { Buffer } from "buffer"

if (typeof window !== "undefined") {
	window.Buffer = window.Buffer || Buffer
}
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"
import { PWARegister } from "@/components/pwa-register"
import { PWAInstallListener } from "@/components/pwa-install-listener"
import appCss from "../styles.css?url"
import type { QueryClient } from "@tanstack/react-query"
import { DefaultCatchBoundary } from "#/components/DefaultCatchBoundary"
import type { Session } from "better-auth"
import { getSession } from "../../server/get-session"
import NotFound from "#/components/not-found"
import { getThemeServerFn } from "../../server/theme"
import { OfflineSession } from "#/components/offline-session"

interface MyRouterContext {
	session: Session | null
	queryClient: QueryClient
	theme: "light" | "dark" | "auto"
}

type RootSessionState = {
	session: Session | null
	serverSession: Session | null
	serverState: "ok" | "unreachable"
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Enhysa v2",
			},
			{
				name: "description",
				content:
					"Enhysa - Plataforma de gestión de inspecciones de iluminación. Reportes técnicos, mediciones y certificaciones.",
			},
			{
				name: "theme-color",
				content: "#09090b",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
		],
	}),
	beforeLoad: async () => ({
		theme: ((await getThemeServerFn()) ?? "auto") as "light" | "dark" | "auto",
	}),
	loader: async () => {
		try {
			const session = await getSession()
			return {
				session,
				serverSession: session,
				serverState: "ok",
			} satisfies RootSessionState
		} catch {
			return {
				session: null,
				serverSession: null,
				serverState: "unreachable",
			} satisfies RootSessionState
		}
	},
	shellComponent: RootDocument,
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => <NotFound />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	const theme = Route.useRouteContext({
		select: s => s.theme,
	})
	return (
		<html lang="en" className={theme === "auto" ? "dark" : theme}>
			<head>
				<HeadContent />
			</head>
			<body className="overflow-x-hidden w-screen">
				<PWAInstallListener />
				<OfflineSession />
				<main>{children}</main>
				<PWARegister />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	)
}

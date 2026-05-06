import { authClient } from "#/lib/auth-client"
import { useLoaderData, useNavigate } from "@tanstack/react-router"

function Navbar() {
	const { session } = useLoaderData({ from: "__root__" })
	const navigate = useNavigate()
	const logout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					// Redirect to home page after successful logout
					navigate({ to: "/login" })
				},
			},
		})
	}
	return (
		<header className="flex justify-between items-center p-4 w-full">
			<span>Logo</span>
			{session && (
				<button onClick={logout} className="cursor-pointer">
					Logout
				</button>
			)}
			<span>{session ? session.user.name : "no user"}</span>
		</header>
	)
}

export default Navbar

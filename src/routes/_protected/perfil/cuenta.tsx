import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { FileDropzone } from "#/components/upload-button"
import { ImageWithFallback } from "#/components/ui/image-with-fallback"
import { authClient } from "#/lib/auth-client"
import { updateUserImageServer } from "../../../../server/users/update-user-image-server"

export const Route = createFileRoute("/_protected/perfil/cuenta")({
	component: CuentaPage,
})

function CuentaPage() {
	const router = useRouter()
	const { data: session, isPending, refetch } = authClient.useSession()
	const [image, setImage] = useState<string>("")
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setImage(session?.user.image ?? "")
	}, [session?.user.image])

	const handleUploaded = async (value: string) => {
		setSaving(true)
		setError(null)
		try {
			await updateUserImageServer({ data: { imageId: value || null } })
			setImage(value)
			await refetch()
			router.invalidate()
		} catch (e) {
			setError(
				e instanceof Error ? e.message : "No se pudo actualizar la imagen"
			)
		} finally {
			setSaving(false)
		}
	}

	if (isPending) {
		return (
			<p className="w-11/12 mx-auto pt-10 text-center text-foreground-soft">
				Cargando cuenta...
			</p>
		)
	}

	return (
		<section className="w-11/12 max-w-2xl mx-auto pt-8 pb-24">
			<div className="flex flex-col sm:flex-row items-center gap-6">
				<ImageWithFallback
					src={image}
					alt="Foto de perfil"
					className="size-32 rounded-full object-cover border border-foreground/10 bg-muted"
				/>
				<div className="text-center sm:text-left">
					<h2 className="text-xl font-semibold tracking-wide">
						{session?.user.name || "Usuario"}
					</h2>
					<p className="text-sm text-foreground-soft">
						{session?.user.email}
					</p>
				</div>
			</div>

			<div className="mt-10 w-full max-w-sm mx-auto sm:mx-0">
				<FileDropzone
					text="Foto de perfil"
					defaultValue={image}
					onUploaded={handleUploaded}
				/>
				{saving && (
					<p className="mt-3 text-xs text-foreground-soft">
						Guardando foto de perfil...
					</p>
				)}
				{error && <p className="mt-3 text-xs text-destructive">{error}</p>}
			</div>
		</section>
	)
}

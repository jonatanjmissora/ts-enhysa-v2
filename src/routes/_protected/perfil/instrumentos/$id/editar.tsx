import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { instrumentosQueryOptions } from "../../../../../../queries/instrumentos/instrumentos-query"
import { EditInstrumentoForm } from "#/components/instrumentos/edit-instrumento"
import BackChevron from "#/components/back-chevron"
import Title from "#/components/title"
import { useAppSession } from "#/lib/app-session-context"

export const Route = createFileRoute(
	"/_protected/perfil/instrumentos/$id/editar"
)({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	const { session } = useAppSession()

	if (!session) return <div>No se encontró el instrumento</div>

	return <RouteContent id={id} userId={session.user.id} />
}

function RouteContent({ id, userId }: { id: string; userId: string }) {
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions(userId))
	const router = useRouter()

	const instrumento = instrumentos?.find(i => i.id === id)

	if (!instrumento) return <div>No se encontró el instrumento</div>

	return (
		<article className="w-full pt-10">
			<BackChevron to="/perfil/instrumentos" />
			<Title text="Editar Instrumento" />
			<div className="w-11/12 mx-auto mt-8">
				<EditInstrumentoForm
					instrumento={instrumento}
					onClose={() => router.navigate({ to: "/perfil/instrumentos" })}
				/>
			</div>
		</article>
	)
}

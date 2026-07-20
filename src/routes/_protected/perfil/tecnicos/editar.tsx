import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { tecnicoQueryOptions } from "../../../../../queries/tecnico/tecnico-query"
import { EditTecnicoForm } from "#/components/tecnicos/edit-tecnico"
import BackChevron from "#/components/back-chevron"
import Title from "#/components/title"

export const Route = createFileRoute("/_protected/perfil/tecnicos/editar")({
	component: RouteComponent,
})

function RouteComponent() {
	const { data: tecnicoData } = useSuspenseQuery(tecnicoQueryOptions)
	const router = useRouter()

	const tecnico = Array.isArray(tecnicoData) ? tecnicoData[0] : tecnicoData

	if (!tecnico) return <div>No se encontró el técnico</div>

	return (
		<article className="w-full pt-10">
			<BackChevron to="/perfil/tecnicos" />
			<Title text="Editar Técnico" />
			<div className="w-11/12 mx-auto mt-8">
				<EditTecnicoForm
					tecnico={tecnico}
					onClose={() => router.navigate({ to: "/perfil/tecnicos" })}
				/>
			</div>
		</article>
	)
}

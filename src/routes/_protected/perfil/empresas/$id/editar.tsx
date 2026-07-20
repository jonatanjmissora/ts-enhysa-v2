import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { empresasQueryOptions } from "../../../../../../queries/empresas/empresas-query"
import { EditEmpresaForm } from "#/components/empresas/edit-empresa"
import BackChevron from "#/components/back-chevron"
import Title from "#/components/title"

export const Route = createFileRoute(
	"/_protected/perfil/empresas/$id/editar"
)({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions)
	const router = useRouter()

	const empresa = empresas?.find(e => e.id === id)

	if (!empresa) return <div>No se encontró la empresa</div>

	return (
		<article className="w-full pt-10">
			<BackChevron to="/perfil/empresas" />
			<Title text="Editar Empresa" />
			<div className="w-11/12 mx-auto mt-8">
				<EditEmpresaForm
					empresa={empresa}
					onClose={() => router.navigate({ to: "/perfil/empresas" })}
				/>
			</div>
		</article>
	)
}

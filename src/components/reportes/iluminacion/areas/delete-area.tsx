import { Button } from "@/components/ui/button"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Trash2, Loader } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "@tanstack/react-router"
import type { AreaIluminacionType } from "../../../../../db/reportes/iluminacion/areas/schema"
import { useDeleteArea } from "../../../../../queries/reportes/iluminacion/areas/use-delete-area"
import { areaIdValidator } from "../../../../../db/reportes/iluminacion/areas/area-validator"

export default function DeleteAreaAlert({
	area,
	setIsMenuOpen,
}: {
	area: AreaIluminacionType
	setIsMenuOpen: (open: boolean) => void
}) {
	const [open, setOpen] = useState(false)

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild className="hover:bg-accent">
				<div className="w-full flex items-center gap-2 justify-center p-4">
					<Trash2 size={14} className="text-destructive-foreground" />
					Borrar
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent className="p-8 sm:p-20 sm:py-15 2xl:py-20 bg-accent/80 backdrop-blur-xl w-full sm:w-1/2 min-h-[50dvh]">
				<AlertDialogTitle className="h-max sm:text-lg 2xl:text-2xl font-semibold tracking-wider py-2 border-b border-foreground/20 w-full mb-10">
					Eliminar Area
				</AlertDialogTitle>
				<AlertDialogDescription className="text-center">
					<DeleteAreaForm
						area={area}
						setOpen={setOpen}
						setIsMenuOpen={setIsMenuOpen}
					/>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

function DeleteAreaForm({
	area,
	setOpen,
	setIsMenuOpen,
}: {
	area: AreaIluminacionType
	setOpen: (open: boolean) => void
	setIsMenuOpen: (open: boolean) => void
}) {
	const {
		mutateAsync: deleteAreaMutation,
		error,
		isPending,
	} = useDeleteArea(area.id)

	const router = useRouter()
	const form = useForm({
		defaultValues: {
			id: area.id,
		},
		validators: {
			onSubmit: areaIdValidator,
		},
		onSubmit: async ({ value }) => {
			const result = await deleteAreaMutation({ data: { id: value.id } })

			if (!result) {
				console.error("Error al eliminar el area", error)
				return
			}
			setIsMenuOpen(false)
			console.log("Area eliminada exitosamente")
			router.invalidate()
		},
	})

	return (
		<form
			id="create-form"
			className="flex flex-col items-center justify-center gap-6"
			onSubmit={e => {
				e.preventDefault()
				form.handleSubmit()
			}}
		>
			<p className="text-center sm:text-lg 2xl:text-2xl font-semibold">
				¿Estás seguro de borrar {area.nombre.toUpperCase()}?
			</p>

			<p className="text-center opacity-50 sm:text-sm 2xl:text-base text-pretty w-3/4 mb-8">
				Esta acción no se puede deshacer. Esto eliminará permanentemente el dato
				de nuestros servidores.
			</p>

			<div className="flex justify-center items-center gap-2 w-full">
				<Button
					type="button"
					variant="outline"
					onClick={() => {
						setOpen(false)
					}}
					className="w-1/2"
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					disabled={isPending}
					className="w-1/2 cursor-pointer my-shadow"
				>
					{isPending ? (
						<div className="flex gap-2 items-center justify-center">
							Eliminando... <Loader className="animate-spin size-4"></Loader>
						</div>
					) : (
						"Eliminar"
					)}
				</Button>
			</div>
			{error && (
				<p className="text-red-500 text-xs">Error al eliminar la empresa</p>
			)}
		</form>
	)
}

import { Button } from "@/components/ui/button"
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { Trash2, Loader } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import type { LocalizadaIluminacionType } from "../../../../../../db/reportes/iluminacion/localizadas/schema"
import { useDeleteLocalizada } from "../../../../../../queries/reportes/iluminacion/localizadas/use-delete-localizada"
import { localizadaIdValidator } from "../../../../../../db/reportes/iluminacion/localizadas/localizada-validator"

export default function DeleteLocalizadaAlert({
	localizada,
	setIsMenuOpen,
}: {
	localizada: LocalizadaIluminacionType
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
					Eliminar Localizada
				</AlertDialogTitle>
				<AlertDialogDescription asChild>
					<div className="text-center">
						<DeleteLocalizadaForm
							localizada={localizada}
							setOpen={setOpen}
							setIsMenuOpen={setIsMenuOpen}
						/>
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

function DeleteLocalizadaForm({
	localizada,
	setOpen,
	setIsMenuOpen,
}: {
	localizada: LocalizadaIluminacionType
	setOpen: (open: boolean) => void
	setIsMenuOpen: (open: boolean) => void
}) {
	const {
		mutateAsync: deleteLocalizadaMutation,
		error,
		isPending,
	} = useDeleteLocalizada(localizada.id, localizada.reportId)

	const form = useForm({
		defaultValues: {
			id: localizada.id,
		},
		validators: {
			onSubmit: localizadaIdValidator,
		},
		onSubmit: async ({ value }) => {
			const result = await deleteLocalizadaMutation({ data: { id: value.id } })

			if (!result) {
				console.error("Error al eliminar la localizada", error)
				return
			}
			setIsMenuOpen(false)
			console.log("Localizada eliminada exitosamente")
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
				¿Estás seguro de borrar {localizada.nombre.toUpperCase()}?
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
						if (setIsMenuOpen) setIsMenuOpen(false)
					}}
					className="w-1/2"
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					disabled={isPending}
					className="w-1/2 cursor-pointer"
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
				<p className="text-red-500 text-xs">Error al eliminar la localizada</p>
			)}
		</form>
	)
}

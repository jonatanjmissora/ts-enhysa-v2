import { useState } from "react"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader, Trash2 } from "lucide-react"
import { useRouter } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { Button } from "../ui/button"
import Title from "../title"
import type { InstrumentoType } from "../../../db/instrumentos/schema"
import { useDeleteInstrumento } from "../../../queries/instrumentos/use-delete-instrumento"
import { instrumentoIdValidator } from "../../../db/instrumentos/instrumento-validator"

export default function DeleteInstrumento({
	instrumento,
	setIsMenuOpen,
}: {
	instrumento: InstrumentoType
	setIsMenuOpen?: (open: boolean) => void
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
				<AlertDialogTitle>
					<Title text="Eliminar Instrumento" />
				</AlertDialogTitle>
				<AlertDialogDescription asChild>
					<div className="text-center">
						<DeleteInstrumentoForm
							instrumento={instrumento}
							setOpen={setOpen}
							setIsMenuOpen={setIsMenuOpen}
						/>
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

function DeleteInstrumentoForm({
	instrumento,
	setOpen,
	setIsMenuOpen,
}: {
	instrumento: InstrumentoType
	setOpen: (open: boolean) => void
	setIsMenuOpen?: (open: boolean) => void
}) {
	const {
		mutateAsync: deleteInstrumentoMutation,
		error,
		isPending,
	} = useDeleteInstrumento(instrumento.id)

	const router = useRouter()
	const form = useForm({
		defaultValues: {
			id: instrumento.id,
		},
		validators: {
			onSubmit: instrumentoIdValidator,
		},
		onSubmit: async ({ value }) => {
			const result = await deleteInstrumentoMutation({ data: { id: value.id } })

			if (!result) {
				console.error("Error al eliminar el instrumento", error)
			}
			if (setIsMenuOpen) setIsMenuOpen(false)
			console.log("Instrumento eliminado exitosamente")
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
				¿Estás seguro de borrar {instrumento.nombre.toUpperCase()} -{" "}
				{instrumento.marca.toUpperCase()} - {instrumento.modelo.toUpperCase()}?
			</p>

			<p className="text-center opacity-50 sm:text-sm 2xl:text-base text-pretty w-3/4 mb-8">
				Esta acción no se puede deshacer. Esto eliminará permanentemente el dato
				de nuestros servidores.
			</p>

			<div className="flex justify-center items-center gap-2 w-full">
				<Button
					variant={"outline"}
					type="button"
					onClick={() => {
						setOpen(false)
						if (setIsMenuOpen) setIsMenuOpen(false)
					}}
					className="flex-1"
				>
					Cancelar
				</Button>
				<Button type="submit" disabled={isPending} className="flex-1">
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

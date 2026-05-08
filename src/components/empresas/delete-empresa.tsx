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
import type { EmpresaType } from "../../../db/empresas/schema"
import { useDeleteEmpresa } from "../../../queries/empresas/use-delete-empresa"
import { empresaIdValidator } from "../../../db/empresas/empresa-validator"
import { Button } from "../ui/button"

export default function DeleteEmpresa({
	empresa,
	setIsMenuOpen,
}: {
	empresa: EmpresaType
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
				<AlertDialogTitle className="h-max sm:text-lg 2xl:text-2xl font-semibold tracking-wider py-2 border-b border-foreground/20 w-full mb-10">
					Eliminar Empresa
				</AlertDialogTitle>
				<AlertDialogDescription asChild>
					<div className="text-center">
						<DeleteEmpresaForm
							empresa={empresa}
							setOpen={setOpen}
							setIsMenuOpen={setIsMenuOpen}
						/>
					</div>
				</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	)
}

function DeleteEmpresaForm({
	empresa,
	setOpen,
	setIsMenuOpen,
}: {
	empresa: EmpresaType
	setOpen: (open: boolean) => void
	setIsMenuOpen?: (open: boolean) => void
}) {
	const {
		mutateAsync: deleteEmpresaMutation,
		error,
		isPending,
	} = useDeleteEmpresa(empresa.id)

	const router = useRouter()
	const form = useForm({
		defaultValues: {
			id: empresa.id,
		},
		validators: {
			onSubmit: empresaIdValidator,
		},
		onSubmit: async ({ value }) => {
			const result = await deleteEmpresaMutation({ data: { id: value.id } })

			if (!result) {
				console.error("Error al eliminar la empresa", error)
			}
			if (setIsMenuOpen) setIsMenuOpen(false)
			console.log("Empresa eliminada exitosamente")
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
				¿Estás seguro de borrar {empresa.razonSocial.toUpperCase()}?
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

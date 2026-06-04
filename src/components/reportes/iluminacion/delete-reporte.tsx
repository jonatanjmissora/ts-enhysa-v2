import { useState } from "react"
import type { ReporteIluminacionType } from "../../../../db/reportes/iluminacion/schema"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader, Trash2 } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { Button } from "../../ui/button"
import { useDeleteReporte } from "../../../../queries/reportes/iluminacion/use-delete-reporte"
import { reporteIluminacionIdValidator } from "../../../../db/reportes/iluminacion/reporte-validator"

export default function DeleteReporte({
    reporte,
    setIsMenuOpen,
}: {
    reporte: ReporteIluminacionType
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
                    Eliminar Informe
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                    <div className="text-center">
                        <DeleteReporteForm
                            reporte={reporte}
                            setOpen={setOpen}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    </div>
                </AlertDialogDescription>
            </AlertDialogContent>
        </AlertDialog>
    )
}

function DeleteReporteForm({
    reporte,
    setOpen,
    setIsMenuOpen,
}: {
    reporte: ReporteIluminacionType
    setOpen: (open: boolean) => void
    setIsMenuOpen?: (open: boolean) => void
}) {
    const navigate = useNavigate()
    const {
        mutateAsync: deleteReporteMutation,
        error,
        isPending,
    } = useDeleteReporte(reporte.id)

    const form = useForm({
        defaultValues: {
            id: reporte.id,
        },
        validators: {
            onSubmit: reporteIluminacionIdValidator,
        },
        onSubmit: async ({ value }) => {
            const result = await deleteReporteMutation({ data: { id: value.id } })

            if (!result) {
                console.error("Error al eliminar el reporte", error)
            }
            if (setIsMenuOpen) setIsMenuOpen(false)
            setOpen(false)
            console.log("Reporte eliminado exitosamente")
            navigate({ to: "/iluminacion/reportes" })
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
                ¿Estás seguro de borrar {reporte.title.toUpperCase()} del {reporte.finishedAt ? reporte.finishedAt.toLocaleDateString("it-IT") : "(En curso)"}?
            </p>

            <p className="text-center opacity-50 sm:text-sm 2xl:text-base text-pretty w-3/4 mb-8">
                Esta acción no se puede deshacer. Esto eliminará permanentemente el dato
                de nuestros servidores.
            </p>

            <div className="flex justify-center items-center gap-4 flex-col sm:flex-row w-full">
                <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => {
                        setOpen(false)
                        if (setIsMenuOpen) setIsMenuOpen(false)
                    }}
                    className="flex-1 w-full"
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={isPending} className="flex-1 w-full">
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
                <p className="text-red-500 text-xs">Error al eliminar el reporte</p>
            )}
        </form>
    )
}
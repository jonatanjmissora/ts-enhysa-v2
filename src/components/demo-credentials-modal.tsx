import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"

export function DemoCredentialsModal({
	email,
	password,
	onConfirm,
}: {
	email: string
	password: string
	onConfirm: () => void
}) {
	return (
		<AlertDialog open>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Sesión demo iniciada</AlertDialogTitle>
					<AlertDialogDescription>
						Podés usar estas credenciales para ingresar desde otro dispositivo:
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex flex-col gap-3 px-6 py-4 bg-muted rounded-lg">
					<div className="flex items-center justify-between gap-4">
						<span className="text-sm font-semibold">Email:</span>
						<code className="text-sm bg-background px-3 py-1 rounded font-mono select-all">
							{email}
						</code>
					</div>
					<div className="flex items-center justify-between gap-4">
						<span className="text-sm font-semibold">Contraseña:</span>
						<code className="text-sm bg-background px-3 py-1 rounded font-mono select-all">
							{password}
						</code>
					</div>
				</div>
				<AlertDialogFooter>
					<Button onClick={onConfirm}>Entendido, continuar</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

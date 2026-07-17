import { useState, useRef, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Field, FieldError, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { VALORES_REQUERIDOS_OBJ } from "#/lib/constants"

type ValorRequeridoFieldProps = {
	field: any
	from: string
	label?: string
}

export function ValorRequeridoField({
	field,
	from,
	label = "Valor Requerido",
}: ValorRequeridoFieldProps) {
	const [inputVal, setInputVal] = useState(field.state.value)
	const [open, setOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const digits = inputVal.replace(/[^0-9]/g, "")
	const firstDigit = digits.charAt(0)
	const suggestions =
		firstDigit && firstDigit in VALORES_REQUERIDOS_OBJ
			? VALORES_REQUERIDOS_OBJ[firstDigit].filter(v =>
					v.startsWith(digits),
				)
			: []

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

	return (
		<div ref={containerRef}>
			<Field data-invalid={isInvalid} className="relative gap-1">
				<FieldLabel
					htmlFor={field.name}
					className="flex items-center gap-3 textL"
				>
					{label}
					<Link
						to="/teoria"
						search={{
							t: "iluminacionValoresRequeridos",
							from: from,
						}}
						className="ml-auto border-b border-orange-500/75 text-xs text-orange-500"
					>
						Ver Tablas
					</Link>
				</FieldLabel>

				<div className="relative">
					<Input
						id={field.name}
						name={field.name}
						value={inputVal}
						onFocus={() => setOpen(true)}
						onBlur={field.handleBlur}
						onChange={e => {
							setInputVal(e.target.value)
							field.handleChange(e.target.value)
							setOpen(true)
						}}
						aria-invalid={isInvalid}
						placeholder="Ej. 100"
						className="text-right"
					/>
					{open && suggestions.length > 0 && (
						<ul className="absolute z-50 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover text-popover-foreground shadow-md max-h-48 overflow-y-auto">
							{suggestions.map(s => (
								<li
									key={s}
									onMouseDown={() => {
										setInputVal(s)
										field.handleChange(s)
										setOpen(false)
									}}
									className="px-3 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
								>
									{s}
								</li>
							))}
						</ul>
					)}
				</div>

				{isInvalid && (
					<FieldError
						errors={field.state.meta.errors}
						className="text-xs 2xl:text-sm absolute -bottom-4 left-0"
					/>
				)}
			</Field>
		</div>
	)
}

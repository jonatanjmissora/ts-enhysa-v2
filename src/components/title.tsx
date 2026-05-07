export default function Title({
	text,
	className,
}: {
	text: string
	className?: string
}) {
	return (
		<span
			className={`block text-lg text-center w-11/12 mx-auto tracking-widest font-semibold py-2 border-b border-foreground/50 my-6 ${className}`}
		>
			{text}
		</span>
	)
}

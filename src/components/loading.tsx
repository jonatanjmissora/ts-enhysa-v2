export default function Loading({
	text,
	className,
}: {
	text?: string
	className?: string
}) {
	return (
		<div
			className={`h-svh w-screen flex items-center justify-center flex-col gap-4 opacity-50 ${className}`}
		>
			<img
				src="/EnHySa_logo.webp"
				alt="logo EnHySa"
				className="size-50 animate-pulse"
			/>

			<div className="flex leading-none text-[3rem] font-semibold tracking-[1rem] dark:text-shadow-lg/50">
				<span className="animate-bounce delay-50">E</span>
				<span className="animate-bounce delay-100">n</span>
				<span className="animate-bounce delay-150">H</span>
				<span className="animate-bounce delay-200">y</span>
				<span className="animate-bounce delay-250">S</span>
				<span className="animate-bounce delay-300">a</span>
			</div>

			{text && (
				<span className="w-11/12 mx-auto text-center text-2xl my-12 italic tracking-wider">
					{text}
				</span>
			)}
		</div>
	)
}

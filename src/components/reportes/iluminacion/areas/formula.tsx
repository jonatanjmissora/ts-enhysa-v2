import { getIndiceDeLocal, getIndiceRedondeo } from "@/lib/utils"
import { Equal, EqualApproximately } from "lucide-react"

export default function Formula({
	alto,
	ancho,
	largo,
}: {
	alto: number
	ancho: number
	largo: number
}) {
	const indiceDeLocal = getIndiceDeLocal(largo, ancho, alto)
	const indiceRedondeo = getIndiceRedondeo(indiceDeLocal)
	return (
		<div className="w-5/6 sm:w-full mx-auto flex flex-col items-stretch justify-between gap-3">
			<span className="w-full italic font-semibold text-foreground/50 tracking-widest border-b border-foreground/10 text-left">
				Indice del local{" "}
			</span>

			<div className="w-full flex sm:flex-row flex-col">
				<div className="flex flex-col gap-2 justify-center items-center flex-1">
					<div className="flex justify-end items-center gap-3 py-4 text-xs sm:text-base">
						<div className="flex flex-col">
							<span className="p-1 border-b border-foreground/50 w-full text-center sm:px-10">
								{ancho} * {largo}
							</span>
							<span className="p-1 text-center">
								{alto} * ( {ancho} + {largo} )
							</span>
						</div>
						<Equal size={16} />
						<span className="italic font-semibold text-xs sm:text-lg tracking-widest">
							{indiceDeLocal.toFixed(2)}
						</span>
						<EqualApproximately size={16} />
						<span className="text-xl sm:text-2xl bg-teal-500/50 px-4 py-1 rounded-lg">
							{indiceRedondeo.toFixed(0)}
						</span>
					</div>
				</div>

				<div className="flex-1 flex flex-col gap-2 items-center justify-end">
					<span className="text-2xl sm:text-3xl font-semibold bg-pink-500/50 px-4 py-1 rounded-lg">
						{(indiceRedondeo + 2) ** 2}
					</span>
					<span className="italic textXS">Número de mediciones</span>
				</div>
			</div>

			<span className="italic  border-t border-foreground/10 py-2 w-full text-right textXS text-foreground/50">
				Res. 84/2012 S.R.T.
			</span>
		</div>
	)
}

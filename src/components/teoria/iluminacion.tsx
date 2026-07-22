export default function IluminacionContent() {
	return (
		<>
			<p className="text-foreground-soft">
				Decreto 351/79 - Anexo IV y Resolución SRT 84/2012. Exigencias mínimas
				de iluminación en la República Argentina.
			</p>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">
					Niveles Mínimos de Iluminación
				</h2>
				<p className="text-sm text-foreground-soft">
					El Decreto 351/79 (Anexo IV) establece los lux mínimos según la
					dificultad de la tarea visual:
				</p>
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/50">
								<th className="text-left p-3 font-medium">Tarea</th>
								<th className="text-left p-3 font-medium">
									Iluminancia Mínima
								</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							<tr>
								<td className="p-3">Pasillos y zonas de circulación general</td>
								<td className="p-3 font-mono">50 Lux</td>
							</tr>
							<tr>
								<td className="p-3">
									Tareas con requerimiento visual simple (Depósitos)
								</td>
								<td className="p-3 font-mono">100 — 200 Lux</td>
							</tr>
							<tr>
								<td className="p-3">
									Trabajos de oficina general, lectura y pantallas
								</td>
								<td className="p-3 font-mono">300 Lux</td>
							</tr>
							<tr>
								<td className="p-3">
									Tareas de alta precisión o talleres de control
								</td>
								<td className="p-3 font-mono">500 — 1000 Lux</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Interpretación</h2>
				<ul className="space-y-3 text-sm text-foreground-soft">
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-foreground-soft shrink-0 mt-0.5">
							50 Lux
						</span>
						<span>
							Solo para tránsito peatonal sin riesgo. No se realiza ninguna
							tarea visual continua en estos sectores.
						</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-foreground-soft shrink-0 mt-0.5">
							100–200 Lux
						</span>
						<span>
							Tareas gruesas donde el detalle no es crítico. Aplica a depósitos,
							almacenes y zonas de paso donde se manipulan objetos grandes.
						</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-foreground-soft shrink-0 mt-0.5">
							300 Lux
						</span>
						<span>
							Umbral para trabajo administrativo y visual continuo. Oficinas,
							lectura prolongada, uso de pantallas y tareas de escritorio en
							general.
						</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-xs font-bold text-foreground-soft shrink-0 mt-0.5">
							500–1000 Lux
						</span>
						<span>
							Tareas finas que requieren agudeza visual sostenida: control de
							calidad, laboratorios, montaje fino, talleres de precisión.
						</span>
					</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Protocolo SRT 84/2012</h2>
				<p className="text-sm text-foreground-soft">
					La Resolución SRT 84/2012 define el procedimiento obligatorio para la
					medición y registro de los niveles de iluminación en los
					establecimientos laborales.
				</p>
				<ul className="list-disc list-inside text-sm space-y-1 text-foreground-soft">
					<li>Registro del lux media, uniformidad y factor de mantenimiento</li>
					<li>Croquis del sector con puntos de medición</li>
					<li>Datos del instrumento (luxómetro calibrado)</li>
					<li>Firma del profesional interviniente</li>
					<li>
						Vigencia máxima de 12 meses (salvo modificaciones del entorno)
					</li>
				</ul>
			</section>
		</>
	)
}

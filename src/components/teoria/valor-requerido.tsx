const INDUSTRIAS = [
	{
		label: "Vivienda",
		rows: [
			["Baño — Iluminación general", "100 lux"],
			[
				"Baño — Iluminación localizada sobre espejos",
				"200 lux (plano vertical)",
			],
			["Dormitorio — Iluminación general", "200 lux"],
			["Dormitorio — Iluminación localizada (cama, espejo)", "200 lux"],
			["Cocina — Sobre zona de trabajo (cocina, pileta, mesada)", "200 lux"],
		],
	},
	{
		label: "Centros Comerciales",
		rows: [
			["Iluminación general (mediana importancia)", "1000 lux"],
			["Iluminación general (baja importancia)", "500 lux"],
			["Depósito de mercaderías", "300 lux"],
		],
	},
	{
		label: "Hoteles",
		rows: [
			["Pasillos, palier y ascensor", "100 lux"],
			["Hall de entrada", "300 lux"],
			["Escalera", "100 lux"],
			["Local para ropa blanca — Iluminación general", "200 lux"],
			["Local para ropa blanca — Costura", "400 lux"],
			["Lavandería", "100 lux"],
			["Vestuarios", "100 lux"],
			["Sótano, bodegas", "70 lux"],
			["Depósitos", "100 lux"],
		],
	},
	{
		label: "Garajes y Estaciones de Servicio",
		rows: [
			["Iluminación general", "100 lux"],
			["Gomería", "200 lux"],
		],
	},
	{
		label: "Oficinas",
		rows: [
			["Halls para el público", "200 lux"],
			[
				"Contaduría, tabulaciones, teneduría de libros, operaciones bursátiles",
				"500 lux",
			],
			["Trabajo general de oficinas, lectura, archivo", "500 lux"],
			["Trabajos especiales (sistemas de computación de datos)", "750 lux"],
			["Sala de conferencias", "300 lux"],
			["Circulación", "200 lux"],
		],
	},
	{
		label: "Bancos",
		rows: [
			["Iluminación general", "500 lux"],
			["Sobre zonas de escritura y cajas", "750 lux"],
			["Sala de caudales", "500 lux"],
		],
	},
	{
		label: "Industrias Alimenticias",
		rows: [
			["Mataderos — Recepción", "50 lux"],
			["Mataderos — Inspección", "300 lux"],
			["Mataderos — Matanza, deshollado, escaldado", "100 lux"],
			["Mataderos — Evisceración", "300 lux"],
			["Frigoríficos — Cámaras frías", "50 lux"],
			["Frigoríficos — Salas de máquinas", "150 lux"],
			["Conservas de carne — Corte, deshuesado", "300 lux"],
			["Conservas de pescado — Recepción", "300 lux"],
			["Conservas de verduras — Recepción y selección", "300 lux"],
			["Panaderías — Amasado sobre artesas", "200 lux"],
			["Panaderías — Cocción delante de hornos", "300 lux"],
			["Pastas alimenticias — Elaboración", "200 lux"],
			["Usinas pasteurizadoras — Laboratorio", "600 lux"],
			["Fábrica de derivados lácteos — Elaboración", "300 lux"],
			["Fábrica de azúcar — Elaboración", "200 lux"],
		],
	},
	{
		label: "Metalúrgica",
		rows: [
			["Fundiciones — Depósito de barras y lingotes", "100 lux"],
			["Fundiciones — Fabricación de noyos fino", "300 lux"],
			["Fundiciones — Taller de moldeo (iluminación general)", "250 lux"],
			["Fundiciones — Iluminación localizada en moldes", "500 lux"],
			["Acerías — Zona de colado", "100 lux"],
			["Mecánica general — Trabajo grueso (control)", "300 lux"],
			["Mecánica general — Trabajo mediano (ensamble previo)", "600 lux"],
			["Mecánica general — Trabajo fino (calibración)", "1200 lux"],
			[
				"Mecánica general — Trabajo muy fino (calibración e inspección)",
				"2000 lux",
			],
			["Mecánica general — Trabajo minucioso", "3000 lux"],
			["Talleres de montaje — Trabajo grueso", "200 lux"],
			["Talleres de montaje — Trabajo mediano", "400 lux"],
			[
				"Talleres de montaje — Trabajo fino (iluminación localizada)",
				"1200 lux",
			],
			[
				"Máquinas herramientas — Iluminación localizada trabajos delicados",
				"1000 lux",
			],
			["Soldadura", "300 lux"],
			["Pintura — Preparación, dosaje y mezcla de colores", "1000 lux"],
		],
	},
	{
		label: "Del Calzado",
		rows: [
			["Clasificación, marcado y corte", "400 lux"],
			["Costura", "600 lux"],
			["Inspección", "1000 lux"],
		],
	},
	{
		label: "Centrales Eléctricas",
		rows: [
			["Estaciones de transformación — Circulación", "100 lux"],
			["Locales de máquinas rotativas", "200 lux"],
			["Tableros — Sobre el plano de lectura", "400 lux"],
			["Subestaciones — Interiores", "100 lux"],
		],
	},
	{
		label: "Cerámica",
		rows: [
			["Preparación, amasado, molde, prensas, hornos", "200 lux"],
			["Barnizado y decoración — Trabajos finos", "800 lux"],
			["Barnizado y decoración — Trabajos medianos", "400 lux"],
			["Inspección — Iluminación localizada", "1000 lux"],
		],
	},
	{
		label: "Imprenta",
		rows: [
			["Taller de tipografía — Iluminación general", "300 lux"],
			["Taller de tipografía — Mesa de correctores", "800 lux"],
			["Taller de linotipos — Iluminación general", "300 lux"],
			["Inspección de impresión de colores", "1000 lux"],
			["Grabado a mano — Iluminación localizada", "1000 lux"],
			["Litografía", "700 lux"],
		],
	},
	{
		label: "Joyería y Relojería",
		rows: [
			["Zona de trabajo — Iluminación general", "400 lux"],
			["Trabajos finos", "900 lux"],
			["Trabajos minuciosos", "2000 lux"],
			["Corte de gemas, pulido y engarce", "1300 lux"],
		],
	},
	{
		label: "Maderera",
		rows: [
			["Aserraderos — Iluminación general", "100 lux"],
			["Aserraderos — Zona de corte y clasificación", "200 lux"],
			["Carpintería — Zona de bancos y máquinas", "300 lux"],
			["Carpintería — Trabajos de terminación e inspección", "600 lux"],
			["Manufactura de muebles — Selección del enchapado", "900 lux"],
		],
	},
	{
		label: "Textil",
		rows: [
			["Algodón y lino — Mezcla, cardado, hilado", "200 lux"],
			["Algodón y lino — Urdimbre sobre los peines", "700 lux"],
			["Algodón y lino — Tejido telas claras", "400 lux"],
			["Algodón y lino — Tejido telas oscuras", "700 lux"],
			["Algodón y lino — Inspección telas claras", "600 lux"],
			["Algodón y lino — Inspección telas oscuras", "900 lux"],
			["Lana — Tejido telas claras", "600 lux"],
			["Lana — Tejido telas oscuras", "900 lux"],
			["Lana — Máquinas de tejidos de punto", "900 lux"],
			["Lana — Inspección telas claras", "1200 lux"],
			["Lana — Inspección telas oscuras", "1500 lux"],
			["Seda — Tejido telas claras y medianas", "600 lux"],
			["Seda — Tejido telas oscuras", "900 lux"],
		],
	},
	{
		label: "Del Vestido",
		rows: [
			["Sombreros — Limpieza, tintura, planchado", "400 lux"],
			["Sombreros — Costura", "600 lux"],
			["Vestimenta — Sobre máquinas", "600 lux"],
			["Vestimenta — Manual", "800 lux"],
			["Fábrica de guantes — Costura", "600 lux"],
			["Fábrica de guantes — Control", "1000 lux"],
		],
	},
	{
		label: "Del Vidrio",
		rows: [
			["Sala de mezclado — Iluminación general", "200 lux"],
			["Sala de mezclado — Zona de dosificación", "400 lux"],
			["Local de horno", "100 lux"],
			["Manufactura manual — Iluminación general", "200 lux"],
			["Corte, pulido y biselado", "400 lux"],
			["Inspección general", "400 lux"],
		],
	},
	{
		label: "Química",
		rows: [
			["Planta de procesamiento — Circulación general", "100 lux"],
			["Planta de procesamiento — Sobre mesas y pupitres", "400 lux"],
			["Laboratorio de ensayo — Iluminación general", "400 lux"],
			["Laboratorio de ensayo — Plano de lectura de aparatos", "600 lux"],
			["Jabones — Iluminación general", "300 lux"],
			["Pinturas — Mezcla de pinturas", "600 lux"],
			["Pinturas — Combinación de colores", "1000 lux"],
			["Plásticos — Calandrado, extrusión, inyección", "300 lux"],
		],
	},
	{
		label: "Papelera",
		rows: [
			["Local de máquinas", "100 lux"],
			["Corte, terminación", "300 lux"],
			["Inspección", "500 lux"],
		],
	},
	{
		label: "Depósitos y Almacenes",
		rows: [
			["Piezas grandes", "100 lux"],
			["Piezas pequeñas", "200 lux"],
			["Expedición de mercaderías", "300 lux"],
		],
	},
]

export default function IluminacionValoresRequeridosContent() {
	return (
		<>
			<div className="space-y-4">
				<p className="text-muted-foreground leading-relaxed">
					Anexo IV — Decreto 351/79, Capítulo 12 (Iluminación y Color).
					Establece las intensidades mínimas de iluminación sobre el plano de
					trabajo según la dificultad de la tarea visual y el destino del local.
				</p>

				<hr className="border-t border-border/50" />
			</div>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold tracking-tight">
					Tabla 1 — Clases de Tarea Visual
				</h2>
				<p className="text-sm text-muted-foreground">
					Intensidad media de iluminación según IRAM-AADL J 20-06. Usar estos
					valores para tareas no incluidas en la Tabla 2.
				</p>
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/50">
								<th className="text-left p-3 font-medium w-[35%]">
									Clase de tarea visual
								</th>
								<th className="text-left p-3 font-medium w-[20%]">
									Iluminación
								</th>
								<th className="text-left p-3 font-medium">Ejemplos</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60">
							<tr className="even:bg-muted/20">
								<td className="p-3">Visión ocasional solamente</td>
								<td className="p-3 font-mono tabular-nums">100 lux</td>
								<td className="p-3 text-muted-foreground text-xs">
									Lugares de poco tránsito: sala de calderas, depósito de
									materiales voluminosos
								</td>
							</tr>
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Tareas intermitentes ordinarias y fáciles, con contrastes
									fuertes
								</td>
								<td className="p-3 font-mono tabular-nums">100 – 300 lux</td>
								<td className="p-3 text-muted-foreground text-xs">
									Trabajos simples e intermitentes, inspección general, contado
									de partes de stock, colocación de maquinaria pesada
								</td>
							</tr>
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Tarea moderadamente crítica y prolongada, con detalles
									medianos
								</td>
								<td className="p-3 font-mono tabular-nums">300 – 750 lux</td>
								<td className="p-3 text-muted-foreground text-xs">
									Trabajos medianos mecánicos y manuales, inspección y montaje;
									trabajos comunes de oficina: lectura, escritura y archivo
								</td>
							</tr>
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Tareas severas y prolongadas, de poco contraste
								</td>
								<td className="p-3 font-mono tabular-nums">750 – 1500 lux</td>
								<td className="p-3 text-muted-foreground text-xs">
									Trabajos finos mecánicos y manuales, montaje e inspección;
									pintura extrafina, sopleteado, costura de ropa oscura
								</td>
							</tr>
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Tareas muy severas y prolongadas, con detalles minuciosos o
									muy poco contraste
								</td>
								<td className="p-3 font-mono tabular-nums">1500 – 3000 lux</td>
								<td className="p-3 text-muted-foreground text-xs">
									Montaje e inspección de mecanismos delicados, fabricación de
									herramientas y matrices, trabajo de molienda fina
								</td>
							</tr>
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Tareas excepcionales, difíciles o importantes
								</td>
								<td className="p-3 font-mono tabular-nums">3000 lux</td>
								<td className="p-3 text-muted-foreground text-xs">
									Trabajo fino de relojería y reparación
								</td>
							</tr>
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Tareas excepcionales, difíciles o importantes
								</td>
								<td className="p-3 font-mono tabular-nums">
									5000 – 10.000 lux
								</td>
								<td className="p-3 text-muted-foreground text-xs">
									Casos especiales: iluminación del campo operatorio en sala de
									cirugía
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold tracking-tight">
					Tabla 2 — Intensidad Mínima por Tipo de Edificio y Local
				</h2>
				<p className="text-sm text-muted-foreground">
					Valor mínimo de servicio de iluminación (lux) según IRAM-AADL J 20-06,
					organizado por industria y sector.
				</p>
				<div className="space-y-3">
					{INDUSTRIAS.map(industria => (
						<details
							key={industria.label}
							className="group rounded-xl border border-border/60 overflow-hidden"
						>
							<summary className="flex items-center justify-between px-4 py-3 cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors list-none marker:hidden select-none">
								<span className="font-medium text-sm">{industria.label}</span>
								<svg
									className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<title>Abrir/cerrar</title>
									<path d="M6 9l6 6 6-6" />
								</svg>
							</summary>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<tbody className="divide-y divide-border/40">
										{industria.rows.map((row, i) => (
											<tr key={i} className="even:bg-muted/10">
												<td className="p-3 pl-4 text-xs sm:text-sm">
													{row[0]}
												</td>
												<td className="p-3 font-mono tabular-nums text-xs sm:text-sm text-right whitespace-nowrap">
													{row[1]}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</details>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold tracking-tight">
					Tabla 3 — Relación de Máximas Luminancias
				</h2>
				<p className="text-sm text-muted-foreground">
					Relaciones máximas admisibles para evitar diferencias de iluminancias
					causantes de incomodidad visual o deslumbramiento.
				</p>
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/50">
								<th className="text-left p-3 font-medium">
									Zona del campo visual
								</th>
								<th className="text-left p-3 font-medium">
									Relación con la tarea visual
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60">
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Campo visual central (cono de 30° de abertura)
								</td>
								<td className="p-3 font-mono tabular-nums">3 : 1</td>
							</tr>
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Campo visual periférico (cono de 90° de abertura)
								</td>
								<td className="p-3 font-mono tabular-nums">10 : 1</td>
							</tr>
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Entre la fuente de luz y el fondo sobre el cual se destaca
								</td>
								<td className="p-3 font-mono tabular-nums">20 : 1</td>
							</tr>
							<tr className="even:bg-muted/20">
								<td className="p-3">
									Entre dos puntos cualesquiera del campo visual
								</td>
								<td className="p-3 font-mono tabular-nums">40 : 1</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold tracking-tight">
					Tabla 4 — Iluminación General Mínima
				</h2>
				<p className="text-sm text-muted-foreground">
					Iluminación general mínima en función de la iluminancia localizada.
					Cuando se ilumine en forma localizada, la iluminación general no podrá
					tener una intensidad menor a la indicada.
				</p>
				<div className="overflow-x-auto rounded-xl border">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-muted/50">
								<th className="text-left p-3 font-medium">
									Iluminación localizada
								</th>
								<th className="text-left p-3 font-medium">
									Iluminación general mínima
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60">
							{[
								["250 lux", "125 lux"],
								["500 lux", "250 lux"],
								["1.000 lux", "300 lux"],
								["2.500 lux", "500 lux"],
								["5.000 lux", "600 lux"],
								["10.000 lux", "700 lux"],
							].map(([loc, gen]) => (
								<tr key={loc} className="even:bg-muted/20">
									<td className="p-3 font-mono tabular-nums">{loc}</td>
									<td className="p-3 font-mono tabular-nums">{gen}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold tracking-tight">
					Requisitos de Uniformidad
				</h2>
				<p className="text-sm text-muted-foreground leading-relaxed">
					Es un parámetro crítico en luminotecnia que mide cuán homogénea es la
					distribución de la luz en un plano de trabajo específico. Su objetivo
					es garantizar que no existan contrastes severos o zonas de sombra que
					fuercen la acomodación visual del trabajador, previniendo así la
					fatiga ocular y disminuyendo el riesgo de accidentes.
				</p>
				<p className="text-sm text-muted-foreground leading-relaxed">
					Para asegurar una uniformidad razonable en la iluminancia de un local,
					se exige una relación no menor de <strong>0,5</strong> entre sus
					valores mínimo y medio:
				</p>
				<div className="bg-muted/20 rounded-xl px-4 py-3 font-mono text-sm text-center">
					E mínima ≥ E media / 2
				</div>
				<p className="text-sm text-muted-foreground leading-relaxed">
					La iluminancia media se determina por media aritmética de la
					iluminancia general del local. La iluminancia mínima es el menor valor
					sobre las superficies de trabajo o sobre un plano horizontal a 0,80 m
					del suelo. No aplica a lugares de tránsito, ingreso/egreso de personal
					ni iluminación de emergencia.
				</p>
				<div className="flex flex-col gap-1">
					<p className="text-sm text-muted-foreground leading-relaxed">
						Emin Valor mínimo en Lux tomado en la grilla de medición.
					</p>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Emax Valormáximo en Lux tomado en la grilla de medición.
					</p>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Emed Iluminancia Media, es la media aritmética en Lux calculada,
						teniendo en cuenta todas las mediciones de la grilla.
					</p>
				</div>
				<p className="text-sm text-muted-foreground leading-relaxed">
					• Uniformidad General U0 = Emin / Emed Es el indicador más utilizado
					por la legislación para validar si el ambiente en general está bien
					iluminado de manera equilibrada.
				</p>
				<p className="text-sm text-muted-foreground leading-relaxed">
					• Uniformidad Localizada U1 = Emin / Emax Se utiliza para analizar
					áreas específicas o puestos de trabajo puntuales, asegurando que no
					existan picos de brillo excesivos respecto a la zona menos iluminada.
				</p>
				<p className="text-sm text-muted-foreground leading-relaxed">
					Criterio de Validación: El cociente U0 obtenido es menor al límite
					establecido por la normativa para esa actividad, el estudio se
					dictamina como "No Conforme", aun cuando el valor medio Emed cumpla
					con los lux mínimos requeridos. Esto obligaría a rediseñar la
					distribución de las luminarias o modificar sus potencias. Los valores
					para U0 {">"} 0,60, pero va a depender de la actividad. Para área
					interior sería
				</p>
				<Tabla />
				<p className="text-sm text-muted-foreground leading-relaxed">
					En el marco legal y técnico aplicable (como la Resolución SRT 84/2012
					y la Norma IRAM AADDL J 20-06 en Argentina, o la ISO 8995-1 a nivel
					internacional), el cálculo y control de este factor es obligatorio al
					confeccionar los protocolos de medición.
				</p>
			</section>
		</>
	)
}

function Tabla() {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-xs border-collapse border text-muted-foreground leading-relaxed">
				<thead>
					<tr className="bg-muted/50">
						<th className="text-center p-3 font-medium border-r">
							Área interior
						</th>
						<th className="text-center p-3 font-medium border-r">Almacenes</th>
						<th className="text-center p-3 font-medium border-r">
							Áreas de manipulación de embalaje de despacho
						</th>
						<th className="text-center p-3 font-medium border-r">
							Aparcamientos públicos
						</th>
						<th className="text-center p-3 font-medium border-r">
							Salas de exposiciones
						</th>
						<th className="text-center p-3 font-medium border-r">
							Fundición a presión
						</th>
						<th className="text-center p-3 font-medium border-r">
							Fabricación de cables y alambres
						</th>
						<th className="text-center p-3 font-medium">
							Talleres electrónicos, pruebas, ajustes
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-border/60">
					<tr className="even:bg-muted/20">
						<td className="p-3 font-mono tabular-nums text-center border-r">
							Uniformidad
						</td>
						<td className="p-3 font-mono tabular-nums text-center border-r">
							0.4
						</td>
						<td className="p-3 font-mono tabular-nums text-center border-r">
							0.6
						</td>
						<td className="p-3 font-mono tabular-nums text-center border-r">
							0.4
						</td>
						<td className="p-3 font-mono tabular-nums text-center border-r">
							0.4
						</td>
						<td className="p-3 font-mono tabular-nums text-center border-r">
							0.6
						</td>
						<td className="p-3 font-mono tabular-nums text-center border-r">
							0.6
						</td>
						<td className="p-3 font-mono tabular-nums text-center">0.7</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

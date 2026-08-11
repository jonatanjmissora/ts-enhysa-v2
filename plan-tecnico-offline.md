implementacion para obtener el tecnico del repository, que puede ser de la API o del indexedDB.

estructura de carpetas:
src/
├── db/
│   └── tecnicos/
│       └── get-tecnico-db.ts
│
├── server/
│   └── tecnicos/
│       └── get-tecnico-server.ts
│
├── queries/
│   └── tecnicos/
│       └── tecnico-query.ts
│
├── repositories/
│   └── tecnicos/
│       └── tecnico-repository.ts
│
├── indexed-db/
│   ├── database.ts
│   └── tecnicos/
│       └── tecnico-local-db.ts

database.ts
-------------
import Dexie, { type EntityTable } from "dexie"

export interface TecnicoLocal {
  id: string
  userId: string
  nombre: string
  apellido: string
  email: string
  createdAt: string
  updatedAt: string
}

class AppDatabase extends Dexie {
  tecnicos!: EntityTable<TecnicoLocal, "id">

  constructor() {
    super("app-db")

    this.version(1).stores({
      tecnicos: "id, userId, updatedAt",
    })
  }
}

export const localDb = new AppDatabase()

tecnico-local-db.ts
---------------------
export async function getTecnicoLocal(userId: string) {
  return await localDb.tecnicos
    .where("userId")
    .equals(userId)
    .first() ?? null
}

export async function saveTecnicoLocal(tecnico: Tecnico) {
  const res = await localDb.tecnicos.put(tecnico)
  return {data: res, status: "ok"}
}

tecnico-repository.ts
--------------------------
export const tecnicoRepository = {
  async get(userId: string) {
  const tecnicoL = await getTecnicoLocal(userId)

  if (tecnicoL) {
	console.log("[IndexedDB] Técnico local:", tecnicoL)
    return tecnicoL
  }

  const tecnicoR = await getTecnicoServer()

  if (tecnicoR) {
	console.log("[API] Técnico remoto:", tecnicoR)
      const res = await saveTecnicoLocal(tecnicoR)
	if (res.status === "ok") {
		console.log("[IndexedDB] Técnico guardado:", res.data)
	}
  }

  return tecnicoR
}
}

tecnico-query.ts
-------------------
export const tecnicoQueryOptions = queryOptions({
  queryKey: ["tecnico", userId],
  queryFn: () => tecnicoRepository.get(userId)
})


Devtools - Debug
---------------------
Application
  └── Storage
      └── IndexedDB
		  └── app-db
   			 └── tecnicos
        			└── <id>

paso 1: debe de estar vacia
paso 2: debe de llenarse con la primera visita online
paso 3: en Devtools/Network no deberia de volver a pedir al servidor para /perfil/tecnico cuando recargo pagina.
paso 4: offline, ver si carga el tecnico (SW debe de tener cacheado /perfil/tecnico)


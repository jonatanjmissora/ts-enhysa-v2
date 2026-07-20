# Stack Reference — TanStack + TailwindCSS + TypeScript + Better Auth + Drizzle

> Versiones basadas en `package.json` del proyecto. Siempre verificar `node_modules/` para la API exacta.

## React 19

```tsx
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { use, Suspense, lazy, startTransition, useOptimistic, useActionState } from "react"
```

- `use(promise)` — unwraps promise in render (con Suspense).
- `useActionState` — reemplaza `useFormState` para server actions.
- `startTransition` — marca actualizaciones como no urgentes.

## TypeScript 5.7

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## TailwindCSS v4

- Configuración vía CSS, no `tailwind.config.ts`.
- `@tailwindcss/vite` plugin en Vite.
- Sintaxis: `@import "tailwindcss"` en CSS principal.
- Variantes: `dark:`, `hover:`, `focus-visible:`, `data-*`.
- Uso: `className="flex gap-4 p-4 bg-zinc-900 text-white rounded-xl"`.
- Animaciones: `animate-spin`, `animate-pulse`, etc. via `tw-animate-css`.

## TanStack React Start v1.132+

```ts
import { createServerFn, createMiddleware } from "@tanstack/react-start"
```

### Server Function (GET)
```ts
export const getData = createServerFn({ method: "GET" }).handler(
  async () => {
    return await getDataDb()
  }
)
```

### Server Function (POST con validación)
```ts
export const saveData = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; data: SomeType }) => d)
  .handler(async ({ data }) => {
    return await saveDataDb(data.id, data.data)
  })
```

### Middleware
```ts
import { createMiddleware } from "@tanstack/react-start"

const authMiddleware = createMiddleware({ type: "function" })
  .server(async ({ next }) => {
    const session = await getSession()
    if (!session) throw redirect({ to: "/" })
    return next({ context: { session } })
  })

export const protectedFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // context.session available
  })
```

### Request helpers
```ts
import { getRequest } from "@tanstack/react-start/server"
```

## TanStack React Router v1.132+

```ts
import { createFileRoute, createRouter, Link, useNavigate, useRouter } from "@tanstack/react-router"
import { linkOptions } from "@tanstack/react-router"
```

### Ruta de archivo
```ts
export const Route = createFileRoute("/ruta")({
  component: RouteComponent,
  loader: async () => { return data },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error }) => <div>Error</div>,
})

function RouteComponent() {
  const data = Route.useLoaderData()
  return <div>{data}</div>
}
```

### Ruta raíz (__root.tsx)
```ts
export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

### Ruta anidada con layout
```ts
export const Route = createFileRoute("/_layout")({
  component: ({ children }) => <Layout><Outlet /></Layout>,
})
// Routes: /_layout/child.tsx → /child
```

### Search params tipados
```ts
const searchSchema = z.object({ page: z.number().default(1) })

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  component: Products,
})

// Uso: const { page } = Route.useSearch()
```

### Navegación
```ts
const navigate = useNavigate()
navigate({ to: "/path", params: { id: "123" }, search: { page: 1 } })

<Link to="/path/$id" params={{ id: "123" }} search={{ page: 1 }} />
```

### Router instance
```ts
const router = createRouter({
  routeTree,
  context: { queryClient, session: null },
  defaultPendingMs: 100,
  defaultPendingMinMs: 500,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 30_000,
  scrollRestoration: true,
})
```

### Server Function integration via `setupRouterSsrQueryIntegration`
```ts
setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })
```

## TanStack React Query v5.66+

```ts
import { useQuery, useSuspenseQuery, useMutation, useQueryClient, queryOptions, infiniteQueryOptions } from "@tanstack/react-query"
import { usePrefetchQuery } from "@tanstack/react-query"
```

### useSuspenseQuery (recomendado con Suspense)
```ts
const { data } = useSuspenseQuery({
  queryKey: ["key", param],
  queryFn: () => fetchFn(param),
})
// data NO es undefined (siempre definido)
```

### useQuery
```ts
const { data, isLoading, error } = useQuery({
  queryKey: ["key", param],
  queryFn: () => fetchFn(param),
  staleTime: 1000 * 60 * 5,
  enabled: !!param,
})
```

### useMutation
```ts
const mutation = useMutation({
  mutationFn: (data: Input) => saveToServer(data),
  onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["key"] }) },
})

mutation.mutate({ name: "test" })
```

### queryOptions (factory tipada)
```ts
export const postOptions = (id: string) => queryOptions({
  queryKey: ["post", id],
  queryFn: () => fetchPost(id),
})
```

### QueryClientProvider setup
```tsx
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query"
```

### Prefetching
```ts
usePrefetchQuery({ queryKey: ["key"], queryFn: () => fetchData() })
```

## TanStack React Form v1.0+

```ts
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
```

### Formulario básico
```ts
const form = useForm({
  defaultValues: { name: "", email: "" },
  validators: { onChange: z.object({...}) },
  onSubmit: async ({ value }) => { await submit(value) },
})
```

### Field pattern
```tsx
<form.Field name="email" children={(field) => {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      />
      {isInvalid && <span>{field.state.meta.errors.join(", ")}</span>}
    </div>
  )
}} />
```

Submit: `form.handleSubmit()` (llamado desde `onSubmit` del `<form>` con `e.preventDefault()`).

## Better Auth v1.4+

### Server
```ts
import { betterAuth } from "better-auth"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { clientId: "...", clientSecret: "..." },
  },
  plugins: [tanstackStartCookies()],
  database: drizzleAdapter(db, { provider: "pg", schema: { user, account, session, verification } }),
})
```

### Cliente
```ts
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL,
})

// Sign up/in
await authClient.signUp.email({ email, password, name, callbackURL: "/" })
await authClient.signIn.email({ email, password, callbackURL: "/" })
await authClient.signIn.social({ provider: "google", callbackURL: "/" })

// Session
await authClient.getSession()
await authClient.signOut()
```

### Server-side session
```ts
const request = getRequest()
const session = await auth.api.getSession({ headers: request.headers })
```

## Drizzle ORM v0.45+

```ts
import { pgTable, text, jsonb, timestamp, integer, boolean, uuid } from "drizzle-orm/pg-core"
import { eq, and, or, sql, asc, desc, ilike, inArray, isNull, isNotNull } from "drizzle-orm"
```

### Schema
```ts
export const table = pgTable("table_name", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").$type<SomeType>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})
```

### CRUD
```ts
import { db } from "../index"
import { table } from "../schema"

// Read
await db.select().from(table).where(eq(table.id, id))

// Create
await db.insert(table).values({ id, name, data })

// Update
await db.update(table).set({ name }).where(eq(table.id, id))

// Delete
await db.delete(table).where(eq(table.id, id))

// Filtros compuestos
await db.select().from(table).where(and(eq(table.id, id), isNotNull(table.name)))
await db.select().from(table).where(ilike(table.name, `%${query}%`))

// Orden
await db.select().from(table).orderBy(asc(table.name))

// Joins
await db.select().from(table).leftJoin(otherTable, eq(table.id, otherTable.tableId))
```

### Adapters
```ts
import { drizzle } from "drizzle-orm/node-postgres"    // Servidor Node
import { drizzle } from "drizzle-orm/neon-http"        // Neon serverless
```

Conexión: `drizzle(process.env.DATABASE_URL as string, { schema })`.

---

## Best practices

- Usar `useSuspenseQuery` en lugar de `useQuery` para evitar checks de `undefined` en `data`.
- Server Functions con `inputValidator` para validación tipada antes del handler.
- Middleware con `createMiddleware` para auth reutilizable.
- Formularios con `@tanstack/react-form` + Zod + UI components.
- Drizzle: `db.update()` con `$onUpdate()` auto-maneja `updatedAt`.
- Tailwind v4: usar `@import "tailwindcss"` en CSS, no config file.
- Las rutas TanStack Router son lazy-load por defecto.

## Demo User Pattern

El sistema de demo user permite probar la app sin registrarse, con datos aislados por sesión y límites anti-spam.

### Diseño

- Se crean hasta **5 demo users** simultáneos con credenciales secuenciales: `demo1@enhysa.demo` / `demo1`, `demo2@enhysa.demo` / `demo2`, etc.
- Cada sesión demo tiene su propio `userId` → datos completamente aislados (privacidad).
- TTL de **24 horas**: al solicitar un nuevo demo user, se borran los demo users con `createdAt > 24h` (y sus datos en cascada).
- Al cerrar sesión, `resetDemoDataServer` solo borra datos si es la **única sesión activa** del demo user (cuenta sesiones en tabla `session` con `expiresAt > now()`).
- Si hay otra sesión activa del mismo demo user, no se borra nada, para no interrumpir a otro usuario.

### Server Functions

```ts
// server/seed-demo-user-server.ts
export const ensureDemoUser = createServerFn({ method: "GET" }).handler(async () => {
  // 1. Borrar demo users con createdAt < hace 24h (cascade)
  // 2. Contar demo users activos restantes
  // 3. Si < 5: crear nuevo user + account con email demo{N}@enhysa.demo, password demo{N}
  // 4. Si >= 5: devolver error
})

// server/reset-demo-data-server.ts
export const resetDemoData = createServerFn({ method: "POST" }).handler(async () => {
  // 1. Verificar sesión actual
  // 2. Contar sesiones activas del demo userId (expiresAt > now())
  // 3. Si count > 1: no borrar (hay otro usuario activo)
  // 4. Si count === 1: borrar todos los datos del userId
})
```

### Password Hashing

```ts
import { randomBytes, scrypt } from "node:crypto"
const salt = randomBytes(16).toString("hex")
const key = await new Promise<Buffer>((resolve, reject) =>
  scrypt(password.normalize("NFKC"), salt, 64, { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 }, (err, key) =>
    err ? reject(err) : resolve(key)
  )
)
// Formato: "${salt}:${key.toString("hex")}"
// maxmem: 64MB evita ERR_SSL_MEMORY_LIMIT_EXCEEDED
```

### UI Integration

- **login-form.tsx**: botón "Demo — Probar sin registrarse" → `ensureDemoUser()` → muestra modal con credenciales → al confirmar, `authClient.signIn.email()`.
- **suscripciones.tsx**: card "Prueba Gratis" → redirige a `/login` para que el usuario use el botón demo desde allí.
- **navbar.tsx**: `LogoutAlertDialog` → si es demo user, `resetDemoDataServer()` + `authClient.signOut()`.
- **demo-credentials-modal.tsx**: modal que muestra email/password al usuario para que pueda usarlos desde otro dispositivo.

### Créditos

Demo users nunca tienen créditos. `getUserCreditsServer` retorna `0`. PDFs siempre con watermark y botón "Comprar créditos".

### Archivos relevantes

- `server/seed-demo-user-server.ts`
- `server/reset-demo-data-server.ts`
- `src/components/login-form.tsx`
- `src/components/suscripciones.tsx`
- `src/components/navbar.tsx`
- `src/components/demo-credentials-modal.tsx`

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

# Plan de unificación web + APK

> Estado: **Etapa 1 ejecutada en base**. Falta deploy de web + backend y pruebas de login. Etapas 2–5 propuestas.
> Base de datos única: Neon `ep-crimson-flower-acxbl088` / `neondb`.
> Decisión confirmada: **Better Auth en ambas apps** (la APK se adapta vía backend proxy).

## Estado de ejecución

- [x] Decisión de arquitectura: Better Auth como única identidad.
- [x] Testers confirmados:
  - `jonatanjmissora@gmail.com` → APK `f50b6cca-f6ed-4bdc-a48c-16186c6ff4a9`
  - `martin.munioz@hotmail.com` → APK `975fa812-97fa-47b5-a563-f46898041677`
- [x] Backup branch Neon: `backup-pre-unify-20261113` (`br-proud-fog-ac8n6e2m`, sin compute, hija de `production`).
- [x] Backup lógico: schema `backup_unify` con las 26 tablas copiadas.
- [x] Conteos origen vs backup verificados (todos coinciden).
- [x] DDL aditivo aplicado en `production`: `expo_accounts`, `expo_verifications`, `expo_users.email_verified`, `password_hash` nullable, `_unify_map`.
- [x] Cutover de identidad ejecutado en `production`:
  - `expo_sessions` recreada con esquema Better Auth.
  - `expo_accounts`: 2 cuentas `credential` con el hash legacy de la APK.
  - `expo_user_credits`: saldos fusionados con `max` (1 y 3) y columnas convertidas a `uuid`/`numeric`.
  - Filas de negocio de los testers repuntadas al UUID de `expo_users`; columnas `user_id`/`userId` convertidas a `uuid` y FKs recreadas a `expo_users`.
  - Tablas viejas eliminadas: `"user"`, `account`, `session`, `verification`, `user_credits`, `expo_password_reset_tokens`, `_unify_map`.
- [x] Código web actualizado: Better Auth sobre tablas `expo_*`, `bearer()`, `generateId: "uuid"`, sin Google, verificación compatible con hashes de la APK, demo adaptado.
- [x] Código backend APK actualizado: login/register/me/logout proxy a Better Auth; `getSessionUser` valida contra la web; reset deshabilitado; `ensureSchema` ya no crea tablas de identidad.
- [ ] Deploy de código web + backend APK.
- [ ] Pruebas de login web/APK y Expo Go.

## Uso de branches

- `production` (`br-curly-frost-acivi1sj`): **única branch donde se hacen los cambios**. Es la que usan la web y el APK.
- `backup-pre-unify-20261113`: **queda congelada como backup**. No se escribe en ella.
- Si se quiere ensayar antes, se puede crear una branch `unify-staging`, pero habría que apuntar temporalmente web y backend APK a su connection string. Con el backup actual y solo 2 testers, no es necesario.

## Alcance confirmado de la Etapa 1

Solo se unifican **usuarios, cuentas, sesiones y créditos**. En las tablas de negocio (técnicos, empresas, instrumentos, informes) solo se cambia el tipo de la columna de dueño a `uuid` y se recrea su FK a `expo_users`; el resto del esquema queda igual. La migración a `expo_tecnicos`/`expo_*` queda para las Etapas 3 y 4.

- Créditos: se fusiona con **`max`**.
- Contraseña: ambos testers **mantienen la misma que usan en la APK**.
- Reset de contraseña (olvidé mi contraseña): queda deshabilitado en Etapa 1 y se evalúa después.

## Reglas del plan

- Las tablas finales son las `expo_*` (las que usa la APK). La web y Drizzle se adaptan a ellas.
- Better Auth (web) es la única capa de identidad: registros, login, sesiones.
- Se conservan **solo los 2 usuarios tester**. El resto de usuarios y sus datos se descarta.
- Para los 2 testers se **fusionan** los datos web + APK bajo el `id` de `expo_users`.
- Los demo users se mantienen, pero son **web-only**.
- Las contraseñas no se comparten por chat: se pasan por variable de entorno local al correr el script de setup.
- Cada etapa tiene su checklist de aceptación y su rollback.

---

# Etapa 0 — Prerrequisitos (BLOQUEANTE)

## 0.1 Testers

**Confirmados** (son los únicos 2 registros en `expo_users`):

| Email | Web `user.id` | APK `expo_users.id` | Provider web actual |
|---|---|---|---|
| jonatanjmissora@gmail.com | `G7RgISQy0NBtGExl2r7szLZORSKBmnM8` | `f50b6cca-f6ed-4bdc-a48c-16186c6ff4a9` | google (sin password) |
| martin.munioz@hotmail.com | `5iyE0fm9IlWL9m17212KSNFE1Mp7vq3r` | `975fa812-97fa-47b5-a563-f46898041677` | credential |

## 0.2 Backup (COMPLETADO)

- Branch: `backup-pre-unify-20261113` / `br-proud-fog-ac8n6e2m` (sin compute, hija de `production`).
- Schema: `backup_unify` con 26 tablas.
- Conteos verificados: coinciden origen y backup en todas las tablas.

Referencia de lo ejecutado:

1. Neon Console → Branches → **Create branch** → `backup-pre-unify-YYYYMMDD-HHmm` desde la branch principal.
2. Copias lógicas dentro de la misma base:

```sql
create schema if not exists backup_unify;

create table backup_unify.user              as table public."user";
create table backup_unify.account           as table public.account;
create table backup_unify.session           as table public.session;
create table backup_unify.verification      as table public.verification;
create table backup_unify.user_credits      as table public.user_credits;
create table backup_unify.credit_history    as table public.credit_history;
create table backup_unify.pending_payments  as table public.pending_payments;
create table backup_unify.expo_users        as table public.expo_users;
create table backup_unify.expo_sessions     as table public.expo_sessions;
create table backup_unify.expo_user_credits as table public.expo_user_credits;
create table backup_unify.expo_credit_history as table public.expo_credit_history;
create table backup_unify.tecnicos          as table public.tecnicos;
create table backup_unify.empresas          as table public.empresas;
create table backup_unify.instrumentos      as table public.instrumentos;
create table backup_unify.reportes_iluminacion as table public.reportes_iluminacion;
create table backup_unify.areas_iluminacion    as table public.areas_iluminacion;
create table backup_unify.localizadas_iluminacion as table public.localizadas_iluminacion;
```

3. (Opcional recomendado) dump local:

```bash
pg_dump "$DATABASE_URL" --schema=public --format=custom --file=backup-pre-unify.dump
```

**Checklist para avanzar:** branch de Neon creada + schema `backup_unify` con las tablas + confirmación explícita del usuario.

## 0.3 Inventario actual

- Web: 59 usuarios (39 solo-Google), 2 testers a conservar.
- APK: 2 `expo_users`, 2 `expo_user_credits`, 7 `expo_sessions` (se descartan).
- Ambos backends comparten la misma base Neon.

---

# Etapa 1 — Identidad única (user, account, session, user_credits)

**Objetivo:** Better Auth maneja login/registro/sesiones; las tablas canónicas son `expo_users`, `expo_accounts`, `expo_sessions`, `expo_user_credits`, `expo_verifications`; los 2 testers tienen el mismo `id` en web y APK.

## 1.1 Cambios de esquema en Neon

### `expo_users`

```sql
-- Better Auth necesita email_verified; la imagen se mapea a user_image desde Drizzle
alter table expo_users add column if not exists email_verified boolean not null default false;

-- Better Auth no usa password_hash; debe dejar de ser obligatorio
alter table expo_users alter column password_hash drop not null;

-- name no puede quedar null para Better Auth
update expo_users set name = '' where name is null;

-- id ya es UUID con default gen_random_uuid()
```

### `expo_accounts` (nueva — **Better Auth la requiere**)

La web tenía `account`; la APK no. Sin esta tabla no hay login por contraseña.

```sql
create table if not exists expo_accounts (
  id uuid primary key default gen_random_uuid(),
  account_id text not null,
  provider_id text not null,
  user_id uuid not null references expo_users(id) on delete cascade,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at timestamptz,
  refresh_token_expires_at timestamptz,
  scope text,
  password text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists expo_accounts_provider_account_uq
  on expo_accounts (provider_id, account_id);
create index if not exists expo_accounts_user_idx on expo_accounts (user_id);
```

### `expo_sessions` (recrear — las sesiones viejas se descartan)

Better Auth necesita `id`, `token` único, `updated_at`, `ip_address`, `user_agent`.

```sql
drop table if exists expo_sessions;

create table expo_sessions (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  user_id uuid not null references expo_users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

create index if not exists expo_sessions_user_idx on expo_sessions (user_id);
```

### `expo_verifications` (nueva — resets de contraseña)

```sql
create table if not exists expo_verifications (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  value text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expo_verifications_identifier_idx
  on expo_verifications (identifier);
```

### `expo_user_credits`

Ya existe con `credits NUMERIC(10,2)`. Es la tabla final. Drizzle se adapta con `numeric(...,{ mode: "number" })`.

## 1.2 Mapa de fusión de los 2 testers

```sql
create table if not exists _unify_map (
  old_web_id text primary key,
  new_expo_id uuid not null,
  email text not null
);

insert into _unify_map (old_web_id, new_expo_id, email) values
  ('G7RgISQy0NBtGExl2r7szLZORSKBmnM8', 'f50b6cca-f6ed-4bdc-a48c-16186c6ff4a9', 'jonatanjmissora@gmail.com'),
  ('5iyE0fm9IlWL9m17212KSNFE1Mp7vq3r', '975fa812-97fa-47b5-a563-f46898041677', 'martin.munioz@hotmail.com')
on conflict (old_web_id) do nothing;
```

## 1.3 Repuntar los datos web de los testers al id de la APK

Se hace **antes** de borrar usuarios, para que el `ON DELETE CASCADE` no borre los datos de los testers.

```sql
update tecnicos t                 set "userId"   = m.new_expo_id from _unify_map m where t."userId"   = m.old_web_id;
update empresas e                 set "userId"   = m.new_expo_id from _unify_map m where e."userId"   = m.old_web_id;
update instrumentos i             set "userId"   = m.new_expo_id from _unify_map m where i."userId"   = m.old_web_id;
update reportes_iluminacion r     set user_id    = m.new_expo_id from _unify_map m where r.user_id    = m.old_web_id;
update areas_iluminacion a        set "userId"   = m.new_expo_id from _unify_map m where a."userId"   = m.old_web_id;
update localizadas_iluminacion l  set "userId"   = m.new_expo_id from _unify_map m where l."userId"   = m.old_web_id;
update credit_history h           set user_id    = m.new_expo_id from _unify_map m where h.user_id    = m.old_web_id;
update pending_payments p         set user_id    = m.new_expo_id from _unify_map m where p.user_id    = m.old_web_id;
```

## 1.4 Fusionar datos de perfil

```sql
update expo_users e
set
  email_verified = coalesce(u.email_verified, e.email_verified),
  name           = coalesce(nullif(e.name, ''), u.name),
  user_image     = coalesce(e.user_image, u.image)
from "user" u
join _unify_map m on m.old_web_id = u.id
where e.id = m.new_expo_id;
```

## 1.5 Borrar el resto de usuarios

Primero los que no son testers (cascadea sus datos web):

```sql
delete from "user"
where id not in (select old_web_id from _unify_map);
```

Luego las filas web viejas de los testers (ya no tienen hijos apuntándoles):

```sql
delete from "user"
where id in (select old_web_id from _unify_map);
```

## 1.6 Quitar FKs que apuntan a `"user"` y retirar la tabla vieja

```sql
do $$
declare r record;
begin
  for r in
    select conrelid::regclass as tbl, conname
    from pg_constraint
    where confrelid = 'public."user"'::regclass
      and contype = 'f'
  loop
    execute format('alter table %s drop constraint %I', r.tbl, r.conname);
  end loop;
end $$;
```

Renombrar (no borrar todavía) para rollback rápido:

```sql
alter table "user"        rename to _legacy_user;
alter table account       rename to _legacy_account;
alter table session       rename to _legacy_session;
alter table verification  rename to _legacy_verification;
alter table user_credits  rename to _legacy_user_credits;
```

> Las columnas `userId`/`user_id` de las tablas de negocio quedan como `text` en esta etapa, sin FK, apuntando a ids UUID. Se convertirán a `uuid` + FK a `expo_users` cuando se migre cada tabla en las Etapas 3 y 4.

## 1.7 Fusionar créditos

Decisión pendiente: `max` (recomendado para no inflar) o `sum`.

```sql
insert into expo_user_credits (user_id, credits, updated_at)
select m.new_expo_id, uc.credits, now()
from user_credits uc
join _unify_map m on m.old_web_id = uc.user_id
on conflict (user_id) do update
set credits = greatest(expo_user_credits.credits, excluded.credits),
    updated_at = now();
```

## 1.8 Crear cuentas `credential` para los testers

Los 2 testers **conservan la contraseña que ya usan en la APK**. No hay reset visible: el script toma esa misma contraseña desde una variable de entorno local, la hashea con Better Auth y crea la cuenta `credential` en `expo_accounts`.
- `jonatanjmissora@gmail.com`: hoy es Google-only en web → su contraseña de la APK pasa a ser la credencial.
- `martin.munioz@hotmail.com`: se descarta su hash web y se reemplaza por el hash Better Auth de su contraseña de la APK.

Script local (no se corre desde el chat):

```ts
// scripts/set-testers-password.ts (ejemplo, no ejecutar todavía)
import { auth } from "../src/lib/auth"

const ctx = await auth.$context

for (const [email, userId] of [
  ["jonatanjmissora@gmail.com", "f50b6cca-f6ed-4bdc-a48c-16186c6ff4a9"],
  ["martin.munioz@hotmail.com", "975fa812-97fa-47b5-a563-f46898041677"],
] as const) {
  const password = process.env[`TESTER_PASSWORD_${email.split("@")[0].toUpperCase()}`]
  if (!password) throw new Error(`Falta password para ${email}`)

  const hash = await ctx.password.hash(password)
  await ctx.internalAdapter.linkAccount({
    userId,
    providerId: "credential",
    accountId: userId,
    password: hash,
  })
}
```

## 1.9 Código web

1. `db/users/schema.ts`:
   - `user` → `pgTable("expo_users")`, `id: uuid("id").defaultRandom()`, `image: text("user_image")`, `emailVerified: boolean("email_verified")`.
   - `account` → `pgTable("expo_accounts")`, `user_id uuid`.
   - `session` → `pgTable("expo_sessions")`, `user_id uuid`, `token` unique, `updatedAt`, `ipAddress`, `userAgent`.
   - `verification` → `pgTable("expo_verifications")`.
2. `db/credits/schema.ts`: `userCredits` → `pgTable("expo_user_credits")`, `userId uuid`, `credits numeric(...,{ mode: "number" })`.
3. `src/lib/auth.ts`:
   - `advanced.database.generateId: "uuid"`.
   - `schema` apuntando a las nuevas tablas.
   - `plugins: [tanstackStartCookies(), bearer()]`.
   - Quitar `socialProviders.google`.
4. `src/components/login-form.tsx`: quitar botón y handler de Google.
5. `server/seed-demo-user-server.ts`:
   - Insertar en `expo_users` con `email_verified: true`.
   - Insertar en `expo_accounts` (mismo hash `salt:hash`, N=16384, r=16).
   - Mantener password de 4 dígitos (insert directo, no `signUp.email`).
6. `server/reset-demo-data-server.ts`: apuntar a `expo_users` y `expo_sessions`.
7. Cualquier `auth.api.getSession` sigue igual (devuelve `user.id` UUID).

## 1.10 Código APK + backend

**La app APK no necesita rebuild en esta etapa.** El backend mantiene el contrato actual (`x-session-token` + `{ token, user }`) y traduce a Better Auth.

1. `expo-enhysa-backend/lib/handlers/login.ts`
   - Llamar `POST ${WEB_AUTH_URL}/api/auth/sign-in/email` con `{ email, password }`.
   - Leer header `set-auth-token` (plugin bearer).
   - Devolver `{ token: <set-auth-token>, user: { id, email, name, userImage } }`.
   - Dejar de verificar `password_hash`.
2. `register.ts` → `POST /api/auth/sign-up/email`.
3. `me.ts` → `GET /api/auth/get-session` con `Authorization: Bearer <x-session-token>`.
   - `PATCH` de nombre/imagen: actualizar `expo_users` directo.
4. `logout.ts` → `POST /api/auth/sign-out` con Bearer (o borrar de `expo_sessions`).
5. `lib/auth.ts`: `getSessionUser` valida contra Better Auth (o consulta `expo_sessions`); eliminar `createSession/deleteSession` propios.
6. `lib/db.ts` `ensureSchema()`: quitar la creación de `expo_users`/`expo_sessions` para que no pisen el esquema nuevo.
7. `password/forgot` y `password/reset`: **quedan deshabilitados temporalmente** (o se adaptan a `/api/auth/request-password-reset` y `/api/auth/reset-password`) porque el password ahora vive en `expo_accounts`.
8. Env nueva del backend: `WEB_AUTH_URL` (URL pública de la web).

## 1.11 Demo users (web-only)

- Mantener `@enhysa.demo` y el TTL de 24 h.
- Guard en el backend del APK: rechazar login si el email termina en `@enhysa.demo`.
- El borrado de demo cascadea a `expo_sessions`, `expo_accounts` y a las tablas de negocio con FK a `expo_users` (a medida que se migren).

## 1.12 Checklist de aceptación

- [x] Backup confirmado (Etapa 0).
- [x] Los 2 testers tienen cuenta `credential` en `expo_accounts`.
- [x] Tablas viejas eliminadas y filas de negocio repuntadas.
- [x] `expo_user_credits` fusionado por `max`.
- [ ] Web: login con email/contraseña de ambos testers.
- [ ] Web: `getSession().user.id` devuelve el UUID de `expo_users`.
- [ ] APK: login por el backend proxy; `me` devuelve el mismo UUID.
- [ ] APK: logout y re-login.
- [ ] Demo: se crea y loguea en web; el APK lo rechaza.
- [ ] Google: botón eliminado y login por Google deshabilitado.
- [ ] No quedan filas huérfanas en tablas de negocio.

## 1.13 Pruebas con Expo Go

No hace falta EAS build: todas las librerías nativas usadas están incluidas en Expo Go SDK 57.

1. Deployar web y backend; en Vercel configurar `WEB_AUTH_URL=https://enhysav2.netlify.app`.
2. En `expo-enhysa/.env`:
   - Producción: `EXPO_PUBLIC_API_URL=https://expo-enhysa-backend.vercel.app`
   - Local: `EXPO_PUBLIC_API_URL=http://<IP-LAN-DE-TU-PC>:3000`
3. `cd expo-enhysa && pnpm start` (o `npx expo start`).
4. Escanear el QR con Expo Go en el Android.
5. Login con el email y la contraseña que ya usan en la APK.
6. Verificar que `me` devuelve el UUID de `expo_users` y que el restore trae sus datos.

Notas:
- Si el backend corre local (`vercel dev`), `WEB_AUTH_URL=http://localhost:3000`; el celular solo necesita llegar al backend por IP LAN.
- `expo-build-properties` no aplica en Expo Go (no afecta el login).
- Si más adelante se agrega un módulo nativo fuera de Expo Go, ahí sí hará falta un development build/EAS.

## 1.14 Rollback

1. Restaurar la branch de Neon `backup-pre-unify-20261113` (o el dump local).
2. Redeploy de la versión anterior de web y del backend APK.
3. Como las tablas viejas se eliminaron, el rollback de datos depende de la branch de backup.

---

# Etapa 2 — Créditos y pagos (propuesta, no aprobada)

- Canonizar `expo_user_credits`, `expo_credit_history`, `expo_pending_payments`.
- Migrar el ledger completo de los testers.
- Un solo flujo de Mercado Pago (recomendado: web) o dos flujos con idempotencia por `mp_payment_id`.
- Apuntar Drizzle y el backend APK a las tablas `expo_*`.
- Pruebas: compra web → créditos en APK; consumo APK → web; webhook duplicado no duplica.

# Etapa 3 — Catálogos: técnicos, empresas, instrumentos (propuesta)

- Tablas finales `expo_tecnicos`, `expo_empresas`, `expo_instrumentos` (ya existen).
- Convertir tipos web: `text[]` vs JSON, `NOT NULL`, `deleted_at`, `updated_at`.
- Migrar filas de los testers desde web a `expo_*`.
- Adaptar `lib/sync-entities.ts` y `api/sync/[entity].ts`.
- Pruebas: CRUD web ↔ restore APK, soft delete y conflictos.

# Etapa 4 — Informes de iluminación (propuesta)

- Tablas finales `expo_informes_iluminacion`, `expo_areas_iluminacion`, `expo_localizadas_iluminacion`.
- Resolver diferencias: `clima` vs `humedad`/`temperatura`, snapshots, `credit_consumed` boolean/integer, `numeric` vs `REAL`, arrays vs JSON.
- Decidir tabla compartida de imágenes (equivalente a `expo_images`) o mantener URLs en arrays.
- Migrar informes/áreas/localizadas de los testers.
- Pruebas: informe creado en APK se restaura completo en dispositivo nuevo; PDF/unlock intactos.

# Etapa 5 — Limpieza (propuesta)

- Borrar `_legacy_*`, `expo_password_reset_tokens`, código y `ensureSchema` viejo.
- Quitar env obsoletas (`GOOGLE_*`, `API_TOKEN` si deja de usarse).
- Actualizar `AGENTS.md` y documentar el modelo final.
- Regresión completa.

---

# Riesgos abiertos

| Riesgo | Mitigación |
|---|---|
| `account` no estaba en la lista inicial | Se crea `expo_accounts`; sin ella no hay login por contraseña |
| Formato de hash incompatible | Se setea la contraseña de los testers con el hash de Better Auth |
| `expo_sessions` con esquema distinto | Se recrea; se pierden sesiones (los testers re-loguean) |
| FKs de tablas web a `"user"` | Se eliminan antes de retirar la tabla; se recrean al migrar cada tabla |
| `password_hash` NOT NULL en `expo_users` | Se hace nullable y queda legacy |
| Login offline en APK | Con Better Auth, offline solo con sesión vigente; si expira, requiere red |
| Reset de contraseña APK | Deshabilitado temporalmente o adaptado a Better Auth |
| Doble acreditación de créditos | Un solo ledger + idempotencia |
| Demo users en APK | Guard por dominio `@enhysa.demo` |
| Vercel no alcanza la web | Configurar `WEB_AUTH_URL` público (túnel en desarrollo) |

# Decisiones resueltas

- Créditos: **max**.
- Contraseña de testers: **se mantiene la de la APK**.
- Alcance Etapa 1: **solo usuarios, cuentas, sesiones y créditos**. Tablas de negocio solo se repuntan, sin cambiar esquema.
- Branch de trabajo: **production**. El branch nuevo es solo backup.

# Pendiente

1. Confirmación explícita para el cutover destructivo de Etapa 1 (recrear `expo_sessions`, repuntar filas, borrar usuarios, retirar tablas web viejas).
2. Pasar las contraseñas de los 2 testers por variables de entorno locales al ejecutar el script (no por chat).

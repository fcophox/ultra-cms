# UltraCMS

CMS headless **white-label** sobre **Next.js + Supabase**. Clónalo por proyecto,
apúntalo a un Supabase propio y consume el contenido desde cualquier frontend con
`@ultracms/sdk`.

Ver el diseño completo en [PLAN.md](./PLAN.md), el deploy en
[DEPLOY.md](./DEPLOY.md) y las novedades en [CHANGELOG.md](./CHANGELOG.md).

## Estructura

```
apps/admin       Panel de administración (Next.js App Router)
packages/sdk     @ultracms/sdk — cliente tipado de solo lectura para frontends
supabase/        Esquema versionado (migraciones, RLS, storage) + seed
ultra.config.ts  Branding y categorías por proyecto (white-label)
```

## Usar como template

Este repo es un **template de GitHub**. Para un proyecto nuevo:

> Pulsa **« Use this template »** en GitHub (o clónalo) → tendrás un repo propio
> sin el historial, listo para apuntarlo a tu Supabase.

## Puesta en marcha (por cada proyecto)

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Inicializar** — asistente interactivo que pide las credenciales del Supabase
   de este proyecto y el branding, y escribe `apps/admin/.env.local`:
   ```bash
   npm run init
   ```
   (Las credenciales están en Supabase → Project Settings → API. Alternativa
   manual: `cp .env.example apps/admin/.env.local` y completarlo.)

3. **Aplicar el esquema** (tablas, RLS, storage):
   ```bash
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```
   O pega `supabase/migrations/0001_init.sql` en el **SQL Editor** de Supabase.
   En local: `npx supabase start` y `npx supabase db reset`.

4. **Crear el primer admin** en el dashboard de Supabase → Authentication → Add user
   (marca "Auto Confirm User"; el trigger crea su `profile` automáticamente).

5. **Levantar el panel**
   ```bash
   npm run dev
   ```
   Abre http://localhost:3000 e inicia sesión.

## Consumir el contenido desde un frontend

En cualquier proyecto Next.js (separado), instala el SDK y léelo:

```ts
import { createUltraClient } from "@ultracms/sdk";

const cms = createUltraClient({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

const posts = await cms.articles.list({ category: "blog", limit: 10 });
const post  = await cms.articles.bySlug({ category: "blog", slug: "mi-post" });
const cats  = await cms.categories.list();

// Formulario de contacto → cae en la bandeja del panel
await cms.contacts.submit({ name, email, message, source: "home" });
```

### Alternativa REST para el formulario de contacto

Si un frontend no usa el SDK, puede hacer un POST plano (CORS abierto):

```bash
curl -X POST https://tu-admin.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@mail.com","message":"Hola","source":"home"}'
```

El frontend solo usa la `anon` key: RLS garantiza que únicamente ve contenido
publicado y solo puede crear contactos.

## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Levanta el panel admin |
| `npm run build` | Build de producción del admin |
| `npm run sdk:build` | Compila `@ultracms/sdk` |
| `npm run db:push` | Aplica migraciones al Supabase enlazado |
| `npm run db:reset` | Reinicia la BD local con migraciones + seed |
| `npm run db:types` | Genera tipos TypeScript desde la BD local |

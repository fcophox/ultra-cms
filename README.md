# UltraCMS

CMS headless **white-label** sobre **Next.js + Supabase**. Clónalo por proyecto,
apúntalo a un Supabase propio y consume el contenido desde cualquier frontend con
`@ultracms/sdk`.

Ver el diseño completo en [PLAN.md](./PLAN.md).

## Estructura

```
apps/admin       Panel de administración (Next.js App Router)
packages/sdk     @ultracms/sdk — cliente tipado de solo lectura para frontends
supabase/        Esquema versionado (migraciones, RLS, storage) + seed
ultra.config.ts  Branding y categorías por proyecto (white-label)
```

## Puesta en marcha (por cada clon)

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Crear un proyecto en Supabase** y copiar las credenciales a `apps/admin/.env.local`:
   ```bash
   cp .env.example apps/admin/.env.local
   # completa NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Aplicar el esquema** (tablas, RLS, storage):
   ```bash
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```
   O en local: `npx supabase start` y `npx supabase db reset` (aplica migraciones + seed).

4. **Crear el primer admin** en el dashboard de Supabase → Authentication → Add user
   (el trigger crea su `profile` automáticamente).

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

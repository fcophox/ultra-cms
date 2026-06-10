# UltraCMS — Plan de arquitectura

CMS headless, **white-label** y reutilizable, construido sobre **Next.js + Supabase**.
La idea: clonar este repo por cada proyecto, apuntarlo a un Supabase propio, y consumir
el contenido desde cualquier frontend Next.js mediante un SDK tipado.

---

## 1. Decisiones tomadas

| Decisión | Elección | Implicancia |
|---|---|---|
| Multi-tenancy | **Clonar por proyecto** (1 Supabase c/u) | Aislamiento total de datos. White-label real. Sin `project_id` ni RLS multi-tenant. |
| Consumo de contenido | **SDK tipado + API de solo lectura** | Los frontends instalan `@ultracms/sdk` y nunca tocan Supabase directo. |
| Stack admin | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui | Un solo deploy en Vercel. |
| Base de datos / Auth / Storage | Supabase (Postgres + Auth + Storage) | Todo gestionado, con RLS. |
| Editor enriquecido | TipTap (almacena JSON + HTML renderizado) | JSON editable como fuente de verdad, HTML cacheado para entrega rápida. |

---

## 2. Concepto white-label (cómo se reutiliza)

UltraCMS **no** es un frontend. Es el **panel de administración + backend + SDK**. Para cada
proyecto nuevo:

```
1. Clonar el repo  ───►  ultra-cms-proyecto-X
2. Crear un proyecto nuevo en Supabase  ───►  copiar URL + keys al .env
3. supabase db push   (aplica migraciones: tablas, RLS, storage)
4. Definir las categorías/branding en ultra.config.ts
5. Deploy del admin en Vercel
6. El frontend de ese proyecto instala @ultracms/sdk y lee el contenido
```

El mismo código sirve para Blog, Servicios, Casos, etc. — las **categorías son datos**, no
código. Cualquier proyecto define las suyas desde el panel.

---

## 3. Estructura del repo (monorepo con npm workspaces)

```
ultra-cms/
├── PLAN.md
├── package.json            # workspace root
├── ultra.config.ts         # branding + tipos de contenido por proyecto (white-label)
├── .env.example
├── supabase/
│   ├── config.toml
│   ├── migrations/         # esquema versionado (db push para clonar)
│   │   └── 0001_init.sql
│   └── seed.sql            # datos de ejemplo (categorías base, admin)
├── packages/
│   └── sdk/                # @ultracms/sdk  →  lo instala cada frontend
│       └── src/{client,types,index}.ts
└── apps/
    └── admin/              # panel Next.js (App Router)
        └── src/
            ├── app/
            │   ├── (auth)/login
            │   └── (dashboard)/
            │       ├── articles/
            │       ├── categories/
            │       └── contacts/
            ├── lib/supabase/   # clients server/browser + middleware
            └── components/
```

---

## 4. Modelo de datos (Postgres / Supabase)

```
profiles        admins (1:1 con auth.users) — id, email, full_name, role
categories      id, slug(unique), name, description, sort_order, timestamps
articles        id, category_id→, title, slug, excerpt,
                content(jsonb TipTap), content_html(text),
                cover_image_url, status(draft|published|archived),
                seo_title, seo_description, author_id→profiles,
                published_at, timestamps
                UNIQUE(category_id, slug)
media           id, article_id→(null), path, url, type, alt, width, height, size_bytes
contacts        id, name, email, phone, subject, message,
                source(form/página), metadata(jsonb),
                status(new|read|archived), created_at
```

**Storage:** bucket `media` (lectura pública, escritura solo admins).

### Reglas RLS
- `anon` (público): `SELECT` en `articles` donde `status='published'` + `categories`.
- `anon` (público): `INSERT` en `contacts` (formularios de contacto del frontend).
- `authenticated` (admin): acceso total a todo.

Así el frontend usa la **anon key** sin riesgo: solo ve contenido publicado y solo puede
crear contactos.

---

## 5. Cómo consume el frontend (`@ultracms/sdk`)

```ts
import { createUltraClient } from "@ultracms/sdk";

const cms = createUltraClient({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

await cms.categories.list();
await cms.articles.list({ category: "blog", limit: 10 });
await cms.articles.bySlug({ category: "blog", slug: "mi-post" });
await cms.contacts.submit({ name, email, message, source: "home" });
```

El SDK envuelve `supabase-js` y solo expone operaciones de lectura + envío de contacto.
Tipado completo → autocompletado en cualquier proyecto.

---

## 6. Roadmap por fases

| Fase | Entregable | Estado |
|---|---|---|
| **0. Fundaciones** | Monorepo, Supabase config, migración inicial (esquema + RLS + storage), `.env` | ✅ |
| **1. Auth + shell** | Login Supabase Auth, middleware de protección, layout del dashboard | ✅ |
| **2. Categorías** | CRUD de categorías | ✅ |
| **3. Artículos** | CRUD + editor TipTap (texto enriquecido) + subida multimedia a Storage | ✅ |
| **4. Contactos** | Bandeja de contactos + endpoint público de envío | ✅ |
| **5. SDK** | `@ultracms/sdk` publicable, tipado, read-only | ✅ (base) |
| **6. White-label** | `ultra.config.ts`, template repo en GitHub, docs de clonado | ⬜ |
| **7. Deploy** | Vercel (admin) + Supabase, guía paso a paso | ⬜ |

---

## 7. Seguridad
- Login con Supabase Auth (email/password; ampliable a OAuth/magic link).
- RLS en todas las tablas — nada accesible sin política explícita.
- `service_role` key **solo** en el servidor del admin, nunca expuesta al frontend.
- Frontends usan únicamente la `anon` key con permisos mínimos (leer publicado + crear contacto).
- Middleware de Next.js redirige a `/login` cualquier ruta del dashboard sin sesión.

---

## 8. Deploy
- **Admin:** Vercel (1 proyecto por clon). Variables de entorno = credenciales del Supabase de ese proyecto.
- **Supabase:** 1 proyecto por clon. Migraciones aplicadas con `supabase db push`.
- **Frontends:** sus propios deploys; instalan `@ultracms/sdk` (npm privado o ruta git/local).

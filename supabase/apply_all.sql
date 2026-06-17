-- ============================================================
-- UltraCMS — esquema completo (0001 + 0002) para aplicar de una vez
-- Pega TODO esto en Supabase → SQL Editor → Run
-- ============================================================

-- ============================================================================
-- UltraCMS — esquema inicial
-- Tablas: profiles, categories, articles, media, contacts
-- + Row Level Security + bucket de Storage para multimedia
-- ============================================================================

-- Extensiones --------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Tipos enumerados ---------------------------------------------------------
do $$ begin
  create type article_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type contact_status as enum ('new', 'read', 'archived');
exception when duplicate_object then null; end $$;

-- Helper: updated_at automático --------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ============================================================================
-- profiles : administradores (1:1 con auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'admin',
  created_at  timestamptz not null default now()
);

-- Crear profile automáticamente al registrarse un usuario
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- categories
-- ============================================================================
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

-- ============================================================================
-- articles
-- ============================================================================
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  category_id     uuid not null references public.categories(id) on delete restrict,
  title           text not null,
  slug            text not null,
  excerpt         text,
  content         jsonb,                     -- TipTap JSON (fuente de verdad editable)
  content_html    text,                      -- HTML renderizado (entrega rápida)
  cover_image_url text,
  status          article_status not null default 'draft',
  seo_title       text,
  seo_description text,
  author_id       uuid references public.profiles(id) on delete set null,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (category_id, slug)
);

create index if not exists articles_category_idx on public.articles(category_id);
create index if not exists articles_status_idx   on public.articles(status);
create index if not exists articles_published_idx on public.articles(published_at desc);

create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

-- ============================================================================
-- media : referencias a archivos en Storage
-- ============================================================================
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  article_id  uuid references public.articles(id) on delete set null,
  path        text not null,
  url         text not null,
  type        text,
  alt         text,
  width       int,
  height      int,
  size_bytes  bigint,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- contacts : envíos de formularios de contacto
-- ============================================================================
create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  subject     text,
  message     text not null,
  source      text,                          -- nombre del formulario / página
  metadata    jsonb,
  status      contact_status not null default 'new',
  created_at  timestamptz not null default now()
);

create index if not exists contacts_status_idx on public.contacts(status);
create index if not exists contacts_created_idx on public.contacts(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.articles   enable row level security;
alter table public.media      enable row level security;
alter table public.contacts   enable row level security;

-- profiles: cada admin ve/edita su propio perfil; admins ven todos
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- categories: lectura pública, escritura solo autenticados
create policy "categories_public_read" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- articles: público solo ve publicados; autenticados ven/editan todo
create policy "articles_public_read_published" on public.articles
  for select using (status = 'published');
create policy "articles_admin_all" on public.articles
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- media: lectura pública, escritura solo autenticados
create policy "media_public_read" on public.media
  for select using (true);
create policy "media_admin_write" on public.media
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- contacts: el público SOLO puede insertar; admins leen/gestionan
create policy "contacts_public_insert" on public.contacts
  for insert with check (true);
create policy "contacts_admin_read" on public.contacts
  for select using (auth.role() = 'authenticated');
create policy "contacts_admin_update" on public.contacts
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE : bucket público para multimedia
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_storage_public_read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media_storage_admin_write" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "media_storage_admin_update" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "media_storage_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');


-- ============================================================================
-- UltraCMS — i18n (fila por idioma) + contenido estructurado
-- Aditiva e idempotente sobre 0001_init.sql
-- ============================================================================

-- articles: idioma, grupo de traducción y datos estructurados -----------------
alter table public.articles
  add column if not exists locale text not null default 'es';

alter table public.articles
  add column if not exists translation_group uuid not null default gen_random_uuid();

alter table public.articles
  add column if not exists data jsonb;

-- Unicidad ahora por (categoría, slug, idioma) --------------------------------
-- El nombre del constraint generado por `unique (category_id, slug)` en 0001 es
-- articles_category_id_slug_key.
alter table public.articles
  drop constraint if exists articles_category_id_slug_key;

do $$ begin
  alter table public.articles
    add constraint articles_category_slug_locale_key unique (category_id, slug, locale);
exception when duplicate_object then null; end $$;

-- Índices --------------------------------------------------------------------
create index if not exists articles_locale_idx on public.articles(locale);
create index if not exists articles_translation_group_idx on public.articles(translation_group);

-- Categoría 'servicios' (alineada con ultra.config.ts) ------------------------
insert into public.categories (slug, name, description, sort_order)
values ('servicios', 'Servicios', 'Servicios ofrecidos', 2)
on conflict (slug) do nothing;

-- Seed opcional (categorías + artículo de ejemplo):
-- Datos de ejemplo para desarrollo local (supabase db reset los aplica).
-- Categorías base — alineadas con ultra.config.ts
insert into public.categories (slug, name, description, sort_order) values
  ('blog',      'Blog',      'Artículos y novedades',        1),
  ('servicios', 'Servicios', 'Servicios ofrecidos',          2),
  ('casos',     'Casos',     'Casos de éxito / portfolio',   3)
on conflict (slug) do nothing;

-- Artículo de ejemplo publicado
insert into public.articles (category_id, title, slug, locale, excerpt, content_html, status, published_at)
select c.id,
       '¡Hola, UltraCMS!',
       'hola-ultracms',
       'es',
       'Primer artículo de ejemplo.',
       '<p>Este contenido viene de <strong>UltraCMS</strong>.</p>',
       'published',
       now()
from public.categories c where c.slug = 'blog'
on conflict (category_id, slug, locale) do nothing;

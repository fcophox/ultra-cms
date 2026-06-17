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

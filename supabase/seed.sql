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

# Changelog

Todas las mejoras notables de UltraCMS se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado sigue [SemVer](https://semver.org/lang/es/):
`MAYOR.MENOR.PARCHE` → incompatibilidades · nuevas features · correcciones.

> **Cómo se propaga una mejora:** subes el cambio a `main` y todos los
> despliegues en Vercel se reconstruyen solos. La versión visible en el panel
> (esquina inferior) refleja la última publicada. Recuerda subir el número en
> `apps/admin/package.json` al hacer release y, si hubo cambios de esquema,
> aplicar las migraciones a cada Supabase.

## [No publicado]

### Añadido
- Internacionalización de artículos (es / en) con grupo de traducción.
- Campo de datos estructurados (`data` JSONB) para contenidos tipo servicios.
- Número de versión visible en el panel, con enlace a este changelog.

## [0.2.0] — 2026-06-17

### Añadido
- Asistente `npm run init`: configura credenciales de Supabase y branding
  para un proyecto nuevo en un solo comando.
- Repositorio utilizable como **template** de GitHub.

## [0.1.0] — 2026-06-10

### Añadido
- Login seguro con Supabase Auth y middleware de protección de rutas.
- CRUD de categorías.
- CRUD de artículos con editor de texto enriquecido (TipTap) y subida de
  multimedia a Supabase Storage.
- Bandeja de contactos con gestión de estado (nuevo / leído / archivado) y
  endpoint público de envío (`POST /api/contact`).
- Paquete `@ultracms/sdk`: cliente tipado de solo lectura para frontends.
- Esquema versionado de Supabase (tablas, RLS, storage).

[No publicado]: https://github.com/fcophox/ultra-cms/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/fcophox/ultra-cms/releases/tag/v0.2.0
[0.1.0]: https://github.com/fcophox/ultra-cms/releases/tag/v0.1.0

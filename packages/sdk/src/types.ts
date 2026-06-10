export type ArticleStatus = "draft" | "published" | "archived";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface Article {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  /** TipTap JSON — fuente de verdad editable. */
  content: unknown | null;
  /** HTML renderizado, listo para inyectar en el frontend. */
  content_html: string | null;
  cover_image_url: string | null;
  status: ArticleStatus;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface ListArticlesOptions {
  /** Slug de la categoría a filtrar. */
  category?: string;
  limit?: number;
  offset?: number;
}

export interface UltraClientOptions {
  url: string;
  anonKey: string;
}

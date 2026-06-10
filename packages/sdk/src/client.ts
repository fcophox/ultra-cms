import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type {
  Article,
  Category,
  ContactInput,
  ListArticlesOptions,
  UltraClientOptions,
} from "./types.js";

const ARTICLE_FIELDS =
  "id, category_id, title, slug, excerpt, content, content_html, cover_image_url, status, seo_title, seo_description, published_at";

/**
 * Cliente de solo lectura para consumir contenido de UltraCMS desde
 * cualquier frontend. Usa la `anon` key; RLS garantiza que solo se vea
 * contenido publicado y que únicamente se puedan crear contactos.
 */
export class UltraClient {
  private supabase: SupabaseClient;

  constructor(options: UltraClientOptions) {
    this.supabase = createClient(options.url, options.anonKey, {
      auth: { persistSession: false },
    });
  }

  categories = {
    list: async (): Promise<Category[]> => {
      const { data, error } = await this.supabase
        .from("categories")
        .select("id, slug, name, description, sort_order")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  };

  articles = {
    list: async (options: ListArticlesOptions = {}): Promise<Article[]> => {
      let query = this.supabase
        .from("articles")
        .select(ARTICLE_FIELDS)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (options.category) {
        const category = await this.categoryBySlug(options.category);
        if (!category) return [];
        query = query.eq("category_id", category.id);
      }
      if (options.limit != null) {
        query = query.range(
          options.offset ?? 0,
          (options.offset ?? 0) + options.limit - 1,
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Article[];
    },

    bySlug: async (params: {
      category: string;
      slug: string;
    }): Promise<Article | null> => {
      const category = await this.categoryBySlug(params.category);
      if (!category) return null;
      const { data, error } = await this.supabase
        .from("articles")
        .select(ARTICLE_FIELDS)
        .eq("category_id", category.id)
        .eq("slug", params.slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return (data as Article) ?? null;
    },
  };

  contacts = {
    submit: async (input: ContactInput): Promise<void> => {
      const { error } = await this.supabase.from("contacts").insert({
        name: input.name,
        email: input.email,
        message: input.message,
        phone: input.phone ?? null,
        subject: input.subject ?? null,
        source: input.source ?? null,
        metadata: input.metadata ?? null,
      });
      if (error) throw error;
    },
  };

  private async categoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await this.supabase
      .from("categories")
      .select("id, slug, name, description, sort_order")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return (data as Category) ?? null;
  }
}

export function createUltraClient(options: UltraClientOptions): UltraClient {
  return new UltraClient(options);
}

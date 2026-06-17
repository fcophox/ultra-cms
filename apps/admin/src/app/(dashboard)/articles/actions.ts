"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ArticleInput {
  id?: string;
  category_id: string;
  title: string;
  slug: string;
  locale: "es" | "en";
  /** UUID que enlaza versiones por idioma. Vacío = se genera uno nuevo. */
  translation_group?: string;
  excerpt: string;
  content: unknown;
  content_html: string;
  /** JSON estructurado (p.ej. servicios). Cadena vacía / null = sin datos. */
  data?: unknown;
  cover_image_url: string;
  status: "draft" | "published" | "archived";
  seo_title: string;
  seo_description: string;
}

export type ActionResult = { error: string } | undefined;

export async function saveArticle(input: ArticleInput): Promise<ActionResult> {
  if (!input.title.trim()) return { error: "El título es obligatorio." };
  if (!input.slug.trim()) return { error: "El slug es obligatorio." };
  if (!input.category_id) return { error: "Selecciona una categoría." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const row = {
    category_id: input.category_id,
    title: input.title.trim(),
    slug: input.slug.trim(),
    locale: input.locale,
    excerpt: input.excerpt || null,
    content: input.content ?? null,
    content_html: input.content_html || null,
    data: input.data ?? null,
    cover_image_url: input.cover_image_url || null,
    status: input.status,
    seo_title: input.seo_title || null,
    seo_description: input.seo_description || null,
  };

  if (input.id) {
    // Conserva la fecha de publicación original; la fija la primera vez
    // que el artículo pasa a "published".
    const { data: existing } = await supabase
      .from("articles")
      .select("published_at")
      .eq("id", input.id)
      .single();

    let published_at = existing?.published_at ?? null;
    if (input.status === "published" && !published_at) {
      published_at = new Date().toISOString();
    }
    if (input.status !== "published") {
      published_at = null;
    }

    const { error } = await supabase
      .from("articles")
      .update({ ...row, published_at })
      .eq("id", input.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("articles").insert({
      ...row,
      // Si se indica, enlaza con la versión en otro idioma; si no, la BD
      // genera un translation_group nuevo por defecto.
      ...(input.translation_group?.trim()
        ? { translation_group: input.translation_group.trim() }
        : {}),
      author_id: user?.id ?? null,
      published_at:
        input.status === "published" ? new Date().toISOString() : null,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/articles");
  redirect("/articles");
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/articles");
}

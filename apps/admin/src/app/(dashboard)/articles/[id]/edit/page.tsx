import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ArticleEditor } from "@/components/article-editor";
import { DeleteArticleButton } from "@/components/delete-article-button";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: article }, { data: categories }] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("sort_order"),
  ]);

  if (!article) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/articles" className="text-sm text-slate-500 hover:underline">
          ← Artículos
        </Link>
        <h1 className="flex-1 text-2xl font-bold tracking-tight">
          Editar artículo
        </h1>
        <DeleteArticleButton id={article.id} />
      </div>
      <ArticleEditor
        categories={categories ?? []}
        initial={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          category_id: article.category_id,
          excerpt: article.excerpt ?? "",
          content: article.content,
          content_html: article.content_html ?? "",
          cover_image_url: article.cover_image_url ?? "",
          status: article.status,
          seo_title: article.seo_title ?? "",
          seo_description: article.seo_description ?? "",
        }}
      />
    </div>
  );
}

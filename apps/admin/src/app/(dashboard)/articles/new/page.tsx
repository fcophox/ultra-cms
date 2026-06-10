import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ArticleEditor } from "@/components/article-editor";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/articles" className="text-sm text-slate-500 hover:underline">
          ← Artículos
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Nuevo artículo</h1>
      </div>
      <ArticleEditor categories={categories ?? []} />
    </div>
  );
}

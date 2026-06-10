import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryForm } from "@/components/category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, description, sort_order")
    .eq("id", id)
    .maybeSingle();

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/categories"
          className="text-sm text-slate-500 hover:underline"
        >
          ← Categorías
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Editar categoría</h1>
      </div>
      <CategoryForm
        initial={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          sort_order: category.sort_order,
        }}
      />
    </div>
  );
}

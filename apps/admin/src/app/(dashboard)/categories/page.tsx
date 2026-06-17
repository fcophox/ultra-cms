import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name, description, sort_order")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
        <Link
          href="/categories/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          + Nueva categoría
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-foreground/[0.03] text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories?.map((c) => (
              <tr key={c.id} className="hover:bg-foreground/5">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/categories/${c.id}/edit`}
                    className="hover:text-primary hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{c.slug}</td>
                <td className="px-4 py-3 text-muted">{c.description}</td>
              </tr>
            ))}
            {!categories?.length && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted">
                  Aún no hay categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

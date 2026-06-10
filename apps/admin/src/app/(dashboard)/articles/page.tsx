import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-slate-100 text-slate-600",
  archived: "bg-amber-100 text-amber-700",
};

export default async function ArticlesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, status, updated_at, categories(name)")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Artículos</h1>
        <Link
          href="/articles/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          + Nuevo artículo
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles?.map((a) => {
              const category = a.categories as unknown as
                | { name: string }
                | null;
              return (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/articles/${a.id}/edit`}
                      className="hover:text-indigo-600 hover:underline"
                    >
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        STATUS_STYLES[a.status] ?? STATUS_STYLES.draft
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {!articles?.length && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                  Aún no hay artículos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

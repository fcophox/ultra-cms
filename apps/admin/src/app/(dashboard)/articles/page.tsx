import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-foreground/10 text-muted",
  archived: "bg-amber-100 text-amber-700",
};

export default async function ArticlesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, status, locale, updated_at, categories(name)")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Artículos</h1>
        <Link
          href="/articles/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          + Nuevo artículo
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-foreground/[0.03] text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Idioma</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles?.map((a) => {
              const category = a.categories as unknown as
                | { name: string }
                | null;
              return (
                <tr key={a.id} className="hover:bg-foreground/5">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/articles/${a.id}/edit`}
                      className="hover:text-primary hover:underline"
                    >
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-foreground/10 px-2 py-1 text-xs font-medium uppercase text-muted">
                      {a.locale ?? "es"}
                    </span>
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
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
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

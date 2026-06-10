import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function count(table: string, filter?: [string, string]) {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) query = query.eq(filter[0], filter[1]);
  const { count } = await query;
  return count ?? 0;
}

export default async function DashboardHome() {
  const [articles, published, categories, newContacts] = await Promise.all([
    count("articles"),
    count("articles", ["status", "published"]),
    count("categories"),
    count("contacts", ["status", "new"]),
  ]);

  const cards = [
    { label: "Artículos", value: articles, href: "/articles" },
    { label: "Publicados", value: published, href: "/articles" },
    { label: "Categorías", value: categories, href: "/categories" },
    { label: "Contactos nuevos", value: newContacts, href: "/contacts" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Panel</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-sm"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

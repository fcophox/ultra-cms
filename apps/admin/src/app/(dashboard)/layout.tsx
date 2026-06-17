import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/articles", label: "Artículos" },
  { href: "/categories", label: "Categorías" },
  { href: "/contacts", label: "Contactos" },
];

const VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";
const CHANGELOG_URL =
  "https://github.com/fcophox/ultra-cms/blob/main/CHANGELOG.md";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-col border-r border-slate-200 bg-white p-4">
        <div className="px-2 py-3 text-lg font-bold tracking-tight">
          Ultra<span className="text-indigo-600">CMS</span>
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 pt-3">
          <p className="truncate px-3 text-xs text-slate-400">{user?.email}</p>
          <form action="/auth/signout" method="post">
            <button className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              Cerrar sesión
            </button>
          </form>
          <a
            href={CHANGELOG_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block px-3 text-xs text-slate-400 transition hover:text-indigo-600"
            title="Ver novedades"
          >
            UltraCMS v{VERSION} · Novedades
          </a>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

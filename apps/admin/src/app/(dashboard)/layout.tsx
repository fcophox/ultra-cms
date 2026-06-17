import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";

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
      <aside className="flex w-60 flex-col border-r border-border bg-surface p-4">
        <div className="px-2 py-3 text-lg font-bold tracking-tight">
          Ultra<span className="text-primary">CMS</span>
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-foreground/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border pt-3">
          <p className="truncate px-3 text-xs text-muted">{user?.email}</p>
          <form action="/auth/signout" method="post">
            <button className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-muted transition hover:bg-foreground/5">
              Cerrar sesión
            </button>
          </form>
          <ThemeToggle />
          <a
            href={CHANGELOG_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block px-3 text-xs text-muted transition hover:text-primary"
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

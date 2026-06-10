import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-green-100 text-green-700",
  read: "bg-slate-100 text-slate-600",
  archived: "bg-amber-100 text-amber-700",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nuevo",
  read: "Leído",
  archived: "Archivado",
};

const FILTERS = [
  { value: "", label: "Todos" },
  { value: "new", label: "Nuevos" },
  { value: "read", label: "Leídos" },
  { value: "archived", label: "Archivados" },
];

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("contacts")
    .select("id, name, email, subject, source, status, created_at")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data: contacts } = await query;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Contactos</h1>

      <div className="flex gap-2">
        {FILTERS.map((f) => {
          const active = (status ?? "") === f.value;
          return (
            <Link
              key={f.value}
              href={f.value ? `/contacts?status=${f.value}` : "/contacts"}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Asunto</th>
              <th className="px-4 py-3 font-medium">Origen</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts?.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/contacts/${c.id}`}
                    className="hover:text-indigo-600 hover:underline"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500">{c.email}</td>
                <td className="px-4 py-3 text-slate-500">{c.subject ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500">{c.source ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      STATUS_STYLES[c.status] ?? STATUS_STYLES.read
                    }`}
                  >
                    {STATUS_LABELS[c.status] ?? c.status}
                  </span>
                </td>
              </tr>
            ))}
            {!contacts?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No hay contactos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

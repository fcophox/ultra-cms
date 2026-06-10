import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ContactStatusControls } from "@/components/contact-status-controls";

export const dynamic = "force-dynamic";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="flex gap-3 py-2 text-sm">
      <span className="w-28 shrink-0 font-medium text-slate-500">{label}</span>
      <span className="text-slate-800">{children}</span>
    </div>
  );
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: contact } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!contact) notFound();

  const created = new Date(contact.created_at).toLocaleString("es", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/contacts" className="text-sm text-slate-500 hover:underline">
          ← Contactos
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{contact.name}</h1>
      </div>

      <ContactStatusControls id={contact.id} status={contact.status} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <Row label="Email">
          <a
            href={`mailto:${contact.email}`}
            className="text-indigo-600 hover:underline"
          >
            {contact.email}
          </a>
        </Row>
        <Row label="Teléfono">{contact.phone}</Row>
        <Row label="Asunto">{contact.subject}</Row>
        <Row label="Origen">{contact.source}</Row>
        <Row label="Recibido">{created}</Row>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2 text-sm font-medium text-slate-500">Mensaje</p>
          <p className="whitespace-pre-wrap text-sm text-slate-800">
            {contact.message}
          </p>
        </div>

        {contact.metadata && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-2 text-sm font-medium text-slate-500">Metadata</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
              {JSON.stringify(contact.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

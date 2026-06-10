import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Endpoint público de envío de contacto.
 *
 * Alternativa REST al SDK (`cms.contacts.submit()`) para frontends que
 * prefieran un POST plano. RLS permite el insert con la `anon` key.
 *
 *   POST /api/contact
 *   { name, email, message, phone?, subject?, source?, metadata? }
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido" },
      { status: 400, headers: CORS },
    );
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "name, email y message son obligatorios" },
      { status: 400, headers: CORS },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contacts").insert({
    name,
    email,
    message,
    phone: body.phone ? String(body.phone) : null,
    subject: body.subject ? String(body.subject) : null,
    source: body.source ? String(body.source) : null,
    metadata: body.metadata ?? null,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: CORS },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201, headers: CORS });
}

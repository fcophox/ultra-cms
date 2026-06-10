import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Sube un archivo al bucket `media` de Supabase Storage y devuelve su URL
 * pública. Se ejecuta en el navegador con la sesión del admin (RLS permite
 * escritura solo a usuarios autenticados).
 */
export async function uploadMedia(file: File): Promise<string> {
  const supabase = createSupabaseBrowserClient();

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  return publicUrl;
}

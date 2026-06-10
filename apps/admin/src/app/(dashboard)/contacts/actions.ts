"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ContactStatus = "new" | "read" | "archived";

export async function updateContactStatus(
  id: string,
  status: ContactStatus,
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.from("contacts").update({ status }).eq("id", id);
  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
}

export async function deleteContact(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.from("contacts").delete().eq("id", id);
  revalidatePath("/contacts");
  redirect("/contacts");
}

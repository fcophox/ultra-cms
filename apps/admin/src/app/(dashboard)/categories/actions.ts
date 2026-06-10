"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface CategoryInput {
  id?: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
}

export type ActionResult = { error: string } | undefined;

export async function saveCategory(
  input: CategoryInput,
): Promise<ActionResult> {
  if (!input.name.trim()) return { error: "El nombre es obligatorio." };
  if (!input.slug.trim()) return { error: "El slug es obligatorio." };

  const supabase = await createSupabaseServerClient();
  const row = {
    name: input.name.trim(),
    slug: input.slug.trim(),
    description: input.description || null,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
  };

  if (input.id) {
    const { error } = await supabase
      .from("categories")
      .update(row)
      .eq("id", input.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("categories").insert(row);
    if (error) return { error: error.message };
  }

  revalidatePath("/categories");
  redirect("/categories");
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    // FK on delete restrict: la categoría tiene artículos asociados.
    return {
      error:
        "No se puede eliminar: la categoría tiene artículos asociados. Reasígnalos o elimínalos primero.",
    };
  }
  revalidatePath("/categories");
  return undefined;
}

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DayAvailability } from "@/lib/calendar";

export type ActionResult = { error: string } | undefined;

export async function saveCalendar(
  days: DayAvailability[],
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const rows = days.map((d) => ({
    weekday: d.weekday,
    full_day_blocked: d.full_day_blocked,
    blocked_slots: d.blocked_slots,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("calendar_availability")
    .upsert(rows, { onConflict: "weekday" });

  if (error) return { error: error.message };

  revalidatePath("/complementos/calendario");
  return undefined;
}

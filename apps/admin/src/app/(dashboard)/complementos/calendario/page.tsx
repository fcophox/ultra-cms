import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeDays } from "@/lib/calendar";
import { CalendarConfig } from "@/components/calendar-config";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("calendar_availability")
    .select("weekday, full_day_blocked, blocked_slots")
    .order("weekday");

  const days = normalizeDays(data);

  return <CalendarConfig initialDays={days} />;
}

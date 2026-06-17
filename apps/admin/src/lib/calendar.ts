/**
 * Lógica compartida del complemento Calendario.
 *
 * Por ahora el rango y la duración de los bloques son fijos; más adelante
 * se podrán configurar como valores globales.
 */

export const WEEKDAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

/** Valores por defecto de los bloques (fijos por ahora). */
export const DEFAULT_START = "18:30";
export const DEFAULT_END = "21:00";
export const DEFAULT_SLOT_MINUTES = 15;

export interface TimeSlot {
  /** Identificador estable = hora de inicio "HH:MM". */
  id: string;
  /** Etiqueta visible "18:30 - 18:45 hrs". */
  label: string;
}

function fmt(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Genera los bloques horarios entre start y end con paso slotMinutes. */
export function generateSlots(
  start = DEFAULT_START,
  end = DEFAULT_END,
  slotMinutes = DEFAULT_SLOT_MINUTES,
): TimeSlot[] {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  const slots: TimeSlot[] = [];
  for (let t = startMin; t + slotMinutes <= endMin; t += slotMinutes) {
    slots.push({ id: fmt(t), label: `${fmt(t)} - ${fmt(t + slotMinutes)} hrs` });
  }
  return slots;
}

/** Configuración de un día de la semana. */
export interface DayAvailability {
  weekday: number; // 0 = Lunes … 6 = Domingo
  full_day_blocked: boolean;
  blocked_slots: string[];
}

/** Devuelve los 7 días, rellenando con disponibles los que falten en la BD. */
export function normalizeDays(
  rows: Partial<DayAvailability>[] | null | undefined,
): DayAvailability[] {
  return WEEKDAYS.map((_, weekday) => {
    const row = rows?.find((r) => r.weekday === weekday);
    return {
      weekday,
      full_day_blocked: row?.full_day_blocked ?? false,
      blocked_slots: row?.blocked_slots ?? [],
    };
  });
}

export function dayHasConfig(day: DayAvailability): boolean {
  return day.full_day_blocked || day.blocked_slots.length > 0;
}

/**
 * Disponibilidad del complemento Calendario, para consumir desde el frontend
 * (formulario "Agendemos una reunión virtual").
 *
 * El rango y la duración de los bloques son fijos por ahora y reflejan los
 * mismos valores que el panel de administración.
 */

export const CALENDAR_DEFAULT_START = "18:30";
export const CALENDAR_DEFAULT_END = "21:00";
export const CALENDAR_DEFAULT_SLOT_MINUTES = 15;

/** Etiquetas de los días, índice 0 = Lunes … 6 = Domingo. */
export const WEEKDAY_LABELS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export interface TimeSlot {
  /** Hora de inicio "HH:MM". */
  id: string;
  /** Etiqueta visible "18:30 - 18:45 hrs". */
  label: string;
}

export interface DayAvailability {
  weekday: number; // 0 = Lunes … 6 = Domingo
  full_day_blocked: boolean;
  blocked_slots: string[];
}

function fmt(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateSlots(
  start = CALENDAR_DEFAULT_START,
  end = CALENDAR_DEFAULT_END,
  slotMinutes = CALENDAR_DEFAULT_SLOT_MINUTES,
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

/** Índice 0 = Lunes … 6 = Domingo a partir de una fecha. */
export function weekdayIndex(date: Date | string): number {
  let d: Date;
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, day] = date.split("-").map(Number);
    d = new Date(y, m - 1, day);
  } else {
    d = typeof date === "string" ? new Date(date) : date;
  }
  return (d.getDay() + 6) % 7; // getDay: 0=Domingo…6=Sábado
}

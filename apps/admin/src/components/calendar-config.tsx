"use client";

import { useMemo, useState, useTransition } from "react";
import {
  WEEKDAYS,
  generateSlots,
  dayHasConfig,
  type DayAvailability,
} from "@/lib/calendar";
import { saveCalendar } from "@/app/(dashboard)/complementos/calendario/actions";

export function CalendarConfig({
  initialDays,
}: {
  initialDays: DayAvailability[];
}) {
  const slots = useMemo(() => generateSlots(), []);
  const [days, setDays] = useState<DayAvailability[]>(initialDays);
  const [selected, setSelected] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const day = days[selected];

  function updateDay(index: number, patch: Partial<DayAvailability>) {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    );
    setDirty(true);
    setSaved(false);
  }

  function toggleFullDay() {
    updateDay(selected, { full_day_blocked: !day.full_day_blocked });
  }

  function toggleSlot(id: string) {
    if (day.full_day_blocked) return;
    const blocked = day.blocked_slots.includes(id)
      ? day.blocked_slots.filter((s) => s !== id)
      : [...day.blocked_slots, id];
    updateDay(selected, { blocked_slots: blocked });
  }

  function onSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveCalendar(days);
      if (result?.error) setError(result.error);
      else {
        setDirty(false);
        setSaved(true);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header + guardar */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Calendario</h1>
        <div className="flex items-center gap-3">
          {saved && !dirty && (
            <span className="text-sm font-medium text-green-600">
              ✓ Guardado
            </span>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={pending || !dirty}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Pestañas de días */}
      <div className="flex flex-wrap gap-1 rounded-2xl border border-border bg-surface p-2">
        {WEEKDAYS.map((label, i) => {
          const active = i === selected;
          const configured = dayHasConfig(days[i]);
          return (
            <button
              key={label}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
                active
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {label}
              {configured && (
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Card del día seleccionado */}
      <div className="space-y-6 rounded-2xl border border-border bg-surface p-6">
        {/* Encabezado del día + bloquear día completo */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wide">
                {WEEKDAYS[selected]}
              </h2>
              <p className="text-sm text-muted">
                Configuración específica para este día
              </p>
            </div>
          </div>

          <label className="flex shrink-0 items-center gap-3">
            <span className="text-sm font-medium text-muted">
              Bloquear día completo
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={day.full_day_blocked}
              onClick={toggleFullDay}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                day.full_day_blocked ? "bg-red-500" : "bg-foreground/15"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  day.full_day_blocked ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>
        </div>

        <div className="border-t border-border" />

        {/* Gestión de bloques */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h3 className="font-semibold text-foreground">
              Gestión de bloques horarios
            </h3>
          </div>
          <p className="text-sm text-muted">
            Haz clic en el bloque para desactivarlo. Los bloques seleccionados en{" "}
            <span className="font-medium text-red-500">rojo</span> no estarán
            disponibles para agendar.
          </p>
        </div>

        {/* Grilla de bloques */}
        <div
          className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 ${
            day.full_day_blocked ? "opacity-40" : ""
          }`}
        >
          {slots.map((slot) => {
            const blocked = day.blocked_slots.includes(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                disabled={day.full_day_blocked}
                onClick={() => toggleSlot(slot.id)}
                className={`relative rounded-xl border px-3 py-4 text-center text-sm transition ${
                  blocked
                    ? "border-red-400 bg-red-500/10 text-red-500"
                    : "border-border bg-surface text-foreground hover:border-primary/50 hover:bg-foreground/5"
                } ${day.full_day_blocked ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {blocked && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
                {slot.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info de sincronización */}
      <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            Información sobre la sincronización
          </h3>
          <p className="mt-1 text-sm text-muted">
            Estas configuraciones se guardan por día de la semana y se reflejarán
            en el formulario de contacto para cualquier cliente que seleccione una
            fecha que corresponda a ese día.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  isPluginActive,
  setPluginActive,
  PLUGIN_EVENT,
  type PluginChangeDetail,
} from "@/lib/plugins";

interface PluginCardProps {
  id: string;
  name: string;
  description: string;
  /** Icono mostrado en la parte superior. */
  children: React.ReactNode;
}

/**
 * Card de complemento: icono, nombre, descripción y switch de activación.
 * Al activarlo aparece como entrada en el sidebar (vía evento compartido).
 */
export function PluginCard({ id, name, description, children }: PluginCardProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isPluginActive(id));
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<PluginChangeDetail>).detail;
      if (detail.id === id) setActive(detail.active);
    };
    window.addEventListener(PLUGIN_EVENT, handler);
    return () => window.removeEventListener(PLUGIN_EVENT, handler);
  }, [id]);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {children}
      </div>

      <h3 className="text-base font-semibold text-foreground">{name}</h3>
      <p className="mt-1 flex-1 text-sm text-muted">{description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-muted">
          {active ? "Activado" : "Desactivado"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={active}
          aria-label={`Activar ${name}`}
          onClick={() => setPluginActive(id, !active)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            active ? "bg-primary" : "bg-foreground/15"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              active ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

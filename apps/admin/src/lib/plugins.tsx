import type { ReactNode } from "react";

/**
 * Registro central de complementos.
 *
 * A medida que desarrolles complementos especiales (agendamiento, ticketera,
 * marketplace…), agrégalos aquí. Las cards de /complementos y las entradas
 * del sidebar se generan a partir de esta lista.
 */
export interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
}

export const PLUGINS: Plugin[] = [
  {
    id: "calendario",
    name: "Calendario",
    description:
      "Gestiona eventos y fechas, y muéstralos en tu sitio. Ideal para agendas, reservas o publicaciones programadas.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
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
    ),
  },
];

export function getPlugin(id: string): Plugin | undefined {
  return PLUGINS.find((p) => p.id === id);
}

export function pluginHref(id: string): string {
  return `/complementos/${id}`;
}

/* ── Estado de activación (localStorage hasta que haya backend) ── */

export const PLUGIN_EVENT = "pluginchange";

export interface PluginChangeDetail {
  id: string;
  active: boolean;
}

export function isPluginActive(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`plugin:${id}`) === "true";
  } catch {
    return false;
  }
}

export function setPluginActive(id: string, active: boolean): void {
  try {
    localStorage.setItem(`plugin:${id}`, String(active));
  } catch {
    // localStorage no disponible: el estado no se recuerda.
  }
  window.dispatchEvent(
    new CustomEvent<PluginChangeDetail>(PLUGIN_EVENT, {
      detail: { id, active },
    }),
  );
}

export function getActivePlugins(): Plugin[] {
  return PLUGINS.filter((p) => isPluginActive(p.id));
}

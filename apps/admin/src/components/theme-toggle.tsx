"use client";

import { useEffect, useState } from "react";
import { getTheme, toggleTheme, type Theme } from "@/lib/theme";

/** Botón para alternar tema; refleja el estado actual (también si cambia por ⌘B). */
export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(getTheme());
    const handler = (e: Event) =>
      setThemeState((e as CustomEvent<Theme>).detail);
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Cambiar tema (⌘B / Ctrl+B)"
      className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted transition hover:bg-foreground/5"
    >
      <span aria-hidden>{theme === "dark" ? "☀︎" : "☾"}</span>
      {theme === "dark" ? "Modo claro" : "Modo oscuro"}
      <span className="ml-auto text-xs text-muted">⌘B</span>
    </button>
  );
}

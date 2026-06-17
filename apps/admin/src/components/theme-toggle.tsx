"use client";

import { useEffect, useState } from "react";
import { getTheme, toggleTheme, type Theme } from "@/lib/theme";

/** Botón para alternar tema. Soporta vista sidebar y popover. */
export function ThemeToggle({
  collapsed = false,
  variant = "sidebar",
}: {
  collapsed?: boolean;
  variant?: "sidebar" | "popover";
}) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(getTheme());
    const handler = (e: Event) =>
      setThemeState((e as CustomEvent<Theme>).detail);
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  const label = theme === "dark" ? "Modo claro" : "Modo oscuro";
  const icon = theme === "dark" ? "☀︎" : "☾";

  if (variant === "popover") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className="sidebar-popover-item"
      >
        <span className="sidebar-icon" aria-hidden>
          {icon}
        </span>
        {label}
        <span className="ml-auto text-xs text-muted">⌘B</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={collapsed ? label : "Cambiar tema (⌘B / Ctrl+B)"}
      className="sidebar-link"
    >
      <span className="sidebar-icon" aria-hidden>
        {icon}
      </span>
      {!collapsed && (
        <>
          <span className="sidebar-label">{label}</span>
          <span className="ml-auto text-xs text-muted">⌘B</span>
        </>
      )}
    </button>
  );
}

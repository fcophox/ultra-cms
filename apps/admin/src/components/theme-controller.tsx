"use client";

import { useEffect } from "react";
import { toggleTheme } from "@/lib/theme";

/**
 * Atajo global de tema: ⌘B (Mac) / Ctrl+B alterna claro ↔ oscuro.
 *
 * No interfiere cuando escribes en un campo o en el editor de texto
 * enriquecido: ahí ⌘B/Ctrl+B sigue siendo "negrita".
 */
export function ThemeController() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "b") return;

      const el = document.activeElement as HTMLElement | null;
      const isEditable =
        !!el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);
      if (isEditable) return; // dejar que funcione "negrita"

      e.preventDefault();
      toggleTheme();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}

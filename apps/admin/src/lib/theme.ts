export type Theme = "light" | "dark";

/** Tema actual según la clase en <html>. */
export function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Aplica un tema, lo persiste y avisa a los componentes interesados. */
export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // localStorage no disponible: el tema simplemente no se recuerda.
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

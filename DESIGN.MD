# DESIGN — Master Control

**Build**

> Fuente de verdad del sistema de diseño.
> Modifica este archivo y los estilos se actualizan en tiempo real.

---

## Tokens

```
---tokens
colors.background.light: "#f0f0f0ff"
colors.background.dark: "#101012"
colors.foreground.light: "#0f172a"
colors.foreground.dark: "#f8fafc"
colors.primary.light: "#3b82f6"
colors.primary.dark: "#60a5fa"
colors.secondary.light: "#8b5cf6"
colors.secondary.dark: "#a78bfa"
colors.accent.light: "#f59e0b"
colors.accent.dark: "#fbbf24"
colors.muted.light: "#9997a9"
colors.muted.dark: "#797886"
colors.surface.light: "#ffffff"
colors.surface.dark: "#181A1E"
colors.border.light: "#e2e8f0"
colors.border.dark: "#303031"
fonts.sans: "Sansation, system-ui, sans-serif"
fonts.mono: "Geist Mono, Fira Code, monospace"
spacing.xs: "0.25rem"
spacing.sm: "0.5rem"
spacing.md: "1rem"
spacing.lg: "1.5rem"
spacing.xl: "2rem"
spacing.2xl: "4rem"
radii.sm: "0.375rem"
radii.md: "0.5rem"
radii.lg: "1rem"
radii.full: "9999px"
breakpoints.sm: "40rem"
breakpoints.md: "48rem"
breakpoints.lg: "64rem"
breakpoints.xl: "80rem"
breakpoints.2xl: "96rem"
shadows.sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
shadows.md: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
shadows.lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
animations.fast: "150ms"
animations.normal: "300ms"
animations.slow: "500ms"
---
```

---

## Colores

| Variable   | Light      | Dark       | Uso              |
|------------|------------|------------|------------------|
| background | `#f8fafc`  | `#020617`  | Fondo página     |
| foreground | `#0f172a`  | `#f8fafc`  | Texto principal  |
| surface    | `#ffffff`  | `#1e293b`  | Tarjetas         |
| border     | `#e2e8f0`  | `#334155`  | Bordes           |
| primary    | `#3b82f6`  | `#60a5fa`  | Acción principal |
| secondary  | `#8b5cf6`  | `#a78bfa`  | Acción secundaria|
| accent     | `#f59e0b`  | `#fbbf24`  | Énfasis          |
| muted      | `#94a3b8`  | `#b0b0b0`  | Texto secundario |

## Tipografía

| Rol   | Font Stack                          |
|-------|-------------------------------------|
| Sans  | `Sansation, system-ui, sans-serif`  |
| Mono  | `Geist Mono, Fira Code, monospace`  |

## Espaciado

| Token | Valor     |
|-------|-----------|
| xs    | `0.25rem` |
| sm    | `0.5rem`  |
| md    | `1rem`    |
| lg    | `1.5rem`  |
| xl    | `2rem`    |
| 2xl   | `4rem`    |

## Radios

| Token | Valor       |
|-------|-------------|
| sm    | `0.375rem`  |
| md    | `0.5rem`    |
| lg    | `1rem`      |
| full  | `9999px`    |

## Sombras

| Token | Valor                                        |
|-------|----------------------------------------------|
| sm    | `0 1px 2px 0 rgb(0 0 0 / 0.05)`             |
| md    | `0 4px 6px -1px rgb(0 0 0 / 0.1)`           |
| lg    | `0 10px 15px -3px rgb(0 0 0 / 0.1)`         |

## Animaciones

| Token  | Valor    |
|--------|----------|
| fast   | `150ms`  |
| normal | `300ms`  |
| slow   | `500ms`  |

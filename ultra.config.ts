/**
 * UltraCMS — configuración white-label por proyecto.
 *
 * Edita este archivo en cada clon para personalizar marca y categorías
 * iniciales. Las categorías también se pueden gestionar desde el panel;
 * esto solo define las sugeridas al hacer seed de un proyecto nuevo.
 */
export interface UltraConfig {
  brand: {
    name: string;
    logoUrl?: string;
    primaryColor: string;
  };
  /** Categorías sugeridas al inicializar el proyecto. */
  defaultCategories: { slug: string; name: string; description?: string }[];
}

export const ultraConfig: UltraConfig = {
  brand: {
    name: "UltraCMS",
    primaryColor: "#4f46e5",
  },
  defaultCategories: [
    { slug: "blog", name: "Blog", description: "Artículos y novedades" },
    { slug: "servicios", name: "Servicios", description: "Servicios ofrecidos" },
    { slug: "casos", name: "Casos", description: "Casos de éxito / portfolio" },
  ],
};

export default ultraConfig;

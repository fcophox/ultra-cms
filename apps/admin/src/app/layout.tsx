import type { Metadata } from "next";
import "./globals.css";
import { ThemeController } from "@/components/theme-controller";

export const metadata: Metadata = {
  title: "UltraCMS",
  description: "Panel de administración UltraCMS",
};

// Aplica el tema guardado (o el del sistema) antes de pintar, sin parpadeo.
const themeInit = `
(function(){try{
  var t = localStorage.getItem('theme');
  if(!t){ t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  if(t === 'dark'){ document.documentElement.classList.add('dark'); }
}catch(e){}})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <ThemeController />
        {children}
      </body>
    </html>
  );
}

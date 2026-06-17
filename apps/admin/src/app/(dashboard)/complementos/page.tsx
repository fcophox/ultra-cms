import { PluginCard } from "@/components/plugin-card";

export const dynamic = "force-dynamic";

export default function ComplementosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Complementos</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PluginCard
          id="calendario"
          name="Calendario"
          description="Gestiona eventos y fechas, y muéstralos en tu sitio. Ideal para agendas, reservas o publicaciones programadas."
        >
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
        </PluginCard>
      </div>
    </div>
  );
}

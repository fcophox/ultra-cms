import { PluginCard } from "@/components/plugin-card";
import { PLUGINS } from "@/lib/plugins";

export const dynamic = "force-dynamic";

export default function ComplementosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Complementos</h1>
      <p className="max-w-2xl text-sm text-muted">
        Módulos especiales que puedes activar. Al activar uno, aparece en el
        menú lateral bajo «Complementos».
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLUGINS.map((plugin) => (
          <PluginCard
            key={plugin.id}
            id={plugin.id}
            name={plugin.name}
            description={plugin.description}
          >
            {plugin.icon}
          </PluginCard>
        ))}
      </div>
    </div>
  );
}

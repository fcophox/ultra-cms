import { notFound } from "next/navigation";
import { getPlugin } from "@/lib/plugins";

export const dynamic = "force-dynamic";

export default async function PluginPage({
  params,
}: {
  params: Promise<{ plugin: string }>;
}) {
  const { plugin } = await params;
  const item = getPlugin(plugin);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {item.icon}
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {item.name} en construcción
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Este complemento está activado pero aún no tiene contenido. Su
          funcionalidad estará disponible aquí próximamente.
        </p>
      </div>
    </div>
  );
}

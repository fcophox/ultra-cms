export const dynamic = "force-dynamic";

export default function ComplementosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Complementos</h1>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 text-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 16.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 20.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 9.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z" />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-foreground">
          Aún no hay complementos
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Los complementos te permitirán extender UltraCMS con nuevas funciones.
          Pronto podrás instalarlos y gestionarlos desde aquí.
        </p>
      </div>
    </div>
  );
}

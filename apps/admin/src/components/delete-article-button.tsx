"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/app/(dashboard)/articles/actions";

export function DeleteArticleButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onDelete() {
    if (!confirm("¿Eliminar este artículo? Esta acción no se puede deshacer."))
      return;
    startTransition(async () => {
      await deleteArticle(id);
      router.push("/articles");
    });
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}

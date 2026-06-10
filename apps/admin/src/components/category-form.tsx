"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveCategory,
  deleteCategory,
  type CategoryInput,
} from "@/app/(dashboard)/categories/actions";
import { slugify } from "@/lib/slug";

interface Props {
  initial?: CategoryInput & { id: string };
}

const field =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const label = "text-sm font-medium text-slate-700";

export function CategoryForm({ initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deleting, startDeleting] = useTransition();

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveCategory({
        id: initial?.id,
        name,
        slug,
        description,
        sort_order: sortOrder,
      });
      if (result?.error) setError(result.error);
    });
  }

  function onDelete() {
    if (!initial?.id) return;
    if (!confirm("¿Eliminar esta categoría?")) return;
    setError(null);
    startDeleting(async () => {
      const result = await deleteCategory(initial.id);
      if (result?.error) setError(result.error);
      else router.push("/categories");
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label className={label}>Nombre</label>
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className={field}
          placeholder="Blog, Servicios, Casos…"
        />
      </div>

      <div className="space-y-1">
        <label className={label}>Slug</label>
        <input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className={field}
          placeholder="blog"
        />
        <p className="text-xs text-slate-400">
          Identificador usado por el frontend: cms.articles.list(&#123; category:
          &quot;{slug || "slug"}&quot; &#125;)
        </p>
      </div>

      <div className="space-y-1">
        <label className={label}>Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={field}
        />
      </div>

      <div className="space-y-1">
        <label className={label}>Orden</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
          className={`${field} max-w-[120px]`}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar"}
        </button>
        {initial?.id && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? "Eliminando…" : "Eliminar"}
          </button>
        )}
      </div>
    </form>
  );
}

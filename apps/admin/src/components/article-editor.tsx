"use client";

import { useState, useTransition } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { saveArticle, type ArticleInput } from "@/app/(dashboard)/articles/actions";
import { slugify } from "@/lib/slug";
import { uploadMedia } from "@/lib/upload";

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  initial?: Partial<ArticleInput> & { id?: string };
}

const field =
  "w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const label = "text-sm font-medium text-foreground";

export function ArticleEditor({ categories, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? "");
  const [locale, setLocale] = useState<ArticleInput["locale"]>(
    initial?.locale ?? "es",
  );
  const [translationGroup, setTranslationGroup] = useState(
    initial?.translation_group ?? "",
  );
  const [dataText, setDataText] = useState(
    initial?.data ? JSON.stringify(initial.data, null, 2) : "",
  );
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [status, setStatus] = useState<ArticleInput["status"]>(
    initial?.status ?? "draft",
  );
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initial?.seo_description ?? "",
  );
  const [body, setBody] = useState<{ json: unknown; html: string }>({
    json: initial?.content ?? null,
    html: initial?.content_html ?? "",
  });

  const [error, setError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [pending, startTransition] = useTransition();

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      setCoverUrl(await uploadMedia(file));
    } catch (err) {
      setError("Error al subir la portada: " + (err as Error).message);
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let data: unknown = null;
    if (dataText.trim()) {
      try {
        data = JSON.parse(dataText);
      } catch {
        setError("El campo «Datos estructurados» no es JSON válido.");
        return;
      }
    }

    startTransition(async () => {
      const result = await saveArticle({
        id: initial?.id,
        category_id: categoryId,
        title,
        slug,
        locale,
        translation_group: translationGroup,
        excerpt,
        content: body.json,
        content_html: body.html,
        data,
        cover_image_url: coverUrl,
        status,
        seo_title: seoTitle,
        seo_description: seoDescription,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-3 gap-6">
      {/* Columna principal */}
      <div className="col-span-2 space-y-4">
        <div className="space-y-1">
          <label className={label}>Título</label>
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={`${field} text-lg font-semibold`}
            placeholder="Título del artículo"
          />
        </div>

        <div className="space-y-1">
          <label className={label}>Contenido</label>
          <RichTextEditor initialContent={body.json} onChange={setBody} />
        </div>
      </div>

      {/* Barra lateral */}
      <aside className="space-y-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>

        <div className="space-y-1">
          <label className={label}>Estado</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as ArticleInput["status"])
            }
            className={field}
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className={label}>Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={field}
          >
            <option value="">— Selecciona —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className={label}>Idioma</label>
          <select
            value={locale}
            onChange={(e) =>
              setLocale(e.target.value as ArticleInput["locale"])
            }
            className={field}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
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
            placeholder="mi-articulo"
          />
        </div>

        <div className="space-y-1">
          <label className={label}>Extracto</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className={field}
            placeholder="Resumen corto…"
          />
        </div>

        <div className="space-y-1">
          <label className={label}>Imagen de portada</label>
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt="portada"
              className="mb-2 h-32 w-full rounded-lg object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onCoverChange}
            className="text-sm"
          />
          {uploadingCover && (
            <p className="text-xs text-muted">Subiendo…</p>
          )}
        </div>

        <details className="space-y-1">
          <summary className={`${label} cursor-pointer`}>SEO</summary>
          <div className="mt-2 space-y-3">
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className={field}
              placeholder="SEO título"
            />
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              className={field}
              placeholder="SEO descripción"
            />
          </div>
        </details>

        <details className="space-y-1">
          <summary className={`${label} cursor-pointer`}>
            Avanzado (traducción / datos)
          </summary>
          <div className="mt-2 space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-muted">
                Grupo de traducción (UUID) — pega el de la versión en otro
                idioma para enlazarlas; déjalo vacío para crear uno nuevo.
              </label>
              <input
                value={translationGroup}
                onChange={(e) => setTranslationGroup(e.target.value)}
                className={field}
                placeholder="auto"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted">
                Datos estructurados (JSON) — para servicios u otro contenido
                con campos propios.
              </label>
              <textarea
                value={dataText}
                onChange={(e) => setDataText(e.target.value)}
                rows={8}
                className={`${field} font-mono text-xs`}
                placeholder='{ "plans": [], "process": [] }'
              />
            </div>
          </div>
        </details>
      </aside>
    </form>
  );
}

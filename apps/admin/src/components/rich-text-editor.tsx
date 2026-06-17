"use client";

import { useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { uploadMedia } from "@/lib/upload";

interface Props {
  /** Contenido inicial en JSON de TipTap. */
  initialContent?: unknown;
  /** Notifica cambios con el JSON y el HTML renderizado. */
  onChange: (content: { json: unknown; html: string }) => void;
}

export function RichTextEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: (initialContent as object) ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate dark:prose-invert max-w-none min-h-[320px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange({ json: editor.getJSON(), html: editor.getHTML() });
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[380px] animate-pulse rounded-lg border border-border bg-foreground/[0.03]" />
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadMedia(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert("Error al subir la imagen: " + (err as Error).message);
    } finally {
      e.target.value = "";
    }
  }

  function setLink() {
    const url = window.prompt("URL del enlace:");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  const btn = (active: boolean) =>
    `rounded px-2 py-1 text-sm font-medium transition ${
      active ? "bg-primary text-white" : "text-muted hover:bg-foreground/5"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={btn(editor.isActive("heading", { level: 2 }))}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={btn(editor.isActive("heading", { level: 3 }))}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive("bulletList"))}
      >
        • Lista
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive("orderedList"))}
      >
        1. Lista
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive("blockquote"))}
      >
        ❝ Cita
      </button>
      <button type="button" onClick={setLink} className={btn(editor.isActive("link"))}>
        🔗 Enlace
      </button>
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        className={btn(false)}
      >
        🖼 Imagen
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImage}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateContactStatus,
  deleteContact,
  type ContactStatus,
} from "@/app/(dashboard)/contacts/actions";

interface Props {
  id: string;
  status: ContactStatus;
}

const STATUS_LABELS: Record<ContactStatus, string> = {
  new: "Nuevo",
  read: "Leído",
  archived: "Archivado",
};

export function ContactStatusControls({ id, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const autoMarked = useRef(false);

  // Al abrir un contacto "nuevo", marcarlo automáticamente como leído.
  useEffect(() => {
    if (status === "new" && !autoMarked.current) {
      autoMarked.current = true;
      updateContactStatus(id, "read").then(() => router.refresh());
    }
  }, [id, status, router]);

  function setStatus(next: ContactStatus) {
    startTransition(async () => {
      await updateContactStatus(id, next);
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm("¿Eliminar este contacto?")) return;
    startTransition(async () => {
      await deleteContact(id);
    });
  }

  const chip = (s: ContactStatus) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${
      status === s
        ? "bg-primary text-white"
        : "border border-border text-muted hover:bg-foreground/5"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(["new", "read", "archived"] as ContactStatus[]).map((s) => (
        <button
          key={s}
          type="button"
          disabled={pending}
          onClick={() => setStatus(s)}
          className={chip(s)}
        >
          {STATUS_LABELS[s]}
        </button>
      ))}
      <button
        type="button"
        disabled={pending}
        onClick={onDelete}
        className="ml-auto rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
      >
        Eliminar
      </button>
    </div>
  );
}

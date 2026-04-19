"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  readAuthToken,
  readAuthUser,
} from "@/features/auth/lib/authSession";
import { validateNoteDraft } from "../lib/noteValidators";
import { MOCK_NOTES } from "../lib/mockNotes";
import type { NoteDraft, NoteDraftErrors, NoteUiItem } from "../lib/notesTypes";
import NotesFormPanel from "./NotesFormPanel";
import NotesListPanel from "./NotesListPanel";
import styles from "../styles/notes.module.css";

const EMPTY_DRAFT: NoteDraft = {
  title: "",
  content: "",
  noteDate: "",
};

function buildNoteDraft(note: NoteUiItem): NoteDraft {
  return {
    title: note.title,
    content: note.content,
    noteDate: note.noteDate,
  };
}

export default function NotesWorkspace() {
  const router = useRouter();
  const [notes, setNotes] = useState<NoteUiItem[]>(MOCK_NOTES);
  const [filterDate, setFilterDate] = useState("");
  const [draft, setDraft] = useState<NoteDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<NoteDraftErrors>({});
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);

  const user = readAuthUser();

  useEffect(() => {
    const token = readAuthToken();

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const filteredNotes = useMemo(() => {
    const sortedNotes = [...notes].sort((a, b) =>
      a.noteDate < b.noteDate ? 1 : a.noteDate > b.noteDate ? -1 : 0
    );

    if (!filterDate) {
      return sortedNotes;
    }

    return sortedNotes.filter((note) => note.noteDate === filterDate);
  }, [notes, filterDate]);

  function onLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  function onFieldChange(field: keyof NoteDraft, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function onResetForm() {
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setMode("create");
    setEditingId(null);
  }

  function onEdit(note: NoteUiItem) {
    setMode("edit");
    setEditingId(note.id);
    setDraft(buildNoteDraft(note));
    setErrors({});
  }

  function onDelete(noteId: number) {
    setNotes((prev) => prev.filter((item) => item.id !== noteId));

    if (editingId === noteId) {
      onResetForm();
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateNoteDraft(draft);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    if (mode === "edit" && editingId) {
      setNotes((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...draft,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );

      onResetForm();
      return;
    }

    const nowIso = new Date().toISOString();

    setNotes((prev) => [
      {
        id: Date.now(),
        ...draft,
        createdAt: nowIso,
        updatedAt: nowIso,
      },
      ...prev,
    ]);

    onResetForm();
  }

  return (
    <main className={styles.notesPage}>
      <section className={styles.workspace}>
        <header className={styles.topCard}>
          <div>
            <h1 className={styles.topTitle}>Notes Workspace</h1>
            <p className={styles.topCopy}>
              UI simulasi CRUD Notes: create, edit, delete, dan filter tanggal sudah aktif
              di sisi klien.
            </p>
            <span className={styles.topMeta}>
              Pengguna aktif: {user?.name || "-"} ({user?.email || "-"})
            </span>
          </div>

          <div className={styles.topActions}>
            <Link href="/" className={styles.ghostButton}>
              Landing
            </Link>
            <button type="button" className={styles.dangerButton} onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className={styles.grid}>
          <NotesFormPanel
            mode={mode}
            draft={draft}
            errors={errors}
            onFieldChange={onFieldChange}
            onSubmit={onSubmit}
            onReset={onResetForm}
          />

          <NotesListPanel
            notes={filteredNotes}
            filterDate={filterDate}
            onFilterDateChange={setFilterDate}
            onResetFilter={() => setFilterDate("")}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </section>
      </section>
    </main>
  );
}

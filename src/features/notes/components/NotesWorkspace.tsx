"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  clearAuthSession,
  readAuthToken,
  readAuthUser,
} from "@/features/auth/lib/authSession";
import {
  createNoteWithApi,
  deleteNoteWithApi,
  fetchNotesWithApi,
  updateNoteWithApi,
} from "../lib/notesApi";
import { validateNoteDraft } from "../lib/noteValidators";
import type { NoteDraft, NoteDraftErrors, NoteUiItem } from "../lib/notesTypes";
import NotesFormPanel from "./NotesFormPanel";
import NotesListPanel from "./NotesListPanel";
import styles from "../styles/notes.module.css";

const EMPTY_DRAFT: NoteDraft = {
  title: "",
  content: "",
  noteDate: "",
};

const PAGE_LIMIT = 5;

type FormStatus = {
  variant: "success" | "error";
  message: string;
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
  const token = readAuthToken();
  const user = readAuthUser();

  const [notes, setNotes] = useState<NoteUiItem[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [draft, setDraft] = useState<NoteDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<NoteDraftErrors>({});
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  const [status, setStatus] = useState<FormStatus | null>(null);

  const loadNotes = useCallback(
    async (targetPage: number, targetDate: string, keepStatus: boolean) => {
      if (!token) {
        return;
      }

      setIsLoading(true);

      try {
        const result = await fetchNotesWithApi({
          token,
          page: targetPage,
          limit: PAGE_LIMIT,
          ...(targetDate ? { date: targetDate } : {}),
        });

        setNotes(result.items);
        setTotalItems(result.pagination.total);
        setTotalPages(result.pagination.totalPages);

        if (!keepStatus) {
          setStatus(null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Gagal memuat data catatan";

        setStatus({
          variant: "error",
          message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    void loadNotes(page, filterDate, false);
  }, [token, router, page, filterDate, loadNotes]);

  function onLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  function onFieldChange(field: keyof NoteDraft, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setStatus(null);
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
    setStatus(null);
  }

  async function onDelete(noteId: number) {
    if (!token) {
      router.replace("/login");
      return;
    }

    setDeletingNoteId(noteId);

    try {
      await deleteNoteWithApi({
        token,
        noteId,
      });

      if (editingId === noteId) {
        onResetForm();
      }

      const nextPage = notes.length === 1 && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      }

      await loadNotes(nextPage, filterDate, true);

      setStatus({
        variant: "success",
        message: "Catatan berhasil dihapus",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menghapus catatan";

      setStatus({
        variant: "error",
        message,
      });
    } finally {
      setDeletingNoteId(null);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateNoteDraft(draft);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "edit" && editingId) {
        await updateNoteWithApi({
          token,
          noteId: editingId,
          draft,
        });

        await loadNotes(page, filterDate, true);

        setStatus({
          variant: "success",
          message: "Catatan berhasil diperbarui",
        });

        onResetForm();
        return;
      }

      await createNoteWithApi({
        token,
        draft,
      });

      const targetPage = 1;

      if (page !== targetPage) {
        setPage(targetPage);
      }

      await loadNotes(targetPage, filterDate, true);

      setStatus({
        variant: "success",
        message: "Catatan berhasil ditambahkan",
      });

      onResetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyimpan catatan";

      setStatus({
        variant: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function onFilterDateChange(value: string) {
    setFilterDate(value);
    setPage(1);
  }

  function onResetFilter() {
    setFilterDate("");
    setPage(1);
  }

  function onPrevPage() {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  }

  function onNextPage() {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }


  return (
    <main className={styles.notesPage}>
      <section className={styles.workspace}>
        <header className={styles.topCard}>
          <div>
            <h1 className={styles.topTitle}>Notes Workspace</h1>
            <p className={styles.topCopy}>
              Workspace ini sudah terhubung ke backend untuk alur CRUD notes, filter
              tanggal, dan pagination data.
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
            isSubmitting={isSubmitting}
            status={status}
            onFieldChange={onFieldChange}
            onSubmit={onSubmit}
            onReset={onResetForm}
          />

          <NotesListPanel
            notes={notes}
            filterDate={filterDate}
            onFilterDateChange={onFilterDateChange}
            onResetFilter={onResetFilter}
            onEdit={onEdit}
            onDelete={onDelete}
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            isLoading={isLoading}
            isMutating={isSubmitting || deletingNoteId !== null}
            deletingNoteId={deletingNoteId}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
          />
        </section>
      </section>
    </main>
  );
}

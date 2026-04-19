import NoteCard from "./NoteCard";
import styles from "../styles/notes.module.css";
import type { NoteUiItem } from "../lib/notesTypes";

type NotesListPanelProps = {
  notes: NoteUiItem[];
  filterDate: string;
  onFilterDateChange: (value: string) => void;
  onResetFilter: () => void;
  onEdit: (note: NoteUiItem) => void;
  onDelete: (noteId: number) => void;
  page: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  isMutating: boolean;
  deletingNoteId: number | null;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export default function NotesListPanel({
  notes,
  filterDate,
  onFilterDateChange,
  onResetFilter,
  onEdit,
  onDelete,
  page,
  totalPages,
  totalItems,
  isLoading,
  isMutating,
  deletingNoteId,
  onPrevPage,
  onNextPage,
}: NotesListPanelProps) {
  return (
    <section className={styles.listCard}>
      <h2 className={styles.cardTitle}>Daftar Catatan</h2>
      <p className={styles.cardSubcopy}>
        Data catatan dibaca dari backend dengan filter tanggal dan pagination.
      </p>

      <div className={styles.filterBar}>
        <input
          type="date"
          value={filterDate}
          onChange={(event) => onFilterDateChange(event.target.value)}
          className={styles.filterInput}
          disabled={isLoading || isMutating}
        />
        <button
          type="button"
          className={styles.ghostButton}
          onClick={onResetFilter}
          disabled={isLoading || isMutating}
        >
          Reset Filter
        </button>
      </div>

      <div className={styles.noteList}>
        {isLoading ? (
          <div className={styles.loadingState}>Memuat daftar catatan...</div>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
              isBusy={isMutating}
              isDeleting={deletingNoteId === note.id}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            Tidak ada catatan untuk tanggal/filter saat ini.
          </div>
        )}
      </div>

      <footer className={styles.paginationRow}>
        <span className={styles.paginationMeta}>
          Halaman {page} dari {totalPages} | Total {totalItems} catatan
        </span>

        <div className={styles.paginationActions}>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={onPrevPage}
            disabled={isLoading || isMutating || page <= 1}
          >
            Prev
          </button>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={onNextPage}
            disabled={isLoading || isMutating || page >= totalPages}
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}

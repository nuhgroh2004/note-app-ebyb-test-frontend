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
};

export default function NotesListPanel({
  notes,
  filterDate,
  onFilterDateChange,
  onResetFilter,
  onEdit,
  onDelete,
}: NotesListPanelProps) {
  return (
    <section className={styles.listCard}>
      <h2 className={styles.cardTitle}>Daftar Catatan</h2>
      <p className={styles.cardSubcopy}>
        Tersedia filter berdasarkan tanggal untuk simulasi alur list notes.
      </p>

      <div className={styles.filterBar}>
        <input
          type="date"
          value={filterDate}
          onChange={(event) => onFilterDateChange(event.target.value)}
          className={styles.filterInput}
        />
        <button type="button" className={styles.ghostButton} onClick={onResetFilter}>
          Reset Filter
        </button>
      </div>

      <div className={styles.noteList}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
          ))
        ) : (
          <div className={styles.emptyState}>
            Tidak ada catatan untuk tanggal/filter saat ini.
          </div>
        )}
      </div>
    </section>
  );
}

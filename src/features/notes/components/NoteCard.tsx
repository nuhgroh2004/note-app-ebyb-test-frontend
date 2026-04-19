import styles from "../styles/notes.module.css";
import type { NoteUiItem } from "../lib/notesTypes";

type NoteCardProps = {
  note: NoteUiItem;
  onEdit: (note: NoteUiItem) => void;
  onDelete: (noteId: number) => void;
};

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <article className={styles.noteCard}>
      <header className={styles.noteTitleRow}>
        <h3 className={styles.noteTitle}>{note.title}</h3>
        <span className={styles.noteDate}>{note.noteDate}</span>
      </header>

      <p className={styles.noteContent}>{note.content}</p>

      <div className={styles.noteActions}>
        <button type="button" className={styles.ghostButton} onClick={() => onEdit(note)}>
          Edit
        </button>
        <button type="button" className={styles.dangerButton} onClick={() => onDelete(note.id)}>
          Hapus
        </button>
      </div>
    </article>
  );
}

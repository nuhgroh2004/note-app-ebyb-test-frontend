import styles from "../styles/notes.module.css";
import type { NoteDraft, NoteDraftErrors } from "../lib/notesTypes";

type NotesFormPanelProps = {
  mode: "create" | "edit";
  draft: NoteDraft;
  errors: NoteDraftErrors;
  onFieldChange: (field: keyof NoteDraft, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

export default function NotesFormPanel({
  mode,
  draft,
  errors,
  onFieldChange,
  onSubmit,
  onReset,
}: NotesFormPanelProps) {
  return (
    <section className={styles.formCard}>
      <h2 className={styles.cardTitle}>
        {mode === "edit" ? "Edit Catatan" : "Tambah Catatan"}
      </h2>
      <p className={styles.cardSubcopy}>
        Mode UI-only. Data yang Anda ubah hanya tersimpan pada state lokal browser.
      </p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="title">Judul</label>
          <input
            id="title"
            type="text"
            value={draft.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            placeholder="Contoh: Rencana meeting"
          />
          <span className={styles.errorText}>{errors.title || ""}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="content">Konten</label>
          <textarea
            id="content"
            value={draft.content}
            onChange={(event) => onFieldChange("content", event.target.value)}
            placeholder="Tulis isi catatan..."
          />
          <span className={styles.errorText}>{errors.content || ""}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="noteDate">Tanggal Catatan</label>
          <input
            id="noteDate"
            type="date"
            value={draft.noteDate}
            onChange={(event) => onFieldChange("noteDate", event.target.value)}
          />
          <span className={styles.errorText}>{errors.noteDate || ""}</span>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.primaryButton}>
            {mode === "edit" ? "Simpan Perubahan" : "Tambah Catatan"}
          </button>
          <button type="button" className={styles.ghostButton} onClick={onReset}>
            Reset Form
          </button>
        </div>
      </form>
    </section>
  );
}

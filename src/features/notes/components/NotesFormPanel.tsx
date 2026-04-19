import styles from "../styles/notes.module.css";
import type { NoteDraft, NoteDraftErrors } from "../lib/notesTypes";

type NotesFormPanelProps = {
  mode: "create" | "edit";
  draft: NoteDraft;
  errors: NoteDraftErrors;
  isSubmitting: boolean;
  status: {
    variant: "success" | "error";
    message: string;
  } | null;
  onFieldChange: (field: keyof NoteDraft, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

export default function NotesFormPanel({
  mode,
  draft,
  errors,
  isSubmitting,
  status,
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
        Form ini terhubung ke backend API notes menggunakan token login aktif.
      </p>

      {status ? (
        <p
          className={`${styles.statusInfo} ${
            status.variant === "success" ? styles.statusSuccess : styles.statusError
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="title">Judul</label>
          <input
            id="title"
            type="text"
            value={draft.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            placeholder="Contoh: Rencana meeting"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          <span className={styles.errorText}>{errors.noteDate || ""}</span>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
            {isSubmitting
              ? "Memproses..."
              : mode === "edit"
                ? "Simpan Perubahan"
                : "Tambah Catatan"}
          </button>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={onReset}
            disabled={isSubmitting}
          >
            Reset Form
          </button>
        </div>
      </form>
    </section>
  );
}

import NotesIcon from "./NotesIcon";
import styles from "../styles/notes.module.css";

type NotesTopBarProps = {
  pageTitle: string;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  onSaveNote: () => void;
  isNoteDirty: boolean;
  isSavingNote: boolean;
  isLoadingNote: boolean;
  saveErrorMessage: string;
};

export default function NotesTopBar({
  pageTitle,
  onToggleLeftPanel,
  onToggleRightPanel,
  onSaveNote,
  isNoteDirty,
  isSavingNote,
  isLoadingNote,
  saveErrorMessage,
}: NotesTopBarProps) {
  const saveStatusText = isLoadingNote
    ? "Memuat dokumen..."
    : isSavingNote
      ? "Menyimpan..."
      : isNoteDirty
        ? "Perubahan belum disimpan"
        : "Semua perubahan tersimpan";

  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={`${styles.panelToggleButton} ${styles.mobileOnly}`}
        aria-label="Open sidebar"
        onClick={onToggleLeftPanel}
      >
        <NotesIcon name="list" className={styles.icon14} />
      </button>

      <p className={styles.topTitle}>{pageTitle}</p>

      <div className={styles.topRight}>
        <p
          className={`${styles.saveStatus} ${
            saveErrorMessage ? styles.saveStatusError : ""
          }`}
          title={saveErrorMessage || saveStatusText}
        >
          {saveErrorMessage || saveStatusText}
        </p>

        <button
          type="button"
          className={`${styles.saveButton} ${isNoteDirty ? styles.saveButtonDirty : ""}`}
          disabled={isSavingNote || isLoadingNote}
          onClick={onSaveNote}
        >
          {isSavingNote ? "Saving..." : "Save"}
        </button>

        <div className={styles.avatarButton}>N</div>

        <button type="button" className={styles.shareButton}>
          <NotesIcon name="share" className={styles.icon13} />
          <span>Share</span>
        </button>

        <button
          type="button"
          className={`${styles.panelToggleButton} ${styles.mobileOnly}`}
          aria-label="Open insert panel"
          onClick={onToggleRightPanel}
        >
          <NotesIcon name="chevron-right" className={styles.icon14} />
        </button>
      </div>
    </header>
  );
}

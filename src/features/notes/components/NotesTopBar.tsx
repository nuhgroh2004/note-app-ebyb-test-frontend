import NotesIcon from "./NotesIcon";
import styles from "../styles/notes.module.css";

type NotesTopBarProps = {
  pageTitle: string;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
};

export default function NotesTopBar({
  pageTitle,
  onToggleLeftPanel,
  onToggleRightPanel,
}: NotesTopBarProps) {
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

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
        className={`${styles.iconButton} ${styles.mobileOnly}`}
        aria-label="Open sidebar"
        onClick={onToggleLeftPanel}
      >
        <NotesIcon name="list" className={styles.icon14} />
      </button>

      <div className={styles.topLogo}>
        <NotesIcon name="grid" className={styles.icon14White} />
      </div>

      <button type="button" className={styles.iconButton} aria-label="Toggle board view">
        <NotesIcon name="grid" className={styles.icon14} />
      </button>

      <p className={styles.topTitle}>{pageTitle}</p>

      <div className={styles.topRight}>
        <div className={styles.avatarButton}>N</div>

        <button type="button" className={styles.shareButton}>
          <NotesIcon name="share" className={styles.icon13} />
          <span>Share</span>
        </button>

        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <NotesIcon name="bell" className={styles.icon14} />
        </button>

        <button type="button" className={styles.iconButton} aria-label="Page info">
          <NotesIcon name="info" className={styles.icon14} />
        </button>

        <button
          type="button"
          className={`${styles.iconButton} ${styles.mobileOnly}`}
          aria-label="Open insert panel"
          onClick={onToggleRightPanel}
        >
          <NotesIcon name="chevron-right" className={styles.icon14} />
        </button>
      </div>
    </header>
  );
}

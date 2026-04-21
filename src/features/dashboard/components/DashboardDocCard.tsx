import DashboardIcon from "./DashboardIcons";
import type { DashboardDocItem } from "./dashboardData";
import styles from "../styles/dashboard.module.css";

type DashboardDocCardProps = {
  doc: DashboardDocItem;
  isMenuOpen: boolean;
  onToggleMenu: (docId: number) => void;
  onCloseMenu: () => void;
  onOpenInNewTab: (doc: DashboardDocItem) => void;
  onToggleStar: (docId: number) => void;
  onDuplicate: (docId: number) => void;
  onDelete: (docId: number) => void;
};

export default function DashboardDocCard({
  doc,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpenInNewTab,
  onToggleStar,
  onDuplicate,
  onDelete,
}: DashboardDocCardProps) {
  return (
    <article
      className={styles.docCard}
      onClick={onCloseMenu}
      onDoubleClick={() => {
        onCloseMenu();
        onOpenInNewTab(doc);
      }}
    >
      <div className={styles.docCardBody} />

      <div className={styles.docCardFooter}>
        <p className={styles.docCardTitle}>{doc.title}</p>
        <div className={styles.docCardTags}>
          {doc.isStarred ? <span className={`${styles.docTag} ${styles.docTagStarred}`}>Starred</span> : null}
          <span className={`${styles.docTag} ${styles.docTagLocation}`}>{doc.location}</span>
        </div>
        <p className={styles.docCardDate}>{doc.date}</p>
      </div>

      <button
        type="button"
        className={`${styles.cardMenuButton} ${isMenuOpen ? styles.cardMenuButtonActive : ""}`}
        aria-label={`Actions for ${doc.title}`}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={(event) => {
          event.stopPropagation();
          onToggleMenu(doc.id);
        }}
        onDoubleClick={(event) => {
          event.stopPropagation();
        }}
      >
        <DashboardIcon name="more-vertical" className={styles.navIcon} />
      </button>

      <div
        role="menu"
        className={`${styles.contextMenu} ${isMenuOpen ? styles.contextMenuShow : ""}`}
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          role="menuitem"
          className={styles.menuItem}
          onClick={() => {
            onCloseMenu();
            onOpenInNewTab(doc);
          }}
        >
          Open in New Tab
        </button>
        <span className={styles.menuDivider} />
        <button
          type="button"
          role="menuitem"
          className={styles.menuItem}
          onClick={() => {
            onCloseMenu();
            onToggleStar(doc.id);
          }}
        >
          {doc.isStarred ? "Unstar" : "Star"}
        </button>
        <button
          type="button"
          role="menuitem"
          className={styles.menuItem}
          onClick={() => {
            onCloseMenu();
            onDuplicate(doc.id);
          }}
        >
          Duplicate
        </button>
        <span className={styles.menuDivider} />
        <button
          type="button"
          role="menuitem"
          className={`${styles.menuItem} ${styles.menuItemDanger}`}
          onClick={() => {
            onCloseMenu();
            onDelete(doc.id);
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
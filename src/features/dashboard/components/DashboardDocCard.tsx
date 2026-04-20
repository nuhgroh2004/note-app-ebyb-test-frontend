import DashboardIcon from "./DashboardIcons";
import type { DashboardDocItem } from "./dashboardData";
import styles from "../styles/dashboard.module.css";

type DashboardDocCardProps = {
  doc: DashboardDocItem;
  isMenuOpen: boolean;
  onToggleMenu: (docId: number) => void;
  onCloseMenu: () => void;
};

const MENU_SECONDARY_ITEMS = ["Star", "Duplicate", "Move to"];

export default function DashboardDocCard({
  doc,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
}: DashboardDocCardProps) {
  return (
    <article className={styles.docCard} onClick={onCloseMenu}>
      <div className={styles.docCardBody} />

      <div className={styles.docCardFooter}>
        <p className={styles.docCardTitle}>{doc.title}</p>
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
      >
        <DashboardIcon name="more-vertical" className={styles.navIcon} />
      </button>

      <div
        role="menu"
        className={`${styles.contextMenu} ${isMenuOpen ? styles.contextMenuShow : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" role="menuitem" className={styles.menuItem}>
          Open in New Tab
        </button>
        <span className={styles.menuDivider} />
        {MENU_SECONDARY_ITEMS.map((item) => (
          <button key={item} type="button" role="menuitem" className={styles.menuItem}>
            {item}
          </button>
        ))}
        <span className={styles.menuDivider} />
        <button type="button" role="menuitem" className={`${styles.menuItem} ${styles.menuItemDanger}`}>
          Delete
        </button>
      </div>
    </article>
  );
}
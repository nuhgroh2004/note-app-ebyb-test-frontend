import DashboardDocCard from "./DashboardDocCard";
import type { DashboardDocItem } from "./dashboardData";
import styles from "../styles/dashboard.module.css";

type DashboardDocsSectionProps = {
  docs: DashboardDocItem[];
  openMenuDocId: number | null;
  onToggleDocMenu: (docId: number) => void;
  onCloseDocMenus: () => void;
};

export default function DashboardDocsSection({
  docs,
  openMenuDocId,
  onToggleDocMenu,
  onCloseDocMenus,
}: DashboardDocsSectionProps) {
  return (
    <section className={styles.content}>
      <h1 className={styles.pageTitle}>All Docs</h1>

      {docs.length > 0 ? (
        <div className={styles.docGrid}>
          {docs.map((doc) => (
            <DashboardDocCard
              key={doc.id}
              doc={doc}
              isMenuOpen={openMenuDocId === doc.id}
              onToggleMenu={onToggleDocMenu}
              onCloseMenu={onCloseDocMenus}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>No documents match your current search or filter.</p>
      )}
    </section>
  );
}
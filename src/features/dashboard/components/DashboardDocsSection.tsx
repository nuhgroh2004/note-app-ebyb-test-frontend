import DashboardDocCard from "./DashboardDocCard";
import type { DashboardDocItem } from "./dashboardData";
import styles from "../styles/dashboard.module.css";

type DashboardDocsSectionProps = {
  docs: DashboardDocItem[];
  isLoading: boolean;
  errorMessage: string;
  openMenuDocId: number | null;
  onToggleDocMenu: (docId: number) => void;
  onCloseDocMenus: () => void;
  onOpenInNewTab: (doc: DashboardDocItem) => void;
  onToggleStar: (docId: number) => void;
  onDuplicate: (docId: number) => void;
  onDelete: (docId: number) => void;
};

export default function DashboardDocsSection({
  docs,
  isLoading,
  errorMessage,
  openMenuDocId,
  onToggleDocMenu,
  onCloseDocMenus,
  onOpenInNewTab,
  onToggleStar,
  onDuplicate,
  onDelete,
}: DashboardDocsSectionProps) {
  if (isLoading) {
    return (
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>All Docs</h1>
        <p className={styles.emptyState}>Memuat dokumen...</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className={styles.content}>
        <h1 className={styles.pageTitle}>All Docs</h1>
        <p className={styles.emptyState}>{errorMessage}</p>
      </section>
    );
  }

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
              onOpenInNewTab={onOpenInNewTab}
              onToggleStar={onToggleStar}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>No documents match your current search or filter.</p>
      )}
    </section>
  );
}
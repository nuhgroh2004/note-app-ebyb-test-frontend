import NotesIcon from "./NotesIcon";
import type { NotesToolItem } from "../lib/notesEditorTypes";
import styles from "../styles/notes.module.css";

type NotesLeftPanelProps = {
  activeToolId: string;
  tools: NotesToolItem[];
  isOpenOnMobile: boolean;
  onSetTool: (toolId: string) => void;
};

export default function NotesLeftPanel({
  activeToolId,
  tools,
  isOpenOnMobile,
  onSetTool,
}: NotesLeftPanelProps) {
  return (
    <aside className={`${styles.leftPanel} ${isOpenOnMobile ? styles.leftPanelOpen : ""}`}>
      <div className={styles.leftTop}>
        <p className={styles.leftTopLabel}>Just Now</p>
      </div>

      <div className={styles.leftTools}>
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            aria-label={tool.label}
            className={`${styles.toolButton} ${activeToolId === tool.id ? styles.toolButtonActive : ""}`}
            onClick={() => onSetTool(tool.id)}
          >
            <NotesIcon name={tool.icon} className={styles.icon14} />
          </button>
        ))}
      </div>

      <div className={styles.tocSection}>
        <p className={styles.tocTitle}>Table of Contents</p>
        <p className={styles.tocHint}>Use titles, pages, or cards to create a table of contents.</p>
      </div>
    </aside>
  );
}

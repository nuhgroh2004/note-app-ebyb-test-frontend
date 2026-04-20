import type { RefCallback } from "react";
import styles from "../styles/notes.module.css";

type NotesEditorCanvasProps = {
  title: string;
  pageIds: string[];
  activePageId: string;
  getEditorRef: (pageId: string) => RefCallback<HTMLDivElement>;
  cardTone: "default" | "mint";
  isCompactSpacing: boolean;
  isTitleExpanded: boolean;
  onTitleChange: (nextTitle: string) => void;
  onEditorInput: (pageId: string) => void;
  onSelectionChange: (pageId: string) => void;
  onPageActivate: (pageId: string) => void;
};

export default function NotesEditorCanvas({
  title,
  pageIds,
  activePageId,
  getEditorRef,
  cardTone,
  isCompactSpacing,
  isTitleExpanded,
  onTitleChange,
  onEditorInput,
  onSelectionChange,
  onPageActivate,
}: NotesEditorCanvasProps) {
  return (
    <div className={styles.editorBody}>
      <div className={styles.pageStack}>
        {pageIds.map((pageId, index) => (
          <article
            key={pageId}
            className={`${styles.pageCard} ${
              cardTone === "mint" ? styles.pageCardMint : ""
            } ${activePageId === pageId ? styles.pageCardActive : ""}`}
          >
            <button type="button" className={styles.dotsButton} aria-label="Page menu">
              <span>...</span>
            </button>

            {index === 0 ? (
              <>
                <input
                  className={`${styles.pageTitleInput} ${isTitleExpanded ? styles.pageTitleInputExpanded : ""}`}
                  placeholder="Page Title"
                  value={title}
                  onChange={(event) => onTitleChange(event.target.value)}
                />

                <div className={styles.pageDivider} />
              </>
            ) : (
              <div className={styles.pageMetaRow}>
                <span className={styles.pageBadge}>{`Canvas ${index + 1}`}</span>
              </div>
            )}

            <section
              ref={getEditorRef(pageId)}
              className={`${styles.pageContentEditable} ${isCompactSpacing ? styles.pageContentCompact : ""}`}
              contentEditable
              suppressContentEditableWarning
              spellCheck
              role="textbox"
              aria-multiline="true"
              data-placeholder={
                index === 0
                  ? "Type here like Word, or use the right panel to insert elements..."
                  : "Type in this canvas..."
              }
              onInput={() => onEditorInput(pageId)}
              onKeyUp={() => onSelectionChange(pageId)}
              onMouseUp={() => onSelectionChange(pageId)}
              onFocus={() => onSelectionChange(pageId)}
              onClick={() => onPageActivate(pageId)}
              onMouseDown={() => onPageActivate(pageId)}
            />
          </article>
        ))}
      </div>
    </div>
  );
}

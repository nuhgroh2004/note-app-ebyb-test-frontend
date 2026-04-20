import { useEffect, useState, type RefCallback } from "react";
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
  onDeletePage: (pageId: string) => void;
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
  onDeletePage,
}: NotesEditorCanvasProps) {
  const [openPageMenuId, setOpenPageMenuId] = useState<string | null>(null);

  useEffect(() => {
    const closeMenu = () => setOpenPageMenuId(null);
    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

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
            <button
              type="button"
              className={`${styles.dotsButton} ${openPageMenuId === pageId ? styles.dotsButtonOpen : ""}`}
              aria-label="Page menu"
              onClick={(event) => {
                event.stopPropagation();
                setOpenPageMenuId((current) => (current === pageId ? null : pageId));
              }}
            >
              <span>...</span>
            </button>

            {openPageMenuId === pageId ? (
              <div className={`${styles.pageCardMenu} ${styles.pageCardMenuOpen}`}>
                <button
                  type="button"
                  className={styles.fileCardMenuItem}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenPageMenuId(null);
                    onDeletePage(pageId);
                  }}
                >
                  <span>Hapus</span>
                </button>
              </div>
            ) : null}

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

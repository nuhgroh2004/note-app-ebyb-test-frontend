"use client";

import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import NotesEditorCanvas from "./NotesEditorCanvas";
import NotesLeftPanel from "./NotesLeftPanel";
import NotesRightPanel from "./NotesRightPanel";
import NotesTopBar from "./NotesTopBar";
import { LINE_INSERT_OPTIONS, NOTES_LEFT_TOOLS } from "./notesEditorData";
import type { NotesRightTab } from "../lib/notesEditorTypes";
import styles from "../styles/notes.module.css";

type TableHoverState = {
  row: number;
  col: number;
} | null;

type EditorStats = {
  blockCount: number;
  wordCount: number;
  tableCount: number;
};

type NotesCardTone = "default" | "mint";

function createPageId() {
  return `page-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function getAlphabetLabel(index: number) {
  let label = "";
  let value = index + 1;

  while (value > 0) {
    const modulo = (value - 1) % 26;
    label = String.fromCharCode(65 + modulo) + label;
    value = Math.floor((value - 1) / 26);
  }

  return label;
}

function formatFileSize(bytes: number) {
  if (bytes <= 0) {
    return "0 KB";
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.max(1, Math.round(kb))} KB`;
  }

  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function createEmptyParagraph() {
  const paragraph = document.createElement("p");
  paragraph.className = styles.editorParagraph;
  paragraph.dataset.noteBlock = "paragraph";
  paragraph.innerHTML = "<br>";
  return paragraph;
}

function createLabeledBlock(className: string, label: string, helper: string, blockType = "custom") {
  const wrapper = document.createElement("div");
  wrapper.className = className;
  wrapper.dataset.noteBlock = blockType;

  const blockLabel = document.createElement("p");
  blockLabel.className = styles.editorBlockLabel;
  blockLabel.textContent = label;

  const blockHelper = document.createElement("p");
  blockHelper.className = styles.editorBlockHelper;
  blockHelper.textContent = helper;

  wrapper.append(blockLabel, blockHelper);
  return wrapper;
}

function createHorizontalLine(lineId: (typeof LINE_INSERT_OPTIONS)[number]["id"]) {
  const line = document.createElement("div");
  line.dataset.noteBlock = "line";
  line.className = styles.editorLine;

  if (lineId === "dash") {
    line.classList.add(styles.editorLineDash);
    return line;
  }

  if (lineId === "thin") {
    line.classList.add(styles.editorLineThin);
    return line;
  }

  if (lineId === "thick") {
    line.classList.add(styles.editorLineThick);
    return line;
  }

  line.classList.add(styles.editorLineDots);
  return line;
}

function appendSpreadsheetColumn(table: HTMLTableElement) {
  const headerRow = table.tHead?.rows[0];
  const body = table.tBodies[0];

  if (!headerRow || !body) {
    return;
  }

  const nextColIndex = headerRow.cells.length - 1;
  const columnHeader = document.createElement("th");
  columnHeader.className = styles.sheetColumnHeader;
  columnHeader.contentEditable = "false";
  columnHeader.textContent = getAlphabetLabel(nextColIndex);
  headerRow.appendChild(columnHeader);

  Array.from(body.rows).forEach((row) => {
    const cell = document.createElement("td");
    cell.className = styles.sheetCell;
    cell.contentEditable = "true";
    cell.dataset.sheetCell = "true";
    cell.innerHTML = "<br>";
    row.appendChild(cell);
  });
}

function appendSpreadsheetRow(table: HTMLTableElement) {
  const headerRow = table.tHead?.rows[0];
  const body = table.tBodies[0];

  if (!headerRow || !body) {
    return;
  }

  const columns = headerRow.cells.length - 1;
  const row = document.createElement("tr");
  const rowHeader = document.createElement("th");
  rowHeader.className = styles.sheetRowHeader;
  rowHeader.contentEditable = "false";
  rowHeader.textContent = String(body.rows.length + 1);
  row.appendChild(rowHeader);

  for (let col = 0; col < columns; col += 1) {
    const cell = document.createElement("td");
    cell.className = styles.sheetCell;
    cell.contentEditable = "true";
    cell.dataset.sheetCell = "true";
    cell.innerHTML = "<br>";
    row.appendChild(cell);
  }

  body.appendChild(row);
}

function createExcelLikeTable(rows: number, cols: number) {
  const wrapper = document.createElement("div");
  wrapper.className = styles.sheetWrapper;
  wrapper.dataset.noteBlock = "table";
  wrapper.dataset.sheetType = "excel";
  wrapper.contentEditable = "false";

  const table = document.createElement("table");
  table.className = styles.sheetTable;

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const corner = document.createElement("th");
  corner.className = styles.sheetCorner;
  corner.contentEditable = "false";
  corner.textContent = "#";
  headerRow.appendChild(corner);

  for (let col = 0; col < cols; col += 1) {
    const columnHeader = document.createElement("th");
    columnHeader.className = styles.sheetColumnHeader;
    columnHeader.contentEditable = "false";
    columnHeader.textContent = getAlphabetLabel(col);
    headerRow.appendChild(columnHeader);
  }

  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");
  for (let row = 0; row < rows; row += 1) {
    const rowElement = document.createElement("tr");
    const rowHeader = document.createElement("th");
    rowHeader.className = styles.sheetRowHeader;
    rowHeader.contentEditable = "false";
    rowHeader.textContent = String(row + 1);
    rowElement.appendChild(rowHeader);

    for (let col = 0; col < cols; col += 1) {
      const cell = document.createElement("td");
      cell.className = styles.sheetCell;
      cell.contentEditable = "true";
      cell.dataset.sheetCell = "true";
      cell.innerHTML = "<br>";
      rowElement.appendChild(cell);
    }

    tbody.appendChild(rowElement);
  }

  const controls = document.createElement("div");
  controls.className = styles.sheetControls;

  const addColumnButton = document.createElement("button");
  addColumnButton.type = "button";
  addColumnButton.className = styles.sheetControlButton;
  addColumnButton.textContent = "+ Kolom";
  addColumnButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  addColumnButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    appendSpreadsheetColumn(table);
  });

  const addRowButton = document.createElement("button");
  addRowButton.type = "button";
  addRowButton.className = styles.sheetControlButton;
  addRowButton.textContent = "+ Baris";
  addRowButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  addRowButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    appendSpreadsheetRow(table);
  });

  controls.append(addColumnButton, addRowButton);
  table.append(thead, tbody);
  wrapper.append(table, controls);
  return wrapper;
}

export default function NotesWorkspace() {
  const initialPageId = useMemo(() => createPageId(), []);

  const [activeLeftToolId, setActiveLeftToolId] = useState(NOTES_LEFT_TOOLS[0].id);
  const [activeRightTab, setActiveRightTab] = useState<NotesRightTab>("insert");
  const [title, setTitle] = useState("");
  const [tableHover, setTableHover] = useState<TableHoverState>(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [stats, setStats] = useState<EditorStats>({
    blockCount: 0,
    wordCount: 0,
    tableCount: 0,
  });
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isCompactSpacing, setIsCompactSpacing] = useState(false);
  const [cardTone, setCardTone] = useState<NotesCardTone>("default");
  const [pageIds, setPageIds] = useState<string[]>(() => [initialPageId]);
  const [activePageId, setActivePageId] = useState(initialPageId);

  const editorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const savedRangesRef = useRef<Record<string, Range | null>>({});
  const pendingFocusPageIdRef = useRef<string | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const pageTitle = useMemo(() => {
    const trimmed = title.trim();
    return trimmed.length > 0 ? trimmed : "Untitled Page";
  }, [title]);

  const closeAttachmentMenus = useCallback(() => {
    pageIds.forEach((pageId) => {
      const editor = editorRefs.current[pageId];
      if (!editor) {
        return;
      }

      editor.querySelectorAll(`.${styles.fileCardMenuOpen}`).forEach((node) => {
        node.classList.remove(styles.fileCardMenuOpen);
      });
    });
  }, [pageIds]);

  const getEditorRef = useCallback(
    (pageId: string) => (element: HTMLDivElement | null) => {
      editorRefs.current[pageId] = element;
    },
    [],
  );

  const syncStats = useCallback(() => {
    let nextWordCount = 0;
    let nextBlockCount = 0;
    let nextTableCount = 0;

    pageIds.forEach((pageId) => {
      const editor = editorRefs.current[pageId];
      if (!editor) {
        return;
      }

      const text = editor.innerText.trim();
      nextWordCount += text.length > 0 ? text.split(/\s+/).length : 0;
      nextBlockCount += editor.querySelectorAll("[data-note-block]").length;
      nextTableCount += editor.querySelectorAll("[data-sheet-type='excel']").length;
    });

    setStats({
      blockCount: nextBlockCount,
      wordCount: nextWordCount,
      tableCount: nextTableCount,
    });
  }, [pageIds]);

  const rememberSelection = useCallback((pageId: string) => {
    const editor = editorRefs.current[pageId];

    if (!editor || typeof window === "undefined") {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      savedRangesRef.current[pageId] = range.cloneRange();
      setActivePageId(pageId);
    }
  }, []);

  const setCaretInElement = useCallback((pageId: string, element: HTMLElement, atStart = true) => {
    if (typeof window === "undefined") {
      return;
    }

    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(atStart);
    selection.removeAllRanges();
    selection.addRange(range);
    savedRangesRef.current[pageId] = range.cloneRange();
    setActivePageId(pageId);
  }, []);

  const getEditableContext = useCallback(() => {
    const activeEditor = editorRefs.current[activePageId];
    if (activeEditor) {
      return {
        pageId: activePageId,
        editor: activeEditor,
      };
    }

    for (const pageId of pageIds) {
      const editor = editorRefs.current[pageId];
      if (editor) {
        return {
          pageId,
          editor,
        };
      }
    }

    return null;
  }, [activePageId, pageIds]);

  const getInsertionRange = useCallback((pageId: string, editor: HTMLDivElement) => {
    if (typeof window === "undefined") {
      return null;
    }

    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const currentRange = selection.getRangeAt(0);
      if (editor.contains(currentRange.commonAncestorContainer)) {
        return currentRange;
      }
    }

    const savedRange = savedRangesRef.current[pageId];
    if (savedRange) {
      try {
        selection?.removeAllRanges();
        selection?.addRange(savedRange);
        return savedRange;
      } catch {
        savedRangesRef.current[pageId] = null;
      }
    }

    const fallbackRange = document.createRange();
    fallbackRange.selectNodeContents(editor);
    fallbackRange.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(fallbackRange);
    savedRangesRef.current[pageId] = fallbackRange.cloneRange();
    return fallbackRange;
  }, []);

  const insertNode = useCallback(
    (node: HTMLElement, options?: { addParagraphAfter?: boolean; focusTarget?: HTMLElement | null }) => {
      const editableContext = getEditableContext();
      if (!editableContext) {
        return;
      }

      const { pageId, editor } = editableContext;
      editor.focus();

      const range = getInsertionRange(pageId, editor);
      if (!range) {
        return;
      }

      range.deleteContents();
      range.insertNode(node);

      let nextFocusTarget: HTMLElement | null = options?.focusTarget ?? null;

      if (options?.addParagraphAfter) {
        const paragraph = createEmptyParagraph();
        node.parentNode?.insertBefore(paragraph, node.nextSibling);
        nextFocusTarget = paragraph;
      }

      if (nextFocusTarget) {
        setCaretInElement(pageId, nextFocusTarget, true);
      }

      rememberSelection(pageId);
      syncStats();
    },
    [getEditableContext, getInsertionRange, rememberSelection, setCaretInElement, syncStats],
  );

  const registerObjectUrl = useCallback((file: File) => {
    const objectUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(objectUrl);
    return objectUrl;
  }, []);

  const createAttachmentNode = useCallback(
    (file: File) => {
      const fileUrl = registerObjectUrl(file);
      let fileName = file.name;

      const wrapper = document.createElement("div");
      wrapper.className = `${styles.fileCard} ${styles.fileCardRegular}`;
      wrapper.dataset.noteBlock = "attachment-file";
      wrapper.contentEditable = "false";

      const header = document.createElement("div");
      header.className = styles.fileCardHeader;

      const titleWrap = document.createElement("div");
      titleWrap.className = styles.fileCardTitleWrap;

      const nameLabel = document.createElement("p");
      nameLabel.className = styles.fileCardName;
      nameLabel.textContent = fileName;

      const metaLabel = document.createElement("p");
      metaLabel.className = styles.fileCardMeta;
      metaLabel.textContent = `${formatFileSize(file.size)} • ${file.type || "FILE"}`;

      titleWrap.append(nameLabel, metaLabel);

      const menuButton = document.createElement("button");
      menuButton.type = "button";
      menuButton.className = styles.fileCardMenuButton;
      menuButton.textContent = "...";

      const menu = document.createElement("div");
      menu.className = styles.fileCardMenu;

      const applyViewMode = (mode: "small" | "regular" | "card") => {
        wrapper.classList.remove(styles.fileCardSmall, styles.fileCardRegular, styles.fileCardLarge);

        if (mode === "small") {
          wrapper.classList.add(styles.fileCardSmall);
          return;
        }

        if (mode === "card") {
          wrapper.classList.add(styles.fileCardLarge);
          return;
        }

        wrapper.classList.add(styles.fileCardRegular);
      };

      const closeMenu = () => {
        menu.classList.remove(styles.fileCardMenuOpen);
      };

      const appendMenuItem = (label: string, onClick: () => void) => {
        const itemButton = document.createElement("button");
        itemButton.type = "button";
        itemButton.className = styles.fileCardMenuItem;
        itemButton.textContent = label;
        itemButton.addEventListener("mousedown", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        itemButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          onClick();
          closeMenu();
        });
        menu.appendChild(itemButton);
      };

      appendMenuItem("Download", () => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        link.click();
      });

      appendMenuItem("Rename", () => {
        const nextName = window.prompt("Rename file", fileName);
        if (!nextName || nextName.trim().length === 0) {
          return;
        }

        fileName = nextName.trim();
        nameLabel.textContent = fileName;
      });

      appendMenuItem("Small", () => {
        applyViewMode("small");
      });

      appendMenuItem("Reguler", () => {
        applyViewMode("regular");
      });

      appendMenuItem("Card", () => {
        applyViewMode("card");
      });

      menuButton.addEventListener("mousedown", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });

      menuButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = menu.classList.contains(styles.fileCardMenuOpen);
        closeAttachmentMenus();

        if (!isOpen) {
          menu.classList.add(styles.fileCardMenuOpen);
        }
      });

      wrapper.addEventListener("dblclick", (event) => {
        const target = event.target as HTMLElement;
        if (target.closest(`.${styles.fileCardMenu}`) || target.closest(`.${styles.fileCardMenuButton}`)) {
          return;
        }

        window.open(fileUrl, "_blank", "noopener,noreferrer");
      });

      header.append(titleWrap, menuButton);
      wrapper.append(header, menu);
      return wrapper;
    },
    [closeAttachmentMenus, registerObjectUrl],
  );

  const createImageNode = useCallback(
    (file: File) => {
      const imageUrl = registerObjectUrl(file);
      const figure = document.createElement("figure");
      figure.className = styles.imageCard;
      figure.dataset.noteBlock = "image-file";
      figure.contentEditable = "false";

      const image = document.createElement("img");
      image.className = styles.imagePreview;
      image.src = imageUrl;
      image.alt = file.name;

      const caption = document.createElement("figcaption");
      caption.className = styles.imageCaption;
      caption.textContent = file.name;

      figure.append(image, caption);
      return figure;
    },
    [registerObjectUrl],
  );

  const handleAttachmentFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) {
        return;
      }

      const attachmentNode = createAttachmentNode(selectedFile);
      insertNode(attachmentNode, { addParagraphAfter: true });
      event.target.value = "";
      setIsRightPanelOpen(false);
    },
    [createAttachmentNode, insertNode],
  );

  const handleImageFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) {
        return;
      }

      const imageNode = createImageNode(selectedFile);
      insertNode(imageNode, { addParagraphAfter: true });
      event.target.value = "";
      setIsRightPanelOpen(false);
    },
    [createImageNode, insertNode],
  );

  const insertItem = useCallback(
    (itemId: string) => {
      if (itemId === "attachment") {
        attachmentInputRef.current?.click();
        return;
      }

      if (itemId === "image") {
        imageInputRef.current?.click();
        return;
      }

      if (itemId === "card") {
        const cardBlock = createLabeledBlock(
          styles.cardBlock,
          "Card Block",
          "Write concise context, key metrics, or decisions here.",
          "card",
        );
        insertNode(cardBlock, { addParagraphAfter: true });
        return;
      }

      if (itemId === "code") {
        const codeBlock = document.createElement("pre");
        codeBlock.className = styles.codeBlock;
        codeBlock.dataset.noteBlock = "code";

        const codeText = document.createElement("code");
        codeText.textContent = "// tulis kode di sini";
        codeBlock.appendChild(codeText);

        insertNode(codeBlock, { addParagraphAfter: true });
        return;
      }

      if (itemId === "headings") {
        const heading = document.createElement("h2");
        heading.className = styles.editorHeading;
        heading.dataset.noteBlock = "heading";
        heading.textContent = "Heading";
        insertNode(heading, { addParagraphAfter: true });
        return;
      }

      if (itemId === "checklist") {
        const checklistItem = document.createElement("label");
        checklistItem.className = styles.checklistItem;
        checklistItem.dataset.noteBlock = "checklist";
        checklistItem.contentEditable = "false";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = styles.checklistCheckbox;
        checkbox.contentEditable = "false";

        const text = document.createElement("span");
        text.className = styles.checklistText;
        text.contentEditable = "true";
        text.textContent = "Checklist item";

        checklistItem.append(checkbox, text);
        insertNode(checklistItem, { addParagraphAfter: true });
        return;
      }

      if (itemId === "callout") {
        const callout = document.createElement("div");
        callout.className = styles.calloutBlock;
        callout.dataset.noteBlock = "callout";

        const titleText = document.createElement("p");
        titleText.className = styles.calloutTitle;
        titleText.textContent = "Callout";

        const bodyText = document.createElement("p");
        bodyText.className = styles.calloutBody;
        bodyText.textContent = "Tambahkan catatan penting agar mudah ditemukan.";

        callout.append(titleText, bodyText);
        insertNode(callout, { addParagraphAfter: true });
        return;
      }

      if (itemId === "title-size") {
        setIsTitleExpanded((prev) => !prev);
        return;
      }

      if (itemId === "page-color") {
        setCardTone((prev) => (prev === "default" ? "mint" : "default"));
        return;
      }

      if (itemId === "spacing") {
        setIsCompactSpacing((prev) => !prev);
      }
    },
    [insertNode],
  );

  const insertPageBreakCanvas = useCallback(() => {
    const nextPageId = createPageId();

    setPageIds((prev) => {
      const activeIndex = prev.indexOf(activePageId);
      if (activeIndex === -1) {
        return [...prev, nextPageId];
      }

      return [...prev.slice(0, activeIndex + 1), nextPageId, ...prev.slice(activeIndex + 1)];
    });

    pendingFocusPageIdRef.current = nextPageId;
    setActivePageId(nextPageId);
  }, [activePageId]);

  function closeMobilePanels() {
    setIsLeftPanelOpen(false);
    setIsRightPanelOpen(false);
  }

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest(`.${styles.fileCardMenu}`) || target?.closest(`.${styles.fileCardMenuButton}`)) {
        return;
      }

      closeAttachmentMenus();
    };

    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, [closeAttachmentMenus]);

  useEffect(() => {
    const pendingFocusPageId = pendingFocusPageIdRef.current;

    if (!pendingFocusPageId || typeof window === "undefined") {
      return;
    }

    const editor = editorRefs.current[pendingFocusPageId];
    if (!editor) {
      return;
    }

    editor.focus();
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(true);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    savedRangesRef.current[pendingFocusPageId] = range.cloneRange();
    pendingFocusPageIdRef.current = null;
  }, [pageIds]);

  return (
    <main className={styles.notesPage}>
      <input
        ref={attachmentInputRef}
        type="file"
        className={styles.hiddenFileInput}
        onChange={handleAttachmentFile}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenFileInput}
        onChange={handleImageFile}
      />

      <section className={styles.notesApp}>
        <button
          type="button"
          aria-label="Close panel"
          className={`${styles.mobileBackdrop} ${
            isLeftPanelOpen || isRightPanelOpen ? styles.mobileBackdropShow : ""
          }`}
          onClick={closeMobilePanels}
        />

        <NotesLeftPanel
          activeToolId={activeLeftToolId}
          tools={NOTES_LEFT_TOOLS}
          isOpenOnMobile={isLeftPanelOpen}
          onSetTool={(toolId) => {
            setActiveLeftToolId(toolId);
            setIsLeftPanelOpen(false);
          }}
        />

        <section className={styles.editorArea}>
          <NotesTopBar
            pageTitle={pageTitle}
            onToggleLeftPanel={() => {
              setIsRightPanelOpen(false);
              setIsLeftPanelOpen((prev) => !prev);
            }}
            onToggleRightPanel={() => {
              setIsLeftPanelOpen(false);
              setIsRightPanelOpen((prev) => !prev);
            }}
          />

          <NotesEditorCanvas
            title={title}
            pageIds={pageIds}
            activePageId={activePageId}
            getEditorRef={getEditorRef}
            cardTone={cardTone}
            isCompactSpacing={isCompactSpacing}
            isTitleExpanded={isTitleExpanded}
            onTitleChange={setTitle}
            onEditorInput={(pageId) => {
              setActivePageId(pageId);
              syncStats();
              rememberSelection(pageId);
            }}
            onSelectionChange={rememberSelection}
            onPageActivate={(pageId) => {
              setActivePageId(pageId);
            }}
          />
        </section>

        <NotesRightPanel
          activeTab={activeRightTab}
          isOpenOnMobile={isRightPanelOpen}
          tableHover={tableHover}
          blockCount={stats.blockCount}
          wordCount={stats.wordCount}
          tableCount={stats.tableCount}
          onSetActiveTab={(tab) => setActiveRightTab(tab)}
          onInsertItem={(itemId) => {
            insertItem(itemId);
            setIsRightPanelOpen(false);
          }}
          onInsertLine={(lineId) => {
            const lineBlock = createHorizontalLine(lineId);
            insertNode(lineBlock, { addParagraphAfter: true });
            setIsRightPanelOpen(false);
          }}
          onInsertPageBreak={() => {
            insertPageBreakCanvas();
            setIsRightPanelOpen(false);
          }}
          onSetTableHover={setTableHover}
          onInsertTable={(rows, cols) => {
            const table = createExcelLikeTable(rows, cols);
            insertNode(table, { addParagraphAfter: true });
            setTableHover(null);
            setIsRightPanelOpen(false);
          }}
        />
      </section>
    </main>
  );
}

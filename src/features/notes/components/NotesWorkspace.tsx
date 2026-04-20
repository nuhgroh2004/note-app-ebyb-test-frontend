"use client";

import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
type FileTypeKind =
  | "generic"
  | "image"
  | "pdf"
  | "word"
  | "sheet"
  | "slide"
  | "archive"
  | "code"
  | "text";
type MenuActionIcon = "download" | "rename" | "small" | "regular" | "card" | "delete";

const CARD_BLOCK_TYPE = "card";
const PARAGRAPH_BLOCK_TYPE = "paragraph";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const NOTES_CALENDAR_DRAFT_STORAGE_KEY = "notes_calendar_document_draft";

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

function getFileTypeMeta(file: File): { label: string; kind: FileTypeKind } {
  const lowerName = file.name.toLowerCase();
  const extension = lowerName.includes(".") ? lowerName.split(".").at(-1) || "" : "";

  if (file.type.startsWith("image/")) {
    return { label: "IMG", kind: "image" };
  }

  if (file.type === "application/pdf" || extension === "pdf") {
    return { label: "PDF", kind: "pdf" };
  }

  if (["doc", "docx", "odt", "rtf"].includes(extension)) {
    return { label: "DOC", kind: "word" };
  }

  if (["xls", "xlsx", "csv", "ods"].includes(extension)) {
    return { label: "XLS", kind: "sheet" };
  }

  if (["ppt", "pptx", "odp"].includes(extension)) {
    return { label: "PPT", kind: "slide" };
  }

  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return { label: "ZIP", kind: "archive" };
  }

  if (["js", "ts", "tsx", "jsx", "json", "html", "css", "py", "java", "sql"].includes(extension)) {
    return { label: "<>", kind: "code" };
  }

  if (["txt", "md", "log"].includes(extension)) {
    return { label: "TXT", kind: "text" };
  }

  if (extension.length > 0) {
    return { label: extension.slice(0, 3).toUpperCase(), kind: "generic" };
  }

  return { label: "FILE", kind: "generic" };
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

function createSvgElement<T extends keyof SVGElementTagNameMap>(
  tagName: T,
  attributes: Record<string, string>,
) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}

function createMenuActionIcon(icon: MenuActionIcon) {
  const iconClassMap: Record<MenuActionIcon, string> = {
    download: styles.fileCardMenuIconDownload,
    rename: styles.fileCardMenuIconRename,
    small: styles.fileCardMenuIconSmall,
    regular: styles.fileCardMenuIconRegular,
    card: styles.fileCardMenuIconCard,
    delete: styles.fileCardMenuIconDelete,
  };

  const wrapper = document.createElement("span");
  wrapper.className = `${styles.fileCardMenuItemIcon} ${iconClassMap[icon]}`;

  const svg = createSvgElement("svg", {
    class: styles.fileCardMenuItemIconSvg,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.8",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
  });

  if (icon === "download") {
    svg.append(
      createSvgElement("line", { x1: "12", y1: "4", x2: "12", y2: "14" }),
      createSvgElement("polyline", { points: "8 10 12 14 16 10" }),
      createSvgElement("path", { d: "M5 19h14" }),
    );
  }

  if (icon === "rename") {
    svg.append(
      createSvgElement("path", { d: "M12 20h9" }),
      createSvgElement("path", { d: "M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" }),
    );
  }

  if (icon === "small") {
    svg.append(createSvgElement("rect", { x: "6", y: "9", width: "12", height: "6", rx: "1.5" }));
  }

  if (icon === "regular") {
    svg.append(createSvgElement("rect", { x: "5", y: "7", width: "14", height: "10", rx: "1.6" }));
  }

  if (icon === "card") {
    svg.append(
      createSvgElement("rect", { x: "4", y: "6", width: "16", height: "12", rx: "1.8" }),
      createSvgElement("line", { x1: "10", y1: "6", x2: "10", y2: "18" }),
    );
  }

  if (icon === "delete") {
    svg.append(
      createSvgElement("polyline", { points: "3 6 5 6 21 6" }),
      createSvgElement("path", { d: "M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" }),
      createSvgElement("path", { d: "M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" }),
      createSvgElement("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
      createSvgElement("line", { x1: "14", y1: "11", x2: "14", y2: "17" }),
    );
  }

  wrapper.appendChild(svg);
  return wrapper;
}

function appendSpreadsheetColumn(table: HTMLTableElement, onTableMutation?: () => void) {
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

  onTableMutation?.();
}

function appendSpreadsheetRow(table: HTMLTableElement, onTableMutation?: () => void) {
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
  onTableMutation?.();
}

function createExcelLikeTable(rows: number, cols: number, onTableMutation?: () => void) {
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
    appendSpreadsheetColumn(table, onTableMutation);
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
    appendSpreadsheetRow(table, onTableMutation);
  });

  const deleteTableButton = document.createElement("button");
  deleteTableButton.type = "button";
  deleteTableButton.className = `${styles.sheetControlButton} ${styles.sheetControlButtonDanger}`;
  deleteTableButton.textContent = "Hapus Tabel";
  deleteTableButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  deleteTableButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    wrapper.remove();
    onTableMutation?.();
  });

  controls.append(addColumnButton, addRowButton, deleteTableButton);
  table.append(thead, tbody);
  wrapper.append(table, controls);
  return wrapper;
}

export default function NotesWorkspace() {
  const searchParams = useSearchParams();
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
  const hasAppliedCalendarDraftRef = useRef(false);

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

      editor.querySelectorAll(`.${styles.fileCardMenuButtonVisible}`).forEach((node) => {
        node.classList.remove(styles.fileCardMenuButtonVisible);
      });

      editor.querySelectorAll(`.${styles.fileRenameRow}`).forEach((node) => {
        node.classList.add(styles.fileRenameRowHidden);
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
    (node: HTMLElement, options?: {
      addParagraphAfter?: boolean;
      focusTarget?: HTMLElement | null;
      forceAfterTable?: boolean;
    }) => {
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

      const anchorElement =
        range.commonAncestorContainer instanceof Element
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement;

      const insertAfterBlock = (block: HTMLElement) => {
        block.parentNode?.insertBefore(node, block.nextSibling);

        let blockFocusTarget: HTMLElement | null = options?.focusTarget ?? null;
        if (options?.addParagraphAfter) {
          const paragraph = createEmptyParagraph();
          node.parentNode?.insertBefore(paragraph, node.nextSibling);
          blockFocusTarget = paragraph;
        }

        if (blockFocusTarget) {
          setCaretInElement(pageId, blockFocusTarget, true);
        }

        rememberSelection(pageId);
        syncStats();
      };

      if (options?.forceAfterTable) {
        const activeTable = anchorElement?.closest("[data-sheet-type='excel']") as HTMLElement | null;

        if (activeTable && editor.contains(activeTable)) {
          insertAfterBlock(activeTable);
          return;
        }
      }

      // Disallow menu nesting in menu blocks except card, which acts as a container.
      const activeBlock = anchorElement?.closest("[data-note-block]") as HTMLElement | null;
      const activeBlockType = activeBlock?.dataset.noteBlock ?? "";
      const canContainNestedMenu = activeBlockType === CARD_BLOCK_TYPE;
      const isParagraphBlock = activeBlockType === PARAGRAPH_BLOCK_TYPE;

      if (activeBlock && editor.contains(activeBlock) && !canContainNestedMenu && !isParagraphBlock) {
        insertAfterBlock(activeBlock);
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
      const fileTypeMeta = getFileTypeMeta(file);

      const fileTypeClassMap: Record<FileTypeKind, string> = {
        generic: styles.fileTypeIconGeneric,
        image: styles.fileTypeIconImage,
        pdf: styles.fileTypeIconPdf,
        word: styles.fileTypeIconWord,
        sheet: styles.fileTypeIconSheet,
        slide: styles.fileTypeIconSlide,
        archive: styles.fileTypeIconArchive,
        code: styles.fileTypeIconCode,
        text: styles.fileTypeIconText,
      };

      const wrapper = document.createElement("div");
      wrapper.className = `${styles.fileCard} ${styles.fileCardRegular}`;
      wrapper.dataset.noteBlock = "attachment-file";
      wrapper.contentEditable = "false";

      const header = document.createElement("div");
      header.className = styles.fileCardHeader;

      const lead = document.createElement("div");
      lead.className = styles.fileCardLead;

      const fileTypeIcon = document.createElement("span");
      fileTypeIcon.className = `${styles.fileTypeIcon} ${fileTypeClassMap[fileTypeMeta.kind]}`;
      fileTypeIcon.textContent = fileTypeMeta.label;

      const titleWrap = document.createElement("div");
      titleWrap.className = styles.fileCardTitleWrap;

      const nameLabel = document.createElement("p");
      nameLabel.className = styles.fileCardName;
      nameLabel.textContent = fileName;

      const metaLabel = document.createElement("p");
      metaLabel.className = styles.fileCardMeta;
      metaLabel.textContent = `${formatFileSize(file.size)} • ${file.type || "FILE"}`;

      titleWrap.append(nameLabel, metaLabel);
      lead.append(fileTypeIcon, titleWrap);

      const menuButton = document.createElement("button");
      menuButton.type = "button";
      menuButton.className = styles.fileCardMenuButton;

      const dotsIcon = document.createElement("span");
      dotsIcon.className = styles.fileCardMenuDots;

      for (let index = 0; index < 3; index += 1) {
        const dot = document.createElement("span");
        dot.className = styles.fileCardMenuDot;
        dotsIcon.appendChild(dot);
      }

      menuButton.appendChild(dotsIcon);

      const menu = document.createElement("div");
      menu.className = styles.fileCardMenu;

      const renameRow = document.createElement("div");
      renameRow.className = `${styles.fileRenameRow} ${styles.fileRenameRowHidden}`;

      const renameInput = document.createElement("input");
      renameInput.type = "text";
      renameInput.className = styles.fileRenameInput;
      renameInput.value = fileName;

      const renameActions = document.createElement("div");
      renameActions.className = styles.fileRenameActions;

      const renameSaveButton = document.createElement("button");
      renameSaveButton.type = "button";
      renameSaveButton.className = `${styles.fileRenameAction} ${styles.fileRenameActionPrimary}`;
      renameSaveButton.textContent = "Simpan";

      const renameCancelButton = document.createElement("button");
      renameCancelButton.type = "button";
      renameCancelButton.className = styles.fileRenameAction;
      renameCancelButton.textContent = "Batal";

      renameActions.append(renameCancelButton, renameSaveButton);
      renameRow.append(renameInput, renameActions);

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
        menuButton.classList.remove(styles.fileCardMenuButtonVisible);
      };

      const closeRenameRow = () => {
        renameRow.classList.add(styles.fileRenameRowHidden);
      };

      const openRenameRow = () => {
        renameInput.value = fileName;
        renameRow.classList.remove(styles.fileRenameRowHidden);
        window.setTimeout(() => {
          renameInput.focus();
          renameInput.select();
        }, 0);
      };

      const applyRename = () => {
        const nextName = renameInput.value.trim();
        if (nextName.length === 0) {
          return;
        }

        fileName = nextName;
        nameLabel.textContent = fileName;
        closeRenameRow();
      };

      const appendMenuItem = (label: string, icon: MenuActionIcon, onClick: () => void) => {
        const itemButton = document.createElement("button");
        itemButton.type = "button";
        itemButton.className = styles.fileCardMenuItem;

        const iconNode = createMenuActionIcon(icon);

        const labelText = document.createElement("span");
        labelText.className = styles.fileCardMenuItemLabel;
        labelText.textContent = label;

        itemButton.append(iconNode, labelText);
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

      appendMenuItem("Download", "download", () => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        link.click();
      });

      appendMenuItem("Rename", "rename", () => {
        openRenameRow();
      });

      appendMenuItem("Small", "small", () => {
        applyViewMode("small");
      });

      appendMenuItem("Reguler", "regular", () => {
        applyViewMode("regular");
      });

      appendMenuItem("Card", "card", () => {
        applyViewMode("card");
      });

      renameSaveButton.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });

      renameSaveButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        applyRename();
      });

      renameCancelButton.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });

      renameCancelButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeRenameRow();
      });

      renameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          applyRename();
        }

        if (event.key === "Escape") {
          event.preventDefault();
          closeRenameRow();
        }
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
        closeRenameRow();

        if (!isOpen) {
          menu.classList.add(styles.fileCardMenuOpen);
          menuButton.classList.add(styles.fileCardMenuButtonVisible);
        }
      });

      wrapper.addEventListener("dblclick", (event) => {
        const target = event.target as HTMLElement;
        if (target.closest(`.${styles.fileCardMenu}`) || target.closest(`.${styles.fileCardMenuButton}`)) {
          return;
        }

        window.open(fileUrl, "_blank", "noopener,noreferrer");
      });

      header.append(lead, menuButton);
      wrapper.append(header, renameRow, menu);
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

      figure.append(image);
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
        const codeCard = document.createElement("div");
        codeCard.className = styles.codeBlockCard;
        codeCard.dataset.noteBlock = "code";
        codeCard.contentEditable = "false";

        const codeMenuButton = document.createElement("button");
        codeMenuButton.type = "button";
        codeMenuButton.className = `${styles.fileCardMenuButton} ${styles.codeBlockMenuButton}`;

        const dotsIcon = document.createElement("span");
        dotsIcon.className = styles.fileCardMenuDots;

        for (let index = 0; index < 3; index += 1) {
          const dot = document.createElement("span");
          dot.className = styles.fileCardMenuDot;
          dotsIcon.appendChild(dot);
        }

        codeMenuButton.appendChild(dotsIcon);

        const codeMenu = document.createElement("div");
        codeMenu.className = `${styles.fileCardMenu} ${styles.codeBlockMenu}`;

        const codeBlock = document.createElement("pre");
        codeBlock.className = styles.codeBlock;
        codeBlock.contentEditable = "true";
        codeBlock.spellcheck = false;

        const codeText = document.createElement("code");
        codeText.textContent = "// tulis kode di sini";
        codeBlock.appendChild(codeText);

        const closeCodeMenu = () => {
          codeMenu.classList.remove(styles.fileCardMenuOpen);
          codeMenuButton.classList.remove(styles.fileCardMenuButtonVisible);
        };

        const appendCodeMenuItem = (label: string, icon: MenuActionIcon, onClick: () => void) => {
          const itemButton = document.createElement("button");
          itemButton.type = "button";
          itemButton.className = styles.fileCardMenuItem;

          const iconNode = createMenuActionIcon(icon);

          const labelText = document.createElement("span");
          labelText.className = styles.fileCardMenuItemLabel;
          labelText.textContent = label;

          itemButton.append(iconNode, labelText);
          itemButton.addEventListener("mousedown", (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
          itemButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            onClick();
            closeCodeMenu();
          });

          codeMenu.appendChild(itemButton);
        };

        appendCodeMenuItem("Download", "download", () => {
          const snippetContent = codeBlock.innerText;
          const blob = new Blob([snippetContent], { type: "text/plain;charset=utf-8" });
          const snippetUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = snippetUrl;
          link.download = `snippet-${Date.now()}.txt`;
          link.click();
          window.setTimeout(() => {
            URL.revokeObjectURL(snippetUrl);
          }, 0);
        });

        appendCodeMenuItem("Hapus", "delete", () => {
          codeCard.remove();
          syncStats();
        });

        codeMenuButton.addEventListener("mousedown", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });

        codeMenuButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const isOpen = codeMenu.classList.contains(styles.fileCardMenuOpen);
          closeAttachmentMenus();

          if (!isOpen) {
            codeMenu.classList.add(styles.fileCardMenuOpen);
            codeMenuButton.classList.add(styles.fileCardMenuButtonVisible);
          }
        });

        codeCard.append(codeMenuButton, codeBlock, codeMenu);
        insertNode(codeCard, { addParagraphAfter: true, focusTarget: codeBlock });
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
    [closeAttachmentMenus, insertNode, syncStats],
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
    if (hasAppliedCalendarDraftRef.current || typeof window === "undefined") {
      return;
    }

    const source = searchParams.get("source");
    const entryType = searchParams.get("entry");

    if (source !== "calendar" || entryType !== "document") {
      hasAppliedCalendarDraftRef.current = true;
      return;
    }

    const rawDraft = window.sessionStorage.getItem(NOTES_CALENDAR_DRAFT_STORAGE_KEY);
    if (!rawDraft) {
      hasAppliedCalendarDraftRef.current = true;
      return;
    }

    try {
      const parsedDraft = JSON.parse(rawDraft) as {
        title?: unknown;
      };

      const draftTitle =
        typeof parsedDraft.title === "string" ? parsedDraft.title.trim() : "";

      if (draftTitle) {
        setTitle(draftTitle);
      }
    } catch {
      // No-op: ignore malformed session draft.
    } finally {
      window.sessionStorage.removeItem(NOTES_CALENDAR_DRAFT_STORAGE_KEY);
      hasAppliedCalendarDraftRef.current = true;
    }
  }, [searchParams]);

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
            const table = createExcelLikeTable(rows, cols, () => {
              syncStats();
            });
            insertNode(table, { addParagraphAfter: true, forceAfterTable: true });
            setTableHover(null);
            setIsRightPanelOpen(false);
          }}
        />
      </section>
    </main>
  );
}

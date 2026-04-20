import type {
  NotesInsertItem,
  NotesRightTabItem,
  NotesToolItem,
} from "../lib/notesEditorTypes";

export const NOTES_LEFT_TOOLS: NotesToolItem[] = [
  { id: "toc", icon: "list", label: "Table of Contents" },
  { id: "timeline", icon: "clock", label: "Timeline" },
  { id: "links", icon: "link", label: "Links" },
  { id: "find", icon: "search", label: "Find" },
];

export const NOTES_RIGHT_TABS: NotesRightTabItem[] = [
  { id: "insert", label: "Insert" },
  { id: "format", label: "Format" },
];

export const NOTES_INSERT_ITEMS: NotesInsertItem[] = [
  { id: "card", label: "Card", icon: "layout", tone: "blue", tab: "insert" },
  {
    id: "attachment",
    label: "File Attachment",
    icon: "link",
    tone: "neutral",
    tab: "insert",
  },
  { id: "image", label: "Image", icon: "image", tone: "green", tab: "insert" },
  { id: "code", label: "Code Block", icon: "code", tone: "neutral", tab: "insert" },
  { id: "headings", label: "Headings", icon: "list", tone: "neutral", tab: "format" },
  { id: "checklist", label: "Checklist", icon: "plus", tone: "neutral", tab: "format" },
  { id: "align-left", label: "Align Left", icon: "layout", tone: "neutral", tab: "format" },
  { id: "align-center", label: "Center", icon: "layout", tone: "neutral", tab: "format" },
  { id: "align-right", label: "Align Right", icon: "layout", tone: "neutral", tab: "format" },
  {
    id: "align-justify",
    label: "Justify",
    icon: "layout",
    tone: "neutral",
    tab: "format",
  },
  { id: "bold", label: "Bold", icon: "doc", tone: "neutral", tab: "format" },
  { id: "italic", label: "Italic", icon: "link", tone: "neutral", tab: "format" },
  { id: "underline", label: "Underline", icon: "share", tone: "neutral", tab: "format" },
  { id: "highlight", label: "Highlight", icon: "image", tone: "blue", tab: "format" },
];

export const LINE_INSERT_OPTIONS = [
  { id: "dots", label: "Dots" },
  { id: "dash", label: "Dashed" },
  { id: "thin", label: "Thin" },
  { id: "thick", label: "Thick" },
] as const;

export const TABLE_GRID_ROWS = 5;
export const TABLE_GRID_COLS = 8;

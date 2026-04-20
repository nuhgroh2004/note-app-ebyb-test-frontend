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
  { id: "style", label: "Style" },
  { id: "info", label: "Info" },
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
  { id: "callout", label: "Callout", icon: "info", tone: "blue", tab: "format" },
  { id: "title-size", label: "Title Size", icon: "layout", tone: "neutral", tab: "style" },
  { id: "page-color", label: "Page Color", icon: "image", tone: "muted", tab: "style" },
  { id: "spacing", label: "Spacing", icon: "list", tone: "neutral", tab: "style" },
  { id: "activity", label: "Recent Activity", icon: "clock", tone: "neutral", tab: "info" },
  { id: "sharing", label: "Sharing Access", icon: "share", tone: "neutral", tab: "info" },
  { id: "notifications", label: "Notifications", icon: "bell", tone: "neutral", tab: "info" },
];

export const LINE_INSERT_OPTIONS = [
  { id: "dots", label: "Dots" },
  { id: "dash", label: "Dashed" },
  { id: "thin", label: "Thin" },
  { id: "thick", label: "Thick" },
] as const;

export const TABLE_GRID_ROWS = 5;
export const TABLE_GRID_COLS = 8;

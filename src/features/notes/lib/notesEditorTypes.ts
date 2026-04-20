export type NotesRightTab = "insert" | "format" | "style" | "info";

export type NotesIconName =
  | "doc"
  | "list"
  | "clock"
  | "link"
  | "search"
  | "grid"
  | "image"
  | "code"
  | "board"
  | "bell"
  | "info"
  | "layout"
  | "share"
  | "folder"
  | "chevron-right"
  | "plus";

export type NotesInsertItem = {
  id: string;
  label: string;
  icon: NotesIconName;
  tone: "neutral" | "blue" | "green" | "muted";
  tab: NotesRightTab;
};

export type NotesToolItem = {
  id: string;
  icon: NotesIconName;
  label: string;
};

export type NotesRightTabItem = {
  id: NotesRightTab;
  label: string;
};

export type NotesEditorBlock = {
  id: string;
  type: "item" | "line" | "page-break" | "table";
  label: string;
  meta?: string;
};

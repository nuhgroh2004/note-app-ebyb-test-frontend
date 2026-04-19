export type NoteUiItem = {
  id: number;
  title: string;
  content: string;
  noteDate: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteDraft = {
  title: string;
  content: string;
  noteDate: string;
};

export type NoteDraftErrors = Partial<Record<keyof NoteDraft, string>>;

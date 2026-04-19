import type { NoteDraft, NoteDraftErrors } from "./notesTypes";

export function validateNoteDraft(payload: NoteDraft): NoteDraftErrors {
  const errors: NoteDraftErrors = {};

  if (payload.title.trim().length < 3) {
    errors.title = "Judul minimal 3 karakter";
  }

  if (payload.content.trim().length < 5) {
    errors.content = "Konten minimal 5 karakter";
  }

  if (!payload.noteDate) {
    errors.noteDate = "Tanggal catatan wajib diisi";
  }

  return errors;
}

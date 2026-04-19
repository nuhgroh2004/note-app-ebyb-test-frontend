import type { NoteDraft, NoteUiItem } from "./notesTypes";

type NotesErrorItem = {
  field?: string;
  message?: string;
};

type NotesApiResponse<T> = {
  message?: string;
  data?: T;
  errors?: NotesErrorItem[];
};

type NotesListPayload = {
  items: NoteUiItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type NotesListQuery = {
  token: string;
  page: number;
  limit: number;
  date?: string;
};

type NotesMutationPayload = {
  token: string;
  draft: NoteDraft;
};

function parseNoteDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const dateValue = new Date(value);

  if (Number.isNaN(dateValue.getTime())) {
    return "";
  }

  return dateValue.toISOString().slice(0, 10);
}

function normalizeNote(item: NoteUiItem): NoteUiItem {
  return {
    ...item,
    noteDate: parseNoteDate(item.noteDate),
  };
}

function extractErrorMessage(payload: NotesApiResponse<unknown>, fallback: string) {
  if (payload.errors && payload.errors.length > 0) {
    const firstError = payload.errors[0];

    if (firstError?.message) {
      return firstError.message;
    }
  }

  if (payload.message) {
    return payload.message;
  }

  return fallback;
}

async function requestNotesApi<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  token: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const payload = (await response.json().catch(() => ({}))) as NotesApiResponse<T>;

  if (!response.ok || payload.data === undefined) {
    throw new Error(extractErrorMessage(payload, "Permintaan notes gagal"));
  }

  return payload.data;
}

export async function fetchNotesWithApi(query: NotesListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.date) {
    params.set("date", query.date);
  }

  const result = await requestNotesApi<NotesListPayload>(
    `/api/notes?${params.toString()}`,
    "GET",
    query.token
  );

  return {
    ...result,
    items: result.items.map(normalizeNote),
  };
}

export async function createNoteWithApi(payload: NotesMutationPayload) {
  const result = await requestNotesApi<NoteUiItem>(
    "/api/notes",
    "POST",
    payload.token,
    payload.draft
  );

  return normalizeNote(result);
}

export async function updateNoteWithApi(payload: {
  token: string;
  noteId: number;
  draft: NoteDraft;
}) {
  const result = await requestNotesApi<NoteUiItem>(
    `/api/notes/${payload.noteId}`,
    "PUT",
    payload.token,
    payload.draft
  );

  return normalizeNote(result);
}

export function deleteNoteWithApi(payload: { token: string; noteId: number }) {
  return requestNotesApi<{ message?: string }>(
    `/api/notes/${payload.noteId}`,
    "DELETE",
    payload.token
  );
}

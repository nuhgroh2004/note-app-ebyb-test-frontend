import { readAuthToken } from "@/features/auth/lib/authSession";

export type NoteEntryType = "note" | "document";

export type NoteItem = {
  id: number;
  title: string;
  content: string;
  noteDate: string;
  entryType: NoteEntryType;
  label: string | null;
  color: string | null;
  time: string | null;
  isStarred: boolean;
  location: string;
  createdAt: string;
  updatedAt: string;
};

type NotesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type NotesListResponse = {
  items: NoteItem[];
  pagination: NotesPagination;
};

type NotesApiResponse<T> = {
  message?: string;
  data?: T;
};

type ListNotesParams = {
  page?: number;
  limit?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  entryType?: NoteEntryType;
  isStarred?: boolean;
  sort?: "noteDateDesc" | "noteDateAsc" | "updatedAtDesc" | "updatedAtAsc" | "createdAtDesc";
};

type CreateNotePayload = {
  title: string;
  content: string;
  noteDate: string;
  entryType?: NoteEntryType;
  label?: string;
  color?: string;
  time?: string;
  isStarred?: boolean;
  location?: string;
};

type UpdateNotePayload = Partial<CreateNotePayload>;

function getAuthTokenOrThrow() {
  const token = readAuthToken();

  if (!token) {
    throw new Error("Sesi login tidak ditemukan. Silakan login ulang.");
  }

  return token;
}

function resolveApiErrorMessage(payload: unknown, fallbackMessage: string) {
  if (!payload || typeof payload !== "object") {
    return fallbackMessage;
  }

  if ("errors" in payload && Array.isArray((payload as { errors?: unknown[] }).errors)) {
    const [firstError] = (payload as { errors?: Array<{ message?: string }> }).errors ?? [];

    if (firstError?.message) {
      return firstError.message;
    }
  }

  if ("message" in payload && typeof (payload as { message?: unknown }).message === "string") {
    return (payload as { message: string }).message;
  }

  return fallbackMessage;
}

async function requestNotesApi<T>(
  endpoint: string,
  options: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    allowEmptyData?: boolean;
  },
): Promise<T> {
  const token = getAuthTokenOrThrow();
  const response = await fetch(endpoint, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as NotesApiResponse<T> | null;

  if (!response.ok || (!options.allowEmptyData && !payload?.data)) {
    throw new Error(resolveApiErrorMessage(payload, "Request notes API gagal"));
  }

  return (payload?.data ?? null) as T;
}

function buildListNotesQuery(params: ListNotesParams) {
  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }

  if (params.date) {
    query.set("date", params.date);
  }

  if (params.startDate) {
    query.set("startDate", params.startDate);
  }

  if (params.endDate) {
    query.set("endDate", params.endDate);
  }

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.entryType) {
    query.set("entryType", params.entryType);
  }

  if (params.isStarred !== undefined) {
    query.set("isStarred", String(params.isStarred));
  }

  if (params.sort) {
    query.set("sort", params.sort);
  }

  return query.toString();
}

export function listNotes(params: ListNotesParams = {}) {
  const query = buildListNotesQuery(params);
  const endpoint = query ? `/api/notes?${query}` : "/api/notes";

  return requestNotesApi<NotesListResponse>(endpoint, {
    method: "GET",
  });
}

export function createNote(payload: CreateNotePayload) {
  return requestNotesApi<NoteItem>("/api/notes", {
    method: "POST",
    body: payload,
  });
}

export function getNoteById(noteId: number) {
  return requestNotesApi<NoteItem>(`/api/notes/${noteId}`, {
    method: "GET",
  });
}

export function updateNote(noteId: number, payload: UpdateNotePayload) {
  return requestNotesApi<NoteItem>(`/api/notes/${noteId}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteNote(noteId: number) {
  await requestNotesApi<null>(`/api/notes/${noteId}`, {
    method: "DELETE",
    allowEmptyData: true,
  });
}

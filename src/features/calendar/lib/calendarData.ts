export type CalendarEntryType = "note" | "document";

export type CalendarEntryColor = "green" | "blue" | "purple" | "amber" | "red";

export type CalendarEntry = {
  id: number;
  type: CalendarEntryType;
  title: string;
  body: string;
  label: string;
  color: CalendarEntryColor;
  time: string;
  createdAt: string;
};

export type CalendarEntriesByDate = Record<string, CalendarEntry[]>;

export const CALENDAR_DOCUMENT_DRAFT_STORAGE_KEY = "notes_calendar_document_draft";

export const CALENDAR_MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

export const CALENDAR_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const CALENDAR_LABEL_OPTIONS = ["Kerja", "Rapat", "Pribadi", "Deadline", "Penting"] as const;

export const CALENDAR_COLOR_OPTIONS: Array<{
  value: CalendarEntryColor;
  hex: string;
}> = [
  { value: "green", hex: "#16a34a" },
  { value: "blue", hex: "#2563eb" },
  { value: "purple", hex: "#7c3aed" },
  { value: "amber", hex: "#d97706" },
  { value: "red", hex: "#dc2626" },
];

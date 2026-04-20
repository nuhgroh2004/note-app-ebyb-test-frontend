export type CalendarEntryType = "note" | "document";

export type CalendarEntryColor = "green" | "blue" | "purple" | "amber" | "red";

export type CalendarEntry = {
  id: string;
  type: CalendarEntryType;
  title: string;
  body: string;
  label: string;
  color: CalendarEntryColor;
  time: string;
  createdAt: string;
};

export type CalendarEntriesByDate = Record<string, CalendarEntry[]>;

export const CALENDAR_ENTRIES_STORAGE_KEY = "dashboard_calendar_entries_v1";
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

export const CALENDAR_INITIAL_ENTRIES: CalendarEntriesByDate = {
  "2026-04-01": [
    {
      id: "seed-2026-04-01-1",
      type: "note",
      title: "Kickoff sprint Q2",
      body: "Presentasi roadmap tim produk.",
      label: "Kerja",
      color: "green",
      time: "09:00",
      createdAt: "2026-04-01T09:00:00.000Z",
    },
  ],
  "2026-04-03": [
    {
      id: "seed-2026-04-03-1",
      type: "note",
      title: "Review desain UI",
      body: "Bahas mockup halaman dashboard baru.",
      label: "Rapat",
      color: "blue",
      time: "10:00",
      createdAt: "2026-04-03T10:00:00.000Z",
    },
    {
      id: "seed-2026-04-03-2",
      type: "note",
      title: "Dokter gigi",
      body: "Janji kontrol pukul 14.00.",
      label: "Pribadi",
      color: "purple",
      time: "14:00",
      createdAt: "2026-04-03T14:00:00.000Z",
    },
  ],
  "2026-04-14": [
    {
      id: "seed-2026-04-14-1",
      type: "document",
      title: "Draft proposal event donor darah",
      body: "",
      label: "Dokumen",
      color: "blue",
      time: "",
      createdAt: "2026-04-14T08:30:00.000Z",
    },
    {
      id: "seed-2026-04-14-2",
      type: "note",
      title: "Sync dengan klien",
      body: "Video call jam 10.00.",
      label: "Rapat",
      color: "blue",
      time: "10:00",
      createdAt: "2026-04-14T10:00:00.000Z",
    },
  ],
  "2026-04-20": [
    {
      id: "seed-2026-04-20-1",
      type: "note",
      title: "Demo produk ke investor",
      body: "Siapkan deck presentasi dan live demo.",
      label: "Kerja",
      color: "green",
      time: "09:00",
      createdAt: "2026-04-20T09:00:00.000Z",
    },
    {
      id: "seed-2026-04-20-2",
      type: "note",
      title: "Revisi dokumen SRS",
      body: "Versi final dikirim ke tim legal.",
      label: "Deadline",
      color: "amber",
      time: "15:00",
      createdAt: "2026-04-20T15:00:00.000Z",
    },
  ],
};

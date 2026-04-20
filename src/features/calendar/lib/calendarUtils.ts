import {
  CALENDAR_MONTH_NAMES,
  type CalendarEntriesByDate,
  type CalendarEntry,
  type CalendarEntryColor,
  type CalendarEntryType,
} from "./calendarData";

const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export type CalendarCell = {
  dateKey: string;
  dayNumber: number;
  monthIndex: number;
  year: number;
  isOutsideCurrentMonth: boolean;
  isToday: boolean;
  entries: CalendarEntry[];
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function normalizeMonth(year: number, monthIndex: number) {
  const date = new Date(year, monthIndex, 1);
  return {
    year: date.getFullYear(),
    monthIndex: date.getMonth(),
  };
}

function normalizeEntryType(value: unknown): CalendarEntryType {
  return value === "document" ? "document" : "note";
}

function normalizeEntryColor(value: unknown): CalendarEntryColor {
  if (value === "green") {
    return value;
  }

  if (value === "blue") {
    return value;
  }

  if (value === "purple") {
    return value;
  }

  if (value === "amber") {
    return value;
  }

  if (value === "red") {
    return value;
  }

  return "blue";
}

export function toDateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

export function parseDateKey(dateKey: string): {
  year: number;
  monthIndex: number;
  day: number;
} | null {
  if (!DATE_KEY_REGEX.test(dateKey)) {
    return null;
  }

  const [yearRaw, monthRaw, dayRaw] = dateKey.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return {
    year,
    monthIndex: month - 1,
    day,
  };
}

export function getTodayDateKey() {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getDateCountLabel(count: number) {
  if (count <= 0) {
    return "Belum ada catatan";
  }

  return `${count} item`;
}

export function formatCalendarDateLabel(dateKey: string) {
  const parsed = parseDateKey(dateKey);

  if (!parsed) {
    return "Tanggal tidak valid";
  }

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const date = new Date(parsed.year, parsed.monthIndex, parsed.day);
  const dayName = dayNames[date.getDay()];
  const monthName = CALENDAR_MONTH_NAMES[parsed.monthIndex];

  return `${dayName}, ${parsed.day} ${monthName}`;
}

export function buildCalendarCells(
  year: number,
  monthIndex: number,
  entriesByDate: CalendarEntriesByDate,
): CalendarCell[] {
  const normalizedCurrent = normalizeMonth(year, monthIndex);
  const firstDayInMonth = new Date(normalizedCurrent.year, normalizedCurrent.monthIndex, 1).getDay();
  const daysInCurrentMonth = new Date(
    normalizedCurrent.year,
    normalizedCurrent.monthIndex + 1,
    0,
  ).getDate();
  const daysInPreviousMonth = new Date(
    normalizedCurrent.year,
    normalizedCurrent.monthIndex,
    0,
  ).getDate();

  const todayDateKey = getTodayDateKey();
  const cells: CalendarCell[] = [];

  for (let index = firstDayInMonth - 1; index >= 0; index -= 1) {
    const day = daysInPreviousMonth - index;
    const normalizedPrevious = normalizeMonth(
      normalizedCurrent.year,
      normalizedCurrent.monthIndex - 1,
    );
    const dateKey = toDateKey(normalizedPrevious.year, normalizedPrevious.monthIndex, day);

    cells.push({
      dateKey,
      dayNumber: day,
      monthIndex: normalizedPrevious.monthIndex,
      year: normalizedPrevious.year,
      isOutsideCurrentMonth: true,
      isToday: dateKey === todayDateKey,
      entries: entriesByDate[dateKey] ?? [],
    });
  }

  for (let day = 1; day <= daysInCurrentMonth; day += 1) {
    const dateKey = toDateKey(normalizedCurrent.year, normalizedCurrent.monthIndex, day);

    cells.push({
      dateKey,
      dayNumber: day,
      monthIndex: normalizedCurrent.monthIndex,
      year: normalizedCurrent.year,
      isOutsideCurrentMonth: false,
      isToday: dateKey === todayDateKey,
      entries: entriesByDate[dateKey] ?? [],
    });
  }

  while (cells.length < 42) {
    const nextDay = cells.length - (firstDayInMonth + daysInCurrentMonth) + 1;
    const normalizedNext = normalizeMonth(normalizedCurrent.year, normalizedCurrent.monthIndex + 1);
    const dateKey = toDateKey(normalizedNext.year, normalizedNext.monthIndex, nextDay);

    cells.push({
      dateKey,
      dayNumber: nextDay,
      monthIndex: normalizedNext.monthIndex,
      year: normalizedNext.year,
      isOutsideCurrentMonth: true,
      isToday: dateKey === todayDateKey,
      entries: entriesByDate[dateKey] ?? [],
    });
  }

  return cells;
}

export function parseStoredCalendarEntries(rawStorageValue: string | null) {
  if (!rawStorageValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawStorageValue) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const normalized: CalendarEntriesByDate = {};

    Object.entries(parsed).forEach(([dateKey, value]) => {
      if (!DATE_KEY_REGEX.test(dateKey) || !Array.isArray(value)) {
        return;
      }

      const normalizedEntries: CalendarEntry[] = [];

      value.forEach((item, index) => {
        if (!item || typeof item !== "object") {
          return;
        }

        const candidate = item as Record<string, unknown>;
        const title = typeof candidate.title === "string" ? candidate.title.trim() : "";

        if (!title) {
          return;
        }

        const body = typeof candidate.body === "string" ? candidate.body.trim() : "";
        const type = normalizeEntryType(candidate.type);
        const labelFallback = type === "document" ? "Dokumen" : "Kerja";
        const label = typeof candidate.label === "string" ? candidate.label : labelFallback;
        const createdAt =
          typeof candidate.createdAt === "string" && candidate.createdAt.length > 0
            ? candidate.createdAt
            : new Date().toISOString();
        const time = typeof candidate.time === "string" ? candidate.time : "";

        normalizedEntries.push({
          id:
            typeof candidate.id === "string" && candidate.id.length > 0
              ? candidate.id
              : `entry-${dateKey}-${index}`,
          type,
          title,
          body,
          label,
          color: normalizeEntryColor(candidate.color),
          time,
          createdAt,
        });
      });

      if (normalizedEntries.length > 0) {
        normalized[dateKey] = normalizedEntries;
      }
    });

    return normalized;
  } catch {
    return null;
  }
}

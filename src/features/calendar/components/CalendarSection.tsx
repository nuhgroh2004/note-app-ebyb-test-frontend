"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  createNote,
  deleteNote,
  listNotes,
  updateNote,
  type NoteItem,
} from "@/features/notes/lib/notesApi";
import CalendarGrid from "./CalendarGrid";
import {
  CALENDAR_COLOR_OPTIONS,
  CALENDAR_DOCUMENT_DRAFT_STORAGE_KEY,
  CALENDAR_LABEL_OPTIONS,
  CALENDAR_MONTH_NAMES,
  type CalendarEntriesByDate,
  type CalendarEntry,
  type CalendarEntryColor,
  type CalendarEntryType,
} from "../lib/calendarData";
import {
  buildCalendarCells,
  formatCalendarDateLabel,
  getDateCountLabel,
  getTodayDateKey,
  parseDateKey,
} from "../lib/calendarUtils";
import styles from "../styles/calendar.module.css";

type CalendarSectionProps = {
  searchValue: string;
};

type CalendarFormState = {
  entryType: CalendarEntryType;
  title: string;
  body: string;
  label: string;
  color: CalendarEntryColor;
  time: string;
};

const NOTE_FORM_DEFAULTS: CalendarFormState = {
  entryType: "note",
  title: "",
  body: "",
  label: CALENDAR_LABEL_OPTIONS[0],
  color: "green",
  time: "09:00",
};

const DOCUMENT_FORM_DEFAULTS: CalendarFormState = {
  entryType: "document",
  title: "",
  body: "",
  label: "Dokumen",
  color: "blue",
  time: "",
};

const calendarColorHexMap: Record<CalendarEntryColor, string> = {
  green: "#16a34a",
  blue: "#2563eb",
  purple: "#7c3aed",
  amber: "#d97706",
  red: "#dc2626",
};

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
});

const CALENDAR_FETCH_PAGE_LIMIT = 100;

function toDateNumberString(value: number) {
  return String(value).padStart(2, "0");
}

function toDateKeyFromIso(isoString: string) {
  const parsedDate = new Date(isoString);

  if (Number.isNaN(parsedDate.getTime())) {
    return getTodayDateKey();
  }

  return `${parsedDate.getUTCFullYear()}-${toDateNumberString(parsedDate.getUTCMonth() + 1)}-${
    toDateNumberString(parsedDate.getUTCDate())
  }`;
}

function getMonthDateRange(year: number, monthIndex: number) {
  const monthNumber = monthIndex + 1;
  const month = toDateNumberString(monthNumber);
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-${toDateNumberString(new Date(year, monthNumber, 0).getDate())}`;

  return {
    startDate,
    endDate,
  };
}

function normalizeCalendarColor(color: string | null): CalendarEntryColor {
  if (color === "green" || color === "blue" || color === "purple" || color === "amber" || color === "red") {
    return color;
  }

  return "blue";
}

function mapNoteToCalendarEntry(note: NoteItem): CalendarEntry {
  return {
    id: note.id,
    type: note.entryType === "document" ? "document" : "note",
    title: note.title,
    body: note.content,
    label: note.label || (note.entryType === "document" ? "Dokumen" : "Kerja"),
    color: normalizeCalendarColor(note.color),
    time: note.time || "",
    createdAt: note.createdAt,
  };
}

function buildEntriesByDate(items: NoteItem[]) {
  const entriesByDate: CalendarEntriesByDate = {};

  items.forEach((note) => {
    const dateKey = toDateKeyFromIso(note.noteDate);
    const mappedEntry = mapNoteToCalendarEntry(note);

    if (!entriesByDate[dateKey]) {
      entriesByDate[dateKey] = [];
    }

    entriesByDate[dateKey].push(mappedEntry);
  });

  return entriesByDate;
}

function toDisplayTime(timeValue: string) {
  if (!timeValue) {
    return "";
  }

  return timeValue.includes(":") ? timeValue : timeValue.replace(".", ":");
}

export default function CalendarSection({ searchValue }: CalendarSectionProps) {
  const router = useRouter();
  const todayDateKey = useMemo(() => getTodayDateKey(), []);
  const parsedToday = useMemo(() => parseDateKey(todayDateKey), [todayDateKey]);

  const [calendarYear, setCalendarYear] = useState(parsedToday?.year ?? 2026);
  const [calendarMonthIndex, setCalendarMonthIndex] = useState(parsedToday?.monthIndex ?? 3);
  const [selectedDateKey, setSelectedDateKey] = useState(todayDateKey);
  const [entriesByDate, setEntriesByDate] = useState<CalendarEntriesByDate>({});
  const [isEntriesLoading, setIsEntriesLoading] = useState(false);
  const [entriesError, setEntriesError] = useState("");
  const [reloadEntriesKey, setReloadEntriesKey] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSavingEntry, setIsSavingEntry] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [formState, setFormState] = useState<CalendarFormState>(NOTE_FORM_DEFAULTS);
  const [formError, setFormError] = useState("");
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQueryList = window.matchMedia("(max-width: 980px)");

    const syncMobileState = () => {
      setIsMobileViewport(mediaQueryList.matches);
      if (!mediaQueryList.matches) {
        setIsMobilePanelOpen(false);
      }
    };

    syncMobileState();

    const addListener = mediaQueryList.addEventListener?.bind(mediaQueryList);
    const removeListener = mediaQueryList.removeEventListener?.bind(mediaQueryList);

    if (addListener && removeListener) {
      addListener("change", syncMobileState);
      return () => {
        removeListener("change", syncMobileState);
      };
    }

    mediaQueryList.addListener(syncMobileState);
    return () => {
      mediaQueryList.removeListener(syncMobileState);
    };
  }, []);

  const monthLabel = useMemo(
    () => `${CALENDAR_MONTH_NAMES[calendarMonthIndex]} ${calendarYear}`,
    [calendarMonthIndex, calendarYear],
  );

  const normalizedSearch = useMemo(() => searchValue.trim(), [searchValue]);

  useEffect(() => {
    let cancelled = false;
    const debounceId = window.setTimeout(async () => {
      setIsEntriesLoading(true);
      setEntriesError("");

      const { startDate, endDate } = getMonthDateRange(calendarYear, calendarMonthIndex);

      try {
        const monthItems: NoteItem[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const result = await listNotes({
            page,
            limit: CALENDAR_FETCH_PAGE_LIMIT,
            startDate,
            endDate,
            search: normalizedSearch || undefined,
            sort: "noteDateAsc",
          });

          monthItems.push(...result.items);
          totalPages = Math.max(1, result.pagination.totalPages || 1);
          page += 1;
        } while (page <= totalPages && page <= 100);

        if (cancelled) {
          return;
        }

        setEntriesByDate(buildEntriesByDate(monthItems));
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Gagal memuat data kalender dari server.";
        setEntriesByDate({});
        setEntriesError(message);
      } finally {
        if (!cancelled) {
          setIsEntriesLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(debounceId);
    };
  }, [calendarMonthIndex, calendarYear, normalizedSearch, reloadEntriesKey]);

  const cells = useMemo(
    () => buildCalendarCells(calendarYear, calendarMonthIndex, entriesByDate),
    [calendarYear, calendarMonthIndex, entriesByDate],
  );

  const selectedEntries = useMemo(() => entriesByDate[selectedDateKey] ?? [], [entriesByDate, selectedDateKey]);
  const selectedDateLabel = useMemo(() => formatCalendarDateLabel(selectedDateKey), [selectedDateKey]);
  const selectedDateCountLabel = useMemo(() => {
    if (isEntriesLoading) {
      return "Memuat data...";
    }

    if (entriesError) {
      return entriesError;
    }

    if (!normalizedSearch) {
      return getDateCountLabel(selectedEntries.length);
    }

    return `${selectedEntries.length} item sesuai pencarian`;
  }, [entriesError, isEntriesLoading, normalizedSearch, selectedEntries.length]);

  const isEditingEntry = editingEntryId !== null;

  function changeMonth(offset: number) {
    const nextMonthDate = new Date(calendarYear, calendarMonthIndex + offset, 1);
    setCalendarYear(nextMonthDate.getFullYear());
    setCalendarMonthIndex(nextMonthDate.getMonth());
  }

  function selectDate(dateKey: string) {
    setSelectedDateKey(dateKey);

    if (isMobileViewport) {
      setIsMobilePanelOpen(true);
    }
  }

  function openForm(nextEntryType: CalendarEntryType = "note") {
    setEditingEntryId(null);
    setFormError("");
    setIsFormOpen(true);
    setFormState(nextEntryType === "document" ? DOCUMENT_FORM_DEFAULTS : NOTE_FORM_DEFAULTS);

    if (isMobileViewport) {
      setIsMobilePanelOpen(true);
    }
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingEntryId(null);
    setFormError("");
    setFormState(NOTE_FORM_DEFAULTS);
  }

  function closeMobilePanel() {
    setIsMobilePanelOpen(false);
    closeForm();
  }

  function switchEntryType(nextType: CalendarEntryType) {
    if (isEditingEntry) {
      return;
    }

    setFormError("");
    setFormState(nextType === "document" ? DOCUMENT_FORM_DEFAULTS : NOTE_FORM_DEFAULTS);
  }

  function startEditNote(entry: CalendarEntry) {
    if (entry.type !== "note") {
      return;
    }

    setEditingEntryId(entry.id);
    setFormError("");
    setFormState({
      entryType: "note",
      title: entry.title,
      body: entry.body,
      label: entry.label,
      color: entry.color,
      time: entry.time,
    });
    setIsFormOpen(true);

    if (isMobileViewport) {
      setIsMobilePanelOpen(true);
    }
  }

  function saveDocumentDraftToSession(entry: CalendarEntry) {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(
      CALENDAR_DOCUMENT_DRAFT_STORAGE_KEY,
      JSON.stringify({
        title: entry.title,
        body: entry.body,
        label: entry.label,
        dateKey: selectedDateKey,
        source: "calendar",
        createdAt: entry.createdAt,
        noteId: entry.id,
      }),
    );
  }

  async function saveEntry() {
    const trimmedTitle = formState.title.trim();

    if (!trimmedTitle) {
      setFormError("Judul wajib diisi.");
      return;
    }

    setIsSavingEntry(true);
    setFormError("");

    try {
      const payload = {
        title: trimmedTitle,
        content: formState.entryType === "document" ? "" : formState.body.trim(),
        noteDate: selectedDateKey,
        entryType: formState.entryType,
        label: formState.entryType === "document" ? "Dokumen" : formState.label,
        color: formState.entryType === "document" ? "blue" : formState.color,
        time: formState.entryType === "document" ? "" : formState.time,
        location: "All Docs",
      } as const;

      if (editingEntryId) {
        await updateNote(editingEntryId, payload);
        closeForm();
        setReloadEntriesKey((current) => current + 1);
        return;
      }

      const createdNote = await createNote(payload);
      setReloadEntriesKey((current) => current + 1);

      if (createdNote.entryType === "document") {
        const createdEntry = mapNoteToCalendarEntry(createdNote);
        saveDocumentDraftToSession(createdEntry);
        setIsFormOpen(false);
        setFormState(DOCUMENT_FORM_DEFAULTS);
        router.push(`/notes?source=calendar&entry=document&noteId=${createdEntry.id}`);
        return;
      }

      closeForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyimpan item kalender.";
      setFormError(message);
    } finally {
      setIsSavingEntry(false);
    }
  }

  async function deleteEntry(entryId: number) {
    const confirmation = await swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      if (confirmation.dismiss === Swal.DismissReason.cancel) {
        await swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
      return;
    }

    try {
      await deleteNote(entryId);
      setReloadEntriesKey((current) => current + 1);
      await swalWithBootstrapButtons.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menghapus item dari server.";
      setFormError(message);
    }
  }

  function openDocumentFromEntry(entry: CalendarEntry) {
    if (entry.type !== "document") {
      return;
    }

    saveDocumentDraftToSession(entry);
    router.push(`/notes?source=calendar&entry=document&noteId=${entry.id}`);
  }

  return (
    <div className={styles.calendarContent}>
      {isMobileViewport && isMobilePanelOpen ? (
        <button
          type="button"
          className={styles.calendarMobileBackdrop}
          onClick={closeMobilePanel}
          aria-label="Tutup panel agenda"
        />
      ) : null}

      <div className={styles.calendarLayout}>
        <section className={styles.calendarMain}>
          <header className={styles.calendarHeader}>
            <h2 className={styles.calendarPageTitle}>Calendar</h2>

            <div className={styles.calendarMonthControl}>
              <button
                type="button"
                className={styles.calendarMonthNavButton}
                onClick={() => changeMonth(-1)}
                aria-label="Bulan sebelumnya"
              >
                &#8249;
              </button>

              <p className={styles.calendarMonthLabel}>{monthLabel}</p>

              <button
                type="button"
                className={styles.calendarMonthNavButton}
                onClick={() => changeMonth(1)}
                aria-label="Bulan berikutnya"
              >
                &#8250;
              </button>
            </div>
          </header>

          <CalendarGrid cells={cells} selectedDateKey={selectedDateKey} onSelectDate={selectDate} />
        </section>

        <aside
          className={`${styles.calendarPanel} ${
            isMobileViewport && isMobilePanelOpen ? styles.calendarPanelMobileOpen : ""
          }`}
        >
          <div className={styles.calendarPanelHeader}>
            <div className={styles.calendarPanelHeaderTop}>
              <div>
                <p className={styles.calendarPanelDate}>{selectedDateLabel}</p>
                <p className={styles.calendarPanelMeta}>{selectedDateCountLabel}</p>
              </div>

              <button
                type="button"
                className={styles.calendarPanelCloseButton}
                onClick={closeMobilePanel}
                aria-label="Tutup panel"
              >
                &#10005;
              </button>
            </div>
          </div>

          {!isFormOpen ? (
            <button type="button" className={styles.calendarAddButton} onClick={() => openForm("note")}>
              + Tambah item
            </button>
          ) : (
            <div className={styles.calendarFormWrap}>
              <div className={styles.calendarFormHeader}>
                <p className={styles.calendarFormTitle}>{isEditingEntry ? "Edit catatan" : "Item baru"}</p>

                <button
                  type="button"
                  className={styles.calendarFormClose}
                  onClick={closeForm}
                  aria-label="Tutup form"
                >
                  &#215;
                </button>
              </div>

              <div className={styles.calendarTypeSwitch}>
                <button
                  type="button"
                  className={`${styles.calendarTypeButton} ${
                    formState.entryType === "note" ? styles.calendarTypeButtonActive : ""
                  }`}
                  disabled={isEditingEntry}
                  onClick={() => switchEntryType("note")}
                >
                  Catatan
                </button>

                <button
                  type="button"
                  className={`${styles.calendarTypeButton} ${
                    formState.entryType === "document" ? styles.calendarTypeButtonActive : ""
                  }`}
                  disabled={isEditingEntry}
                  onClick={() => switchEntryType("document")}
                >
                  Dokumen
                </button>
              </div>

              <label className={styles.calendarFieldWrap}>
                <span className={styles.calendarFieldLabel}>Judul</span>
                <input
                  type="text"
                  className={styles.calendarFieldInput}
                  value={formState.title}
                  onChange={(event) => {
                    setFormState((current) => ({
                      ...current,
                      title: event.target.value,
                    }));
                  }}
                  placeholder="Contoh: Weekly planning"
                />
              </label>

              {formState.entryType === "note" ? (
                <>
                  <label className={styles.calendarFieldWrap}>
                    <span className={styles.calendarFieldLabel}>Isi catatan</span>
                    <textarea
                      className={styles.calendarFieldTextarea}
                      value={formState.body}
                      onChange={(event) => {
                        setFormState((current) => ({
                          ...current,
                          body: event.target.value,
                        }));
                      }}
                      placeholder="Tulis detail catatan di sini"
                    />
                  </label>

                  <label className={styles.calendarFieldWrap}>
                    <span className={styles.calendarFieldLabel}>Label</span>
                    <select
                      className={styles.calendarFieldSelect}
                      value={formState.label}
                      onChange={(event) => {
                        setFormState((current) => ({
                          ...current,
                          label: event.target.value,
                        }));
                      }}
                    >
                      {CALENDAR_LABEL_OPTIONS.map((labelOption) => (
                        <option key={labelOption} value={labelOption}>
                          {labelOption}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.calendarFieldWrap}>
                    <span className={styles.calendarFieldLabel}>Waktu</span>
                    <input
                      type="time"
                      className={styles.calendarFieldInput}
                      value={formState.time}
                      onChange={(event) => {
                        setFormState((current) => ({
                          ...current,
                          time: event.target.value,
                        }));
                      }}
                    />
                  </label>

                  <div className={styles.calendarFieldWrap}>
                    <span className={styles.calendarFieldLabel}>Warna</span>
                    <div className={styles.calendarColorRow}>
                      {CALENDAR_COLOR_OPTIONS.map((colorOption) => (
                        <button
                          key={colorOption.value}
                          type="button"
                          className={`${styles.calendarColorButton} ${
                            formState.color === colorOption.value ? styles.calendarColorButtonActive : ""
                          }`}
                          style={{ background: colorOption.hex }}
                          onClick={() => {
                            setFormState((current) => ({
                              ...current,
                              color: colorOption.value,
                            }));
                          }}
                          aria-label={`Pilih warna ${colorOption.value}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className={styles.calendarDocumentHint}>
                  Dokumen yang dibuat dari kalender akan otomatis dibuka di halaman Notes agar bisa lanjut ditulis.
                </p>
              )}

              {formError ? <p className={styles.calendarFormError}>{formError}</p> : null}

              <button
                type="button"
                className={styles.calendarSaveButton}
                onClick={() => {
                  void saveEntry();
                }}
                disabled={isSavingEntry}
              >
                {isSavingEntry
                  ? "Menyimpan..."
                  : isEditingEntry
                    ? "Simpan perubahan"
                    : formState.entryType === "document"
                      ? "Simpan & buka Notes"
                      : "Simpan catatan"}
              </button>
            </div>
          )}

          <div className={styles.calendarPanelListWrap}>
            {isEntriesLoading ? (
              <p className={styles.calendarEmptyState}>Memuat item kalender...</p>
            ) : selectedEntries.length > 0 ? (
              <ul className={styles.calendarEntryList}>
                {selectedEntries.map((entry) => {
                  const isDocument = entry.type === "document";

                  return (
                    <li
                      key={entry.id}
                      className={`${styles.calendarEntryCard} ${
                        isDocument ? styles.calendarEntryCardDocument : ""
                      }`}
                    >
                      <div className={styles.calendarEntryMetaRow}>
                        {isDocument ? (
                          <span className={styles.calendarEntryDocumentTag}>DOC</span>
                        ) : (
                          <span
                            className={styles.calendarEntryColorDot}
                            style={{ background: calendarColorHexMap[entry.color] }}
                          />
                        )}

                        <span className={styles.calendarEntryLabel}>{entry.label}</span>

                        {!isDocument && entry.time ? (
                          <span className={styles.calendarEntryTime}>{toDisplayTime(entry.time)}</span>
                        ) : null}
                      </div>

                      <p className={styles.calendarEntryTitle}>{entry.title}</p>

                      {!isDocument && entry.body ? <p className={styles.calendarEntryBody}>{entry.body}</p> : null}

                      <div className={styles.calendarEntryActions}>
                        {isDocument ? (
                          <button
                            type="button"
                            className={styles.calendarOpenDocumentButton}
                            onClick={() => openDocumentFromEntry(entry)}
                          >
                            Buka Notes
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={styles.calendarEditEntryButton}
                            onClick={() => startEditNote(entry)}
                          >
                            Edit
                          </button>
                        )}

                        <span className={styles.calendarEntryActionSpacer} />

                        <button
                          type="button"
                          className={styles.calendarDeleteEntryButton}
                          onClick={() => {
                            void deleteEntry(entry.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className={styles.calendarEmptyState}>
                Belum ada item pada tanggal ini. Tambahkan catatan atau dokumen dari panel di atas.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

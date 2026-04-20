"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import CalendarGrid from "./CalendarGrid";
import {
  CALENDAR_COLOR_OPTIONS,
  CALENDAR_DOCUMENT_DRAFT_STORAGE_KEY,
  CALENDAR_ENTRIES_STORAGE_KEY,
  CALENDAR_INITIAL_ENTRIES,
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
  parseStoredCalendarEntries,
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

function cloneCalendarEntries(entriesByDate: CalendarEntriesByDate) {
  const clone: CalendarEntriesByDate = {};

  Object.entries(entriesByDate).forEach(([dateKey, entries]) => {
    clone[dateKey] = entries.map((entry) => ({ ...entry }));
  });

  return clone;
}

function createEntryId() {
  return `entry-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
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
  const [entriesByDate, setEntriesByDate] = useState<CalendarEntriesByDate>(() => {
    if (typeof window === "undefined") {
      return cloneCalendarEntries(CALENDAR_INITIAL_ENTRIES);
    }

    try {
      const parsedStorageData = parseStoredCalendarEntries(
        window.localStorage.getItem(CALENDAR_ENTRIES_STORAGE_KEY),
      );

      if (parsedStorageData !== null) {
        return parsedStorageData;
      }
    } catch {
      // No-op: fallback to seeded entries.
    }

    return cloneCalendarEntries(CALENDAR_INITIAL_ENTRIES);
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [formState, setFormState] = useState<CalendarFormState>(NOTE_FORM_DEFAULTS);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CALENDAR_ENTRIES_STORAGE_KEY, JSON.stringify(entriesByDate));
  }, [entriesByDate]);

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

  const cells = useMemo(
    () => buildCalendarCells(calendarYear, calendarMonthIndex, entriesByDate),
    [calendarYear, calendarMonthIndex, entriesByDate],
  );

  const selectedEntries = useMemo(() => entriesByDate[selectedDateKey] ?? [], [entriesByDate, selectedDateKey]);
  const normalizedSearch = useMemo(() => searchValue.trim().toLowerCase(), [searchValue]);

  const visibleEntries = useMemo(() => {
    if (!normalizedSearch) {
      return selectedEntries;
    }

    return selectedEntries.filter((entry) => {
      const normalizedEntry = `${entry.title} ${entry.body} ${entry.label}`.toLowerCase();
      return normalizedEntry.includes(normalizedSearch);
    });
  }, [normalizedSearch, selectedEntries]);

  const selectedDateLabel = useMemo(() => formatCalendarDateLabel(selectedDateKey), [selectedDateKey]);

  const selectedDateCountLabel = useMemo(() => {
    if (!normalizedSearch) {
      return getDateCountLabel(selectedEntries.length);
    }

    return `${visibleEntries.length} hasil dari ${selectedEntries.length} item`;
  }, [normalizedSearch, selectedEntries.length, visibleEntries.length]);

  function changeMonth(offset: number) {
    const nextMonthDate = new Date(calendarYear, calendarMonthIndex + offset, 1);
    setCalendarYear(nextMonthDate.getFullYear());
    setCalendarMonthIndex(nextMonthDate.getMonth());
  }

  function selectDate(dateKey: string) {
    const parsedDate = parseDateKey(dateKey);
    if (parsedDate) {
      setCalendarYear(parsedDate.year);
      setCalendarMonthIndex(parsedDate.monthIndex);
    }

    setSelectedDateKey(dateKey);
    setIsFormOpen(false);
    setFormError("");

    if (isMobileViewport) {
      setIsMobilePanelOpen(true);
    }
  }

  function openForm() {
    setIsFormOpen(true);
    setFormError("");

    if (isMobileViewport) {
      setIsMobilePanelOpen(true);
    }
  }

  function closeForm() {
    setIsFormOpen(false);
    setFormState(NOTE_FORM_DEFAULTS);
    setFormError("");
  }

  function closeMobilePanel() {
    setIsMobilePanelOpen(false);
    setIsFormOpen(false);
  }

  function switchEntryType(nextType: CalendarEntryType) {
    setFormError("");
    setFormState(nextType === "document" ? DOCUMENT_FORM_DEFAULTS : NOTE_FORM_DEFAULTS);
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
      }),
    );
  }

  function saveEntry() {
    const trimmedTitle = formState.title.trim();

    if (!trimmedTitle) {
      setFormError("Judul wajib diisi.");
      return;
    }

    const nextEntry: CalendarEntry = {
      id: createEntryId(),
      type: formState.entryType,
      title: trimmedTitle,
      body: formState.entryType === "document" ? "" : formState.body.trim(),
      label: formState.entryType === "document" ? "Dokumen" : formState.label,
      color: formState.entryType === "document" ? "blue" : formState.color,
      time: formState.entryType === "document" ? "" : formState.time,
      createdAt: new Date().toISOString(),
    };

    setEntriesByDate((currentEntriesByDate) => {
      const currentEntries = currentEntriesByDate[selectedDateKey] ?? [];
      return {
        ...currentEntriesByDate,
        [selectedDateKey]: [...currentEntries, nextEntry],
      };
    });

    if (nextEntry.type === "document") {
      saveDocumentDraftToSession(nextEntry);
      setFormState(DOCUMENT_FORM_DEFAULTS);
      setIsFormOpen(false);
      setFormError("");
      router.push("/notes?source=calendar&entry=document");
      return;
    }

    setFormState(NOTE_FORM_DEFAULTS);
    setIsFormOpen(false);
    setFormError("");
  }

  async function deleteEntry(entryId: string) {
    const confirmation = await swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (confirmation.isConfirmed) {
      setEntriesByDate((currentEntriesByDate) => {
        const currentEntries = currentEntriesByDate[selectedDateKey] ?? [];
        const nextEntries = currentEntries.filter((entry) => entry.id !== entryId);

        if (nextEntries.length === 0) {
          const remainingEntries = { ...currentEntriesByDate };
          delete remainingEntries[selectedDateKey];
          return remainingEntries;
        }

        return {
          ...currentEntriesByDate,
          [selectedDateKey]: nextEntries,
        };
      });

      await swalWithBootstrapButtons.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
      return;
    }

    if (confirmation.dismiss === Swal.DismissReason.cancel) {
      await swalWithBootstrapButtons.fire({
        title: "Cancelled",
        text: "Your imaginary file is safe :)",
        icon: "error",
      });
    }
  }

  function openDocumentFromEntry(entry: CalendarEntry) {
    if (entry.type !== "document") {
      return;
    }

    saveDocumentDraftToSession(entry);
    router.push("/notes?source=calendar&entry=document");
  }

  return (
    <section className={styles.calendarContent}>
      <div className={styles.calendarLayout}>
        <section className={styles.calendarMain}>
          <header className={styles.calendarHeader}>
            <h1 className={styles.calendarPageTitle}>Calendar</h1>

            <div className={styles.calendarMonthControl}>
              <button
                type="button"
                className={styles.calendarMonthNavButton}
                onClick={() => changeMonth(-1)}
                aria-label="Bulan sebelumnya"
              >
                {"<"}
              </button>

              <p className={styles.calendarMonthLabel}>{monthLabel}</p>

              <button
                type="button"
                className={styles.calendarMonthNavButton}
                onClick={() => changeMonth(1)}
                aria-label="Bulan berikutnya"
              >
                {">"}
              </button>
            </div>
          </header>

          <CalendarGrid cells={cells} selectedDateKey={selectedDateKey} onSelectDate={selectDate} />
        </section>

        <aside
          className={`${styles.calendarPanel} ${
            isMobilePanelOpen ? styles.calendarPanelMobileOpen : ""
          }`}
        >
          <header className={styles.calendarPanelHeader}>
            <div className={styles.calendarPanelHeaderTop}>
              <p className={styles.calendarPanelDate}>{selectedDateLabel}</p>
              <button
                type="button"
                className={styles.calendarPanelCloseButton}
                onClick={closeMobilePanel}
                aria-label="Tutup panel"
              >
                x
              </button>
            </div>
            <p className={styles.calendarPanelMeta}>{selectedDateCountLabel}</p>
          </header>

          {!isFormOpen ? (
            <button type="button" className={styles.calendarAddButton} onClick={openForm}>
              + Tambah catatan / dokumen
            </button>
          ) : (
            <div className={styles.calendarFormWrap}>
              <div className={styles.calendarFormHeader}>
                <p className={styles.calendarFormTitle}>Item baru</p>
                <button
                  type="button"
                  className={styles.calendarFormClose}
                  onClick={closeForm}
                  aria-label="Tutup form"
                >
                  x
                </button>
              </div>

              <div className={styles.calendarTypeSwitch}>
                <button
                  type="button"
                  className={`${styles.calendarTypeButton} ${
                    formState.entryType === "note" ? styles.calendarTypeButtonActive : ""
                  }`}
                  onClick={() => switchEntryType("note")}
                >
                  Catatan
                </button>
                <button
                  type="button"
                  className={`${styles.calendarTypeButton} ${
                    formState.entryType === "document" ? styles.calendarTypeButtonActive : ""
                  }`}
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
                  placeholder={
                    formState.entryType === "document"
                      ? "Judul dokumen..."
                      : "Nama catatan..."
                  }
                  value={formState.title}
                  onChange={(event) => {
                    setFormError("");
                    setFormState((currentFormState) => ({
                      ...currentFormState,
                      title: event.target.value,
                    }));
                  }}
                />
              </label>

              {formState.entryType === "note" ? (
                <>
                  <label className={styles.calendarFieldWrap}>
                    <span className={styles.calendarFieldLabel}>Deskripsi</span>
                    <textarea
                      className={styles.calendarFieldTextarea}
                      placeholder="Tulis detail catatan..."
                      value={formState.body}
                      onChange={(event) => {
                        setFormState((currentFormState) => ({
                          ...currentFormState,
                          body: event.target.value,
                        }));
                      }}
                    />
                  </label>

                  <label className={styles.calendarFieldWrap}>
                    <span className={styles.calendarFieldLabel}>Label</span>
                    <select
                      className={styles.calendarFieldSelect}
                      value={formState.label}
                      onChange={(event) => {
                        setFormState((currentFormState) => ({
                          ...currentFormState,
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

                  <div className={styles.calendarFieldWrap}>
                    <span className={styles.calendarFieldLabel}>Warna</span>
                    <div className={styles.calendarColorRow}>
                      {CALENDAR_COLOR_OPTIONS.map((colorOption) => {
                        const isActive = colorOption.value === formState.color;

                        return (
                          <button
                            key={colorOption.value}
                            type="button"
                            aria-label={`Pilih warna ${colorOption.value}`}
                            className={`${styles.calendarColorButton} ${
                              isActive ? styles.calendarColorButtonActive : ""
                            }`}
                            style={{ backgroundColor: colorOption.hex }}
                            onClick={() => {
                              setFormState((currentFormState) => ({
                                ...currentFormState,
                                color: colorOption.value,
                              }));
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <label className={styles.calendarFieldWrap}>
                    <span className={styles.calendarFieldLabel}>Waktu</span>
                    <input
                      type="time"
                      className={styles.calendarFieldInput}
                      value={formState.time}
                      onChange={(event) => {
                        setFormState((currentFormState) => ({
                          ...currentFormState,
                          time: event.target.value,
                        }));
                      }}
                    />
                  </label>
                </>
              ) : (
                <p className={styles.calendarDocumentHint}>
                  Dokumen hanya membutuhkan judul, lalu otomatis dibuka di halaman Notes.
                </p>
              )}

              {formError ? <p className={styles.calendarFormError}>{formError}</p> : null}

              <button type="button" className={styles.calendarSaveButton} onClick={saveEntry}>
                {formState.entryType === "document" ? "Simpan & buka Notes" : "Simpan catatan"}
              </button>
            </div>
          )}

          <div className={styles.calendarPanelListWrap}>
            {visibleEntries.length > 0 ? (
              <ul className={styles.calendarEntryList}>
                {visibleEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className={`${styles.calendarEntryCard} ${
                      entry.type === "document" ? styles.calendarEntryCardDocument : ""
                    }`}
                  >
                    <div className={styles.calendarEntryMetaRow}>
                      {entry.type === "document" ? (
                        <span className={styles.calendarEntryDocumentTag}>Dokumen</span>
                      ) : (
                        <>
                          <span
                            className={styles.calendarEntryColorDot}
                            style={{ backgroundColor: calendarColorHexMap[entry.color] }}
                          />
                          <span className={styles.calendarEntryLabel}>{entry.label}</span>
                          {entry.time ? (
                            <span className={styles.calendarEntryTime}>{toDisplayTime(entry.time)}</span>
                          ) : null}
                        </>
                      )}
                    </div>

                    <p className={styles.calendarEntryTitle}>{entry.title}</p>
                    {entry.body ? <p className={styles.calendarEntryBody}>{entry.body}</p> : null}

                    <div className={styles.calendarEntryActions}>
                      {entry.type === "document" ? (
                        <button
                          type="button"
                          className={styles.calendarOpenDocumentButton}
                          onClick={() => openDocumentFromEntry(entry)}
                        >
                          Buka Notes
                        </button>
                      ) : (
                        <span className={styles.calendarEntryActionSpacer} />
                      )}

                      <button
                        type="button"
                        className={styles.calendarDeleteEntryButton}
                        onClick={() => {
                          void deleteEntry(entry.id);
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.calendarEmptyState}>
                {normalizedSearch
                  ? "Tidak ada item yang cocok dengan pencarian pada tanggal ini."
                  : "Belum ada catatan untuk tanggal yang dipilih."}
              </p>
            )}
          </div>
        </aside>
      </div>

      {isMobileViewport && isMobilePanelOpen ? (
        <button
          type="button"
          className={styles.calendarMobileBackdrop}
          aria-label="Tutup panel kalender"
          onClick={closeMobilePanel}
        />
      ) : null}
    </section>
  );
}

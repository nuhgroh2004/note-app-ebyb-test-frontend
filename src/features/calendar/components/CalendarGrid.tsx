import { CALENDAR_DAY_LABELS, type CalendarEntry, type CalendarEntryColor } from "../lib/calendarData";
import type { CalendarCell } from "../lib/calendarUtils";
import styles from "../styles/calendar.module.css";

type CalendarGridProps = {
  cells: CalendarCell[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
};

const noteChipColorClassMap: Record<CalendarEntryColor, string> = {
  green: styles.calendarNoteChipGreen,
  blue: styles.calendarNoteChipBlue,
  purple: styles.calendarNoteChipPurple,
  amber: styles.calendarNoteChipAmber,
  red: styles.calendarNoteChipRed,
};

function renderEntryChip(entry: CalendarEntry) {
  if (entry.type === "document") {
    return (
      <span key={entry.id} className={styles.calendarDocumentChip}>
        <span className={styles.calendarDocumentChipTag}>DOC</span>
        <span className={styles.calendarChipText}>{entry.title}</span>
      </span>
    );
  }

  return (
    <span key={entry.id} className={`${styles.calendarNoteChip} ${noteChipColorClassMap[entry.color]}`}>
      <span className={styles.calendarChipText}>{entry.title}</span>
    </span>
  );
}

export default function CalendarGrid({ cells, selectedDateKey, onSelectDate }: CalendarGridProps) {
  return (
    <div className={styles.calendarGridWrap}>
      <div className={styles.calendarDayLabels}>
        {CALENDAR_DAY_LABELS.map((label) => (
          <p key={label} className={styles.calendarDayLabel}>
            {label}
          </p>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {cells.map((cell) => {
          const visibleEntries = cell.entries.slice(0, 2);
          const remainingCount = Math.max(0, cell.entries.length - visibleEntries.length);
          const isSelected = cell.dateKey === selectedDateKey;

          return (
            <button
              key={cell.dateKey}
              type="button"
              className={`${styles.calendarCell} ${
                cell.isOutsideCurrentMonth ? styles.calendarCellOutside : ""
              } ${cell.isToday ? styles.calendarCellToday : ""} ${
                isSelected ? styles.calendarCellSelected : ""
              }`}
              onClick={() => onSelectDate(cell.dateKey)}
              aria-pressed={isSelected}
            >
              <span className={styles.calendarDayNumber}>{cell.dayNumber}</span>

              <span className={styles.calendarCellEntries}>
                {visibleEntries.map((entry) => renderEntryChip(entry))}
                {remainingCount > 0 ? (
                  <span className={styles.calendarMoreChip}>{`+${remainingCount} lagi`}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

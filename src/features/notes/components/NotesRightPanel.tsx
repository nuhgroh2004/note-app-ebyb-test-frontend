import NotesIcon from "./NotesIcon";
import {
  LINE_INSERT_OPTIONS,
  NOTES_INSERT_ITEMS,
  NOTES_RIGHT_TABS,
  TABLE_GRID_COLS,
  TABLE_GRID_ROWS,
} from "./notesEditorData";
import type { NotesRightTab } from "../lib/notesEditorTypes";
import styles from "../styles/notes.module.css";

type TableHoverState = {
  row: number;
  col: number;
} | null;

type NotesRightPanelProps = {
  activeTab: NotesRightTab;
  isOpenOnMobile: boolean;
  tableHover: TableHoverState;
  blockCount: number;
  wordCount: number;
  tableCount: number;
  onSetActiveTab: (tab: NotesRightTab) => void;
  onInsertItem: (itemId: string) => void;
  onInsertLine: (lineId: (typeof LINE_INSERT_OPTIONS)[number]["id"]) => void;
  onInsertPageBreak: () => void;
  onSetTableHover: (nextHover: TableHoverState) => void;
  onInsertTable: (rows: number, cols: number) => void;
};

function getInsertToneClass(tone: "neutral" | "blue" | "green" | "muted") {
  if (tone === "blue") {
    return styles.insertIconBlue;
  }

  if (tone === "green") {
    return styles.insertIconGreen;
  }

  if (tone === "muted") {
    return styles.insertIconMuted;
  }

  return styles.insertIconNeutral;
}

export default function NotesRightPanel({
  activeTab,
  isOpenOnMobile,
  tableHover,
  blockCount,
  wordCount,
  tableCount,
  onSetActiveTab,
  onInsertItem,
  onInsertLine,
  onInsertPageBreak,
  onSetTableHover,
  onInsertTable,
}: NotesRightPanelProps) {
  const insertItems = NOTES_INSERT_ITEMS.filter((item) => item.tab === activeTab);

  return (
    <aside className={`${styles.rightPanel} ${isOpenOnMobile ? styles.rightPanelOpen : ""}`}>
      <div className={styles.rightTabs}>
        {NOTES_RIGHT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.rtab} ${activeTab === tab.id ? styles.rtabActive : ""}`}
            onClick={() => onSetActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.rightBody}>
        <p className={styles.dragHint}>Drag and drop any item to the document.</p>

        <div className={styles.insertList}>
          {insertItems.length > 0 ? (
            insertItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.insertItem}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onInsertItem(item.id)}
              >
                <span className={styles.insertLeft}>
                  <span className={`${styles.insertIcon} ${getInsertToneClass(item.tone)}`}>
                    <NotesIcon name={item.icon} className={styles.icon14} />
                  </span>
                  {item.label}
                </span>
                <span className={styles.dragDots}>...</span>
              </button>
            ))
          ) : (
            <p className={styles.emptyTabHint}>Tidak ada item untuk tab ini.</p>
          )}
        </div>

        {activeTab === "insert" ? (
          <>
            <p className={styles.sectionLabel}>Insert Line</p>
            <div className={styles.lineRow}>
              {LINE_INSERT_OPTIONS.map((line) => (
                <button
                  key={line.id}
                  type="button"
                  className={styles.linePreview}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onInsertLine(line.id)}
                  aria-label={`Insert ${line.label} line`}
                >
                  {line.id === "dots" ? (
                    <span className={styles.dotsRow}>
                      <span className={styles.dot} />
                      <span className={styles.dot} />
                      <span className={styles.dot} />
                    </span>
                  ) : null}
                  {line.id === "dash" ? <span className={styles.dashLine} /> : null}
                  {line.id === "thin" ? <span className={styles.solidThin} /> : null}
                  {line.id === "thick" ? <span className={styles.solidThick} /> : null}
                </button>
              ))}
            </div>

            <p className={styles.sectionLabel}>Insert Page Break</p>
            <button
              type="button"
              className={styles.pageBreakPreview}
              onMouseDown={(event) => event.preventDefault()}
              onClick={onInsertPageBreak}
            >
              <span className={styles.pbLine} />
            </button>

            <p className={styles.sectionLabel}>Insert Table</p>
            <p className={styles.tableCaption}>
              Hover to preview rows and columns, then click to insert.
            </p>

            <div className={styles.tableGrid}>
              {Array.from({ length: TABLE_GRID_ROWS * TABLE_GRID_COLS }).map((_, index) => {
                const row = Math.floor(index / TABLE_GRID_COLS);
                const col = index % TABLE_GRID_COLS;
                const highlighted =
                  tableHover !== null && row <= tableHover.row && col <= tableHover.col;

                return (
                  <button
                    key={`${row}-${col}`}
                    type="button"
                    className={`${styles.tableCell} ${highlighted ? styles.tableCellHighlight : ""}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => onSetTableHover({ row, col })}
                    onMouseLeave={() => onSetTableHover(null)}
                    onClick={() => onInsertTable(row + 1, col + 1)}
                    aria-label={`Insert ${row + 1} by ${col + 1} table`}
                  />
                );
              })}
            </div>
          </>
        ) : null}

        {activeTab === "info" ? (
          <div className={styles.infoPanel}>
            <p className={styles.infoText}>Blocks inserted: {blockCount}</p>
            <p className={styles.infoText}>Words in document: {wordCount}</p>
            <p className={styles.infoText}>Spreadsheet tables: {tableCount}</p>
            <p className={styles.infoText}>Last update: Just now</p>
            <p className={styles.infoText}>Sharing: Private</p>
          </div>
        ) : null}
      </div>

    </aside>
  );
}

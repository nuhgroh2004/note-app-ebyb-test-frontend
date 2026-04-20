import DashboardIcon from "./DashboardIcons";
import styles from "../styles/dashboard.module.css";

type DashboardTopbarProps = {
  searchValue: string;
  onSearchValueChange: (nextValue: string) => void;
};

export default function DashboardTopbar({
  searchValue,
  onSearchValueChange,
}: DashboardTopbarProps) {
  return (
    <header className={styles.topbar}>
      <label className={styles.searchBar}>
        <DashboardIcon name="search" className={styles.navIcon} />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
          placeholder="Open"
          className={styles.searchInput}
        />
      </label>

      <div className={styles.topbarRight}>
        <button type="button" className={styles.bellIcon} aria-label="Notifications">
          <DashboardIcon name="bell" className={styles.navIcon} />
        </button>
      </div>
    </header>
  );
}
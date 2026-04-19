import styles from "../styles/profile.module.css";
import type { ProfileDashboard } from "../lib/profileApi";

type ProfileStatsPanelProps = {
  stats: ProfileDashboard["stats"];
};

export default function ProfileStatsPanel({ stats }: ProfileStatsPanelProps) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.sectionTitle}>Dashboard Stats</h2>
      <p className={styles.sectionCopy}>
        Kartu statistik ini akan dipakai untuk menampilkan data notes dari API profile.
      </p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Notes</div>
          <div className={styles.statValue}>{stats.totalNotes}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Notes Bulan Ini</div>
          <div className={styles.statValue}>{stats.notesThisMonth}</div>
        </div>
      </div>
    </section>
  );
}

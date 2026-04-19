import styles from "../styles/profile.module.css";
import type { ProfileUiModel } from "../lib/profileUiMocks";

type ProfileOverviewPanelProps = {
  profile: ProfileUiModel["profile"];
};

export default function ProfileOverviewPanel({ profile }: ProfileOverviewPanelProps) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.sectionTitle}>Profile Detail</h2>
      <p className={styles.sectionCopy}>
        Ringkasan data akun aktif untuk halaman profile pengguna.
      </p>

      <div className={styles.profileMeta}>
        <div className={styles.metaRow}>
          <div className={styles.metaLabel}>Nama</div>
          <div className={styles.metaValue}>{profile.name}</div>
        </div>
        <div className={styles.metaRow}>
          <div className={styles.metaLabel}>Email</div>
          <div className={styles.metaValue}>{profile.email}</div>
        </div>
        <div className={styles.metaRow}>
          <div className={styles.metaLabel}>Bergabung</div>
          <div className={styles.metaValue}>{profile.joinedAt}</div>
        </div>
      </div>
    </section>
  );
}

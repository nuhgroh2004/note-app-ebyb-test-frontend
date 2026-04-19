import styles from "../styles/profile.module.css";
import type { ProfileUiModel } from "../lib/profileUiMocks";

type UpcomingNotesPanelProps = {
  upcomingNotes: ProfileUiModel["upcomingNotes"];
};

export default function UpcomingNotesPanel({
  upcomingNotes,
}: UpcomingNotesPanelProps) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.sectionTitle}>Upcoming Notes</h2>
      <p className={styles.sectionCopy}>
        Daftar catatan terdekat sebagai preview tampilan dashboard profile.
      </p>

      <div className={styles.upcomingList}>
        {upcomingNotes.map((note) => (
          <article key={note.id} className={styles.upcomingItem}>
            <h3 className={styles.upcomingTitle}>{note.title}</h3>
            <span className={styles.upcomingDate}>{note.noteDate}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

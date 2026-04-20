"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readAuthToken } from "@/features/auth/lib/authSession";
import { getProfileDashboard, type ProfileDashboardItem } from "../lib/profileApi";
import styles from "../styles/profile.module.css";

function formatDateLabel(isoDate: string) {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return "Tanggal tidak valid";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export default function ProfileWorkspace() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<ProfileDashboardItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const userInitial = useMemo(() => {
    const firstChar = dashboardData?.profile.name?.trim().charAt(0).toUpperCase();
    return firstChar || "U";
  }, [dashboardData?.profile.name]);

  useEffect(() => {
    const token = readAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getProfileDashboard();

        if (cancelled) {
          return;
        }

        setDashboardData(data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : "Gagal memuat profil.";
        setErrorMessage(message);
        setDashboardData(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function retryLoadProfile() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getProfileDashboard();
      setDashboardData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal memuat profil.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.profilePage}>
      <section className={styles.profileShell}>
        <header className={styles.profileHeader}>
          <div>
            <p className={styles.profileEyebrow}>User Profile</p>
            <h1 className={styles.profileTitle}>Akun & ringkasan aktivitas</h1>
            <p className={styles.profileSubtitle}>
              Data diambil langsung dari backend profile endpoint dengan autentikasi token.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link href="/dashboard" className={styles.secondaryAction}>
              Dashboard
            </Link>
            <button type="button" className={styles.primaryAction} onClick={() => void retryLoadProfile()}>
              Muat ulang
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className={styles.loadingState}>Memuat data profil...</div>
        ) : errorMessage ? (
          <div className={styles.errorState}>
            <p>{errorMessage}</p>
            <button type="button" className={styles.primaryAction} onClick={() => void retryLoadProfile()}>
              Coba lagi
            </button>
          </div>
        ) : dashboardData ? (
          <>
            <section className={styles.profileCard}>
              <div className={styles.avatarWrap}>{userInitial}</div>

              <div className={styles.profileIdentity}>
                <h2 className={styles.identityName}>{dashboardData.profile.name}</h2>
                <p className={styles.identityEmail}>{dashboardData.profile.email}</p>
              </div>

              <div className={styles.profileMeta}>
                <p>
                  <span className={styles.metaLabel}>Bergabung:</span>{" "}
                  <span>{formatDateLabel(dashboardData.profile.createdAt)}</span>
                </p>
                <p>
                  <span className={styles.metaLabel}>Diperbarui:</span>{" "}
                  <span>{formatDateLabel(dashboardData.profile.updatedAt)}</span>
                </p>
              </div>
            </section>

            <section className={styles.statsGrid}>
              <article className={styles.statCard}>
                <p className={styles.statLabel}>Total catatan</p>
                <p className={styles.statValue}>{dashboardData.stats.totalNotes}</p>
              </article>

              <article className={styles.statCard}>
                <p className={styles.statLabel}>Catatan bulan ini</p>
                <p className={styles.statValue}>{dashboardData.stats.notesThisMonth}</p>
              </article>
            </section>

            <section className={styles.upcomingCard}>
              <h2 className={styles.upcomingTitle}>Upcoming notes</h2>

              {dashboardData.upcomingNotes.length > 0 ? (
                <ul className={styles.upcomingList}>
                  {dashboardData.upcomingNotes.map((note) => (
                    <li key={note.id} className={styles.upcomingItem}>
                      <div>
                        <p className={styles.upcomingName}>{note.title}</p>
                        <p className={styles.upcomingDate}>{formatDateLabel(note.noteDate)}</p>
                      </div>

                      <Link
                        href={`/notes?source=profile&noteId=${note.id}`}
                        className={styles.upcomingAction}
                      >
                        Buka
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyUpcoming}>Belum ada catatan mendatang.</p>
              )}
            </section>
          </>
        ) : null}
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  readAuthToken,
  readAuthUser,
} from "@/features/auth/lib/authSession";
import {
  fetchProfileDashboard,
  fetchProfileDetail,
  type ProfileDashboard,
  type ProfileDetail,
} from "../lib/profileApi";
import ProfileOverviewPanel from "./ProfileOverviewPanel";
import ProfileStatsPanel from "./ProfileStatsPanel";
import UpcomingNotesPanel from "./UpcomingNotesPanel";
import styles from "../styles/profile.module.css";

type FetchStatus = {
  variant: "error";
  message: string;
};

export default function ProfileUiWorkspace() {
  const router = useRouter();
  const token = readAuthToken();
  const sessionUser = readAuthUser();

  const [profileData, setProfileData] = useState<ProfileDetail | null>(null);
  const [dashboardData, setDashboardData] = useState<ProfileDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<FetchStatus | null>(null);

  const loadProfileData = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);

    try {
      const [profile, dashboard] = await Promise.all([
        fetchProfileDetail(token),
        fetchProfileDashboard(token),
      ]);

      setProfileData(profile);
      setDashboardData(dashboard);
      setStatus(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mengambil data profile dashboard";

      setStatus({
        variant: "error",
        message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    void loadProfileData();
  }, [token, router, loadProfileData]);

  const viewProfile = useMemo<ProfileDetail>(() => {
    if (profileData) {
      return profileData;
    }

    const nowIso = new Date().toISOString();

    return {
      id: 0,
      name: sessionUser?.name || "-",
      email: sessionUser?.email || "-",
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  }, [profileData, sessionUser]);

  const viewStats = dashboardData?.stats ?? {
    totalNotes: 0,
    notesThisMonth: 0,
  };

  const viewUpcomingNotes = dashboardData?.upcomingNotes ?? [];

  function onLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  return (
    <main className={styles.profilePage}>
      <section className={styles.shell}>
        <header className={styles.topCard}>
          <div>
            <h1 className={styles.pageTitle}>Profile Dashboard</h1>
            <p className={styles.pageCopy}>
              Halaman profile modular untuk ringkasan akun, statistik notes, dan upcoming
              notes.
            </p>
            <span className={styles.modeTag}>API Connected</span>
          </div>

          <div className={styles.topActions}>
            <Link href="/notes" className={styles.primaryButton}>
              Notes
            </Link>
            <button
              type="button"
              className={styles.ghostButton}
              onClick={() => void loadProfileData()}
              disabled={isLoading}
            >
              Refresh
            </button>
            <Link href="/" className={styles.ghostButton}>
              Landing
            </Link>
            <button type="button" className={styles.dangerButton} onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        {isLoading ? (
          <p className={`${styles.statusInfo} ${styles.statusLoading}`}>
            Memuat data profile dashboard...
          </p>
        ) : null}

        {status ? (
          <p className={`${styles.statusInfo} ${styles.statusError}`}>{status.message}</p>
        ) : null}

        <section className={styles.grid}>
          <ProfileOverviewPanel profile={viewProfile} />
          <ProfileStatsPanel stats={viewStats} />
        </section>

        <UpcomingNotesPanel upcomingNotes={viewUpcomingNotes} />
      </section>
    </main>
  );
}

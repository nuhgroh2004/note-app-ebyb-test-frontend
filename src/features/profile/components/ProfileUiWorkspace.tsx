"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  clearAuthSession,
  readAuthToken,
  readAuthUser,
} from "@/features/auth/lib/authSession";
import { PROFILE_UI_MOCKS } from "../lib/profileUiMocks";
import ProfileOverviewPanel from "./ProfileOverviewPanel";
import ProfileStatsPanel from "./ProfileStatsPanel";
import UpcomingNotesPanel from "./UpcomingNotesPanel";
import styles from "../styles/profile.module.css";

export default function ProfileUiWorkspace() {
  const router = useRouter();
  const token = readAuthToken();
  const sessionUser = readAuthUser();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  const uiModel = useMemo(() => {
    return {
      ...PROFILE_UI_MOCKS,
      profile: {
        ...PROFILE_UI_MOCKS.profile,
        name: sessionUser?.name || PROFILE_UI_MOCKS.profile.name,
        email: sessionUser?.email || PROFILE_UI_MOCKS.profile.email,
      },
    };
  }, [sessionUser]);

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
            <span className={styles.modeTag}>Mode UI-only</span>
          </div>

          <div className={styles.topActions}>
            <Link href="/notes" className={styles.primaryButton}>
              Notes
            </Link>
            <Link href="/" className={styles.ghostButton}>
              Landing
            </Link>
            <button type="button" className={styles.dangerButton} onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className={styles.grid}>
          <ProfileOverviewPanel profile={uiModel.profile} />
          <ProfileStatsPanel stats={uiModel.stats} />
        </section>

        <UpcomingNotesPanel upcomingNotes={uiModel.upcomingNotes} />
      </section>
    </main>
  );
}

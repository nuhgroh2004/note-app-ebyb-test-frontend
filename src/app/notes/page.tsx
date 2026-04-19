"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearAuthSession,
  readAuthToken,
  readAuthUser,
  type SessionUser,
} from "@/features/auth/lib/authSession";
import styles from "./page.module.css";

export default function NotesPage() {
  const router = useRouter();
  const [user] = useState<SessionUser | null>(() => readAuthUser());

  useEffect(() => {
    const token = readAuthToken();

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  function onLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  return (
    <main className={styles.notesPage}>
      <section className={styles.card}>
        <h1 className={styles.heading}>Autentikasi Berhasil</h1>
        <p className={styles.subheading}>
          Anda sudah masuk. Halaman CRUD Notes akan dikembangkan pada tahap fitur Notes berikutnya.
        </p>

        <div className={styles.userBox}>
          <div>Nama: {user?.name ?? "-"}</div>
          <div>Email: {user?.email ?? "-"}</div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.linkButton}>
            Kembali ke Landing
          </Link>

          <button type="button" className={styles.logoutButton} onClick={onLogout}>
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}

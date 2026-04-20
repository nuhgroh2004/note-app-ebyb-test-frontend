"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "../styles/auth.module.css";

type FormStatus = {
  variant: "error";
  message: string;
};

export default function RegisterUiForm() {
  const [status, setStatus] = useState<FormStatus | null>(null);

  function onContinueWithGoogle() {
    setStatus({
      variant: "error",
      message: "Google OAuth belum tersedia pada backend. Silakan hubungkan endpoint OAuth terlebih dahulu.",
    });
  }

  return (
    <>
      <div className={styles.oauthStack}>
        <button
          type="button"
          className={styles.googleButton}
          onClick={onContinueWithGoogle}
        >
          <span className={styles.googleIcon} aria-hidden="true">
            G
          </span>
          <span>Continue with Google</span>
        </button>

        {status ? (
          <p className={`${styles.statusInfo} ${styles.statusError}`}>{status.message}</p>
        ) : null}
      </div>

      <p className={styles.secondaryNav}>
        Sudah punya akun? <Link href="/login">Masuk</Link>
      </p>

      <p className={styles.legalText}>
        Dengan melanjutkan, Anda menyetujui Terms dan Privacy Policy.
      </p>
    </>
  );
}

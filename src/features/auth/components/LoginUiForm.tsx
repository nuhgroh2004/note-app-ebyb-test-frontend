"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginWithApi } from "../lib/authApi";
import { saveAuthSession } from "../lib/authSession";
import {
  validateLoginUi,
  type FieldErrors,
  type LoginUiState,
} from "../lib/authValidators";
import styles from "../styles/auth.module.css";

const initialState: LoginUiState = {
  email: "",
  password: "",
};

type FormStatus = {
  variant: "success" | "error";
  message: string;
};

export default function LoginUiForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginUiState>(initialState);
  const [errors, setErrors] = useState<FieldErrors<keyof LoginUiState>>({});
  const [status, setStatus] = useState<FormStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onChange(field: keyof LoginUiState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setStatus(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateLoginUi(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginWithApi({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      saveAuthSession(result);
      setStatus({
        variant: "success",
        message: "Login berhasil. Mengalihkan ke halaman notes.",
      });
      router.push("/notes");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal";

      setStatus({
        variant: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Link href="/" className={styles.brandLink}>
        Notes App Landing
      </Link>
      <h2 className={styles.formHeading}>Login</h2>
      <p className={styles.formSubheading}>
        Masuk menggunakan email dan password.
      </p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="contoh@email.com"
          />
          <span className={styles.errorText}>{errors.email || ""}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => onChange("password", event.target.value)}
            placeholder="Minimal 8 karakter"
          />
          <span className={styles.errorText}>{errors.password || ""}</span>
        </div>

        {status ? (
          <p
            className={`${styles.statusInfo} ${
              status.variant === "success" ? styles.statusSuccess : styles.statusError
            }`}
          >
            {status.message}
          </p>
        ) : null}

        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Login"}
        </button>
      </form>

      <p className={styles.secondaryNav}>
        Belum punya akun? <Link href="/register">Daftar sekarang</Link>
      </p>
    </>
  );
}

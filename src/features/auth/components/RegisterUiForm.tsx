"use client";

import Link from "next/link";
import { useState } from "react";
import {
  validateRegisterUi,
  type FieldErrors,
  type RegisterUiState,
} from "../lib/authValidators";
import styles from "../styles/auth.module.css";

const initialState: RegisterUiState = {
  name: "",
  email: "",
  password: "",
};

export default function RegisterUiForm() {
  const [form, setForm] = useState<RegisterUiState>(initialState);
  const [errors, setErrors] = useState<FieldErrors<keyof RegisterUiState>>({});
  const [status, setStatus] = useState("");

  function onChange(field: keyof RegisterUiState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setStatus("");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateRegisterUi(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    setStatus(
      "UI register sudah siap. Tahap ini belum memanggil API backend, integrasi akan dilakukan pada commit berikutnya."
    );
  }

  return (
    <>
      <Link href="/" className={styles.brandLink}>
        Notes App Landing
      </Link>
      <h2 className={styles.formHeading}>Register</h2>
      <p className={styles.formSubheading}>
        Buat akun baru menggunakan nama, email, dan password.
      </p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="name">Nama</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="Nama lengkap"
          />
          <span className={styles.errorText}>{errors.name || ""}</span>
        </div>

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

        {status ? <p className={styles.statusInfo}>{status}</p> : null}

        <button type="submit" className={styles.primaryButton}>
          Register (UI)
        </button>
      </form>

      <p className={styles.secondaryNav}>
        Sudah punya akun? <Link href="/login">Masuk di sini</Link>
      </p>
    </>
  );
}

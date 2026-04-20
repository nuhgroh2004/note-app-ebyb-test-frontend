"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerWithApi } from "../lib/authApi";
import { saveAuthSession } from "../lib/authSession";
import {
  type FieldErrors,
  type RegisterUiState,
  validateRegisterUi,
} from "../lib/authValidators";
import GoogleLogo from "./GoogleLogo";
import styles from "../styles/auth.module.css";

const initialState: RegisterUiState = {
  name: "",
  email: "",
  password: "",
};

type FormStatus = {
  variant: "success" | "error";
  message: string;
};

export default function RegisterUiForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterUiState>(initialState);
  const [errors, setErrors] = useState<FieldErrors<keyof RegisterUiState>>({});
  const [status, setStatus] = useState<FormStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onChange(field: keyof RegisterUiState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setStatus(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateRegisterUi(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerWithApi({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      saveAuthSession(result);
      setStatus({
        variant: "success",
        message: "Registrasi berhasil. Mengalihkan ke dashboard.",
      });
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Register gagal";

      setStatus({
        variant: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function onSocialContinue() {
    setStatus({
      variant: "error",
      message: "Registrasi Google belum aktif. Gunakan register manual sementara waktu.",
    });
  }

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.srOnly}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="Your Name"
          />
          <span className={styles.errorText}>{errors.name || ""}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.srOnly}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="Your Email"
          />
          <span className={styles.errorText}>{errors.email || ""}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.srOnly}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => onChange("password", event.target.value)}
            placeholder="Your Password"
          />
          <span className={styles.errorText}>{errors.password || ""}</span>
        </div>

        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Continue"}
        </button>
      </form>

      <div className={styles.formDivider}>
        <span>or</span>
      </div>

      <div className={styles.socialStack}>
        <button
          type="button"
          className={styles.socialButton}
          onClick={onSocialContinue}
        >
          <GoogleLogo className={styles.socialLogo} />
          <span>Continue with Google</span>
        </button>
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

      <p className={styles.legalText}>
        By clicking continue, you accept our Terms and Conditions and Privacy Policy.
      </p>
      <p className={styles.legalText}>
        This site is protected by reCAPTCHA and the Google Terms and Conditions and
        Privacy Policy apply.
      </p>
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithGoogleApi, registerWithApi } from "../lib/authApi";
import { saveAuthSession } from "../lib/authSession";
import {
  type FieldErrors,
  type RegisterUiState,
  validateRegisterUi,
} from "../lib/authValidators";
import {
  ensureGoogleIdentityClient,
  getGoogleClientId,
  type GoogleAccountsId,
  type GoogleCredentialResponse,
} from "../lib/googleIdentity";
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
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const googleClientRef = useRef<GoogleAccountsId | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

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
      setStatus({ variant: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onGoogleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential) {
        setStatus({
          variant: "error",
          message: "Registrasi Google gagal. Credential tidak ditemukan.",
        });
        return;
      }

      setIsGoogleSubmitting(true);
      setStatus(null);

      try {
        const result = await loginWithGoogleApi({ idToken: response.credential });
        saveAuthSession(result);
        setStatus({
          variant: "success",
          message: "Google login berhasil. Mengalihkan ke dashboard.",
        });
        router.push("/dashboard");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Google login gagal";
        setStatus({ variant: "error", message });
      } finally {
        setIsGoogleSubmitting(false);
      }
    },
    [router]
  );

  useEffect(() => {
    let isCancelled = false;

    const initialize = async () => {
      try {
        const client = await ensureGoogleIdentityClient();

        if (isCancelled) return;

        client.initialize({
          client_id: getGoogleClientId(),
          callback: (response) => {
            void onGoogleCredential(response);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        googleClientRef.current = client;

        if (googleButtonRef.current && !googleButtonRef.current.hasChildNodes()) {
          const containerWidth = Math.min(
            googleButtonRef.current.getBoundingClientRect().width || 332,
            400
          );
          client.renderButton(googleButtonRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: Math.max(containerWidth, 280),
          });
        }
      } catch {
        // Silent fail — shown only if user interacts
      }
    };

    void initialize();

    return () => {
      isCancelled = true;
      googleClientRef.current?.cancel?.();
    };
  }, [onGoogleCredential]);

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="register-name" className={styles.srOnly}>
            Name
          </label>
          <input
            id="register-name"
            type="text"
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="Your Name"
            disabled={isGoogleSubmitting}
          />
          <span className={styles.errorText}>{errors.name || ""}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="register-email" className={styles.srOnly}>
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="Your Email"
            disabled={isGoogleSubmitting}
          />
          <span className={styles.errorText}>{errors.email || ""}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="register-password" className={styles.srOnly}>
            Password
          </label>
          <input
            id="register-password"
            type="password"
            value={form.password}
            onChange={(event) => onChange("password", event.target.value)}
            placeholder="Your Password"
            disabled={isGoogleSubmitting}
          />
          <span className={styles.errorText}>{errors.password || ""}</span>
        </div>

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isSubmitting || isGoogleSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </button>
      </form>

      <div className={styles.formDivider}>
        <span>or</span>
      </div>

      {/* Google renders its own button here — clicking it opens the centered Account Chooser popup */}
      <div className={styles.googleButtonWrap}>
        <div ref={googleButtonRef} className={styles.googleButtonInner} />
        {isGoogleSubmitting && (
          <div className={styles.googleButtonOverlay}>
            <span className={styles.googleSpinner} />
            <span>Signing in…</span>
          </div>
        )}
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

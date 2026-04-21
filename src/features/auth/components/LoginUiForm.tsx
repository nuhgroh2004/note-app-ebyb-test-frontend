"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithApi, loginWithGoogleApi } from "../lib/authApi";
import { saveAuthSession } from "../lib/authSession";
import {
  type FieldErrors,
  type LoginUiState,
  validateLoginUi,
} from "../lib/authValidators";
import {
  ensureGoogleIdentityClient,
  getGoogleClientId,
  type GoogleAccountsId,
  type GoogleCredentialResponse,
} from "../lib/googleIdentity";
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
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const googleClientRef = useRef<GoogleAccountsId | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

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
        message: "Login berhasil. Mengalihkan ke dashboard.",
      });
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal";
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
          message: "Login Google gagal. Credential tidak ditemukan.",
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
          <label htmlFor="login-email" className={styles.srOnly}>
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="Your Email"
            disabled={isGoogleSubmitting}
          />
          <span className={styles.errorText}>{errors.email || ""}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="login-password" className={styles.srOnly}>
            Password
          </label>
          <input
            id="login-password"
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

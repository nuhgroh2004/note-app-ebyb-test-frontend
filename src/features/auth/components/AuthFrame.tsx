"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "../styles/auth.module.css";

type AuthFrameProps = {
  title: string;
  copy: string;
  children: ReactNode;
};

export default function AuthFrame({ title, copy, children }: AuthFrameProps) {
  const pathname = usePathname();

  return (
    <main className={styles.authPage}>
      <div className={styles.skyClouds} aria-hidden="true">
        <span className={`${styles.cloud} ${styles.cloudOne}`} />
        <span className={`${styles.cloud} ${styles.cloudTwo}`} />
        <span className={`${styles.cloud} ${styles.cloudThree}`} />
        <span className={`${styles.cloud} ${styles.cloudFour}`} />
        <span className={`${styles.cloud} ${styles.cloudFive}`} />
        <span className={`${styles.cloud} ${styles.cloudSix}`} />
        <span className={`${styles.cloud} ${styles.cloudSeven}`} />
        <span className={`${styles.cloud} ${styles.cloudEight}`} />
      </div>

      <section className={styles.authShell}>
        <div className={styles.shellClouds} aria-hidden="true">
          <span className={`${styles.shellCloud} ${styles.shellCloudOne}`} />
          <span className={`${styles.shellCloud} ${styles.shellCloudTwo}`} />
          <span className={`${styles.shellCloud} ${styles.shellCloudThree}`} />
          <span className={`${styles.shellCloud} ${styles.shellCloudFour}`} />
        </div>

        <section className={styles.formPane}>
          <h1 className={styles.formHeading}>{title}</h1>
          <p className={styles.formSubheading}>{copy}</p>

          <nav className={styles.authSwitch} aria-label="Auth menu">
            <Link
              href="/login"
              className={`${styles.switchLink} ${pathname === "/login" ? styles.switchActive : ""}`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`${styles.switchLink} ${pathname === "/register" ? styles.switchActive : ""}`}
            >
              Register
            </Link>
          </nav>
          {children}
        </section>
      </section>
    </main>
  );
}

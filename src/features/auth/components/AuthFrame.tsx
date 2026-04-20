"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import styles from "../styles/auth.module.css";

type AuthFrameProps = {
  title: string;
  copy: string;
  children: ReactNode;
};

export default function AuthFrame({ title, copy, children }: AuthFrameProps) {
  return (
    <main className={styles.authPage}>
      <section className={styles.authShell}>
        <Link href="/" className={styles.brandLink}>
          <span className={styles.brandMark}>N</span>
          <span>Note App</span>
        </Link>

        <section className={styles.formPane}>
          <h1 className={styles.formHeading}>{title}</h1>
          <p className={styles.formSubheading}>{copy}</p>
          {children}
        </section>
      </section>
    </main>
  );
}

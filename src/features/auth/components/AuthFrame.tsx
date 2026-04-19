"use client";

import type { ReactNode } from "react";
import styles from "../styles/auth.module.css";

type AuthFrameProps = {
  visualTitle: string;
  visualCopy: string;
  visualImage: string;
  children: ReactNode;
};

export default function AuthFrame({
  visualTitle,
  visualCopy,
  visualImage,
  children,
}: AuthFrameProps) {
  return (
    <main className={styles.authPage}>
      <section className={styles.authShell}>
        <aside className={styles.visualPane} style={{ backgroundImage: `url(${visualImage})` }}>
          <div className={styles.visualContent}>
            <span className={styles.visualTag}>Notes App</span>
            <h1 className={styles.visualTitle}>{visualTitle}</h1>
            <p className={styles.visualCopy}>{visualCopy}</p>
          </div>
        </aside>

        <section className={styles.formPane}>{children}</section>
      </section>
    </main>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type HeroSectionProps = {
  heroReady: boolean;
};

const HERO_PILLS = ["Docs", "Tasks", "Calendar", "Whiteboards", "Daily Notes"];

export default function HeroSection({ heroReady }: HeroSectionProps) {
  return (
    <section className="hero" id="hero">
      <div className="hero-noise" aria-hidden="true" />
      <div className="shell hero-shell">
        <div className="hero-copy">
          <motion.p
            className="hero-kicker"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={
              heroReady
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 20, filter: "blur(8px)" }
            }
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            NOTESPACE
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={
              heroReady
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 28, filter: "blur(10px)" }
            }
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Your space for <span className="hero-title-accent">notes, tasks,</span> and big ideas
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={
              heroReady
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 22, filter: "blur(8px)" }
            }
            transition={{ duration: 1, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            Capture ideas fast, shape them into polished documents, and keep tasks
            connected to the work that matters.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={
              heroReady
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 20, filter: "blur(8px)" }
            }
            transition={{ duration: 0.9, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/register" className="waitlist-btn solid">
              Continue on web
            </Link>
            <Link href="/login" className="waitlist-btn outline">
              Log in
            </Link>
          </motion.div>

          <motion.div
            className="hero-pill-row"
            initial={{ opacity: 0, y: 16 }}
            animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.75, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
          >
            {HERO_PILLS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 28, scale: 0.985, filter: "blur(10px)" }}
          animate={
            heroReady
              ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, y: 28, scale: 0.985, filter: "blur(10px)" }
          }
          transition={{ duration: 1.2, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
        >
          <article className="hero-mock hero-mock-main">
            <p className="hero-mock-label">Daily Notes</p>
            <h3>Monday Focus</h3>
            <ul>
              <li>Review sprint goals</li>
              <li>Draft team update</li>
              <li>Capture next decisions</li>
            </ul>
          </article>

          <article className="hero-mock hero-mock-side">
            <p className="hero-mock-label">Tasks</p>
            <h3>Inbox</h3>
            <div className="mock-check">Sync design handoff</div>
            <div className="mock-check">Prepare launch notes</div>
          </article>

          <article className="hero-mock hero-mock-mini">
            <p className="hero-mock-label">Calendar</p>
            <h3>20 Apr</h3>
          </article>
        </motion.div>
      </div>
    </section>
  );
}

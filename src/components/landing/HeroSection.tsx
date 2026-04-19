"use client";

import { motion } from "framer-motion";

type HeroSectionProps = {
  heroReady: boolean;
};

export default function HeroSection({ heroReady }: HeroSectionProps) {
  return (
    <section className="hero" id="hero">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source
          src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-overlay" />

      <div className="hero-content shell">
        <div className="hero-title-wrap">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 36, filter: "blur(14px)" }}
            animate={
              heroReady
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 36, filter: "blur(14px)" }
            }
            transition={{ duration: 1.45, delay: 0.16, ease: [0.19, 1, 0.22, 1] }}
          >
            Notes App
          </motion.h1>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 36, filter: "blur(14px)" }}
            animate={
              heroReady
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 36, filter: "blur(14px)" }
            }
            transition={{ duration: 1.45, delay: 0.48, ease: [0.19, 1, 0.22, 1] }}
          >
            Fullstack <span className="serif-accent">Landing</span>
          </motion.h1>
        </div>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
          animate={
            heroReady
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 26, filter: "blur(10px)" }
          }
          transition={{ duration: 1.2, delay: 0.82, ease: [0.19, 1, 0.22, 1] }}
        >
          Aplikasi catatan dengan fitur register, login, CRUD notes, kalender
          catatan, dan dashboard profile.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 24, scale: 0.985, filter: "blur(10px)" }}
          animate={
            heroReady
              ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, y: 24, scale: 0.985, filter: "blur(10px)" }
          }
          transition={{ duration: 1.24, delay: 1.06, ease: [0.19, 1, 0.22, 1] }}
        >
          <p>
            Fokus pada fitur inti tanpa tambahan yang di luar scope: autentikasi,
            notes management, kalender, dan profil.
          </p>
          <a href="#features" className="waitlist-btn solid">
            Lihat Fitur
          </a>
        </motion.div>
      </div>
    </section>
  );
}

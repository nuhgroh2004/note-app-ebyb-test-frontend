"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="top-nav-wrap">
      <nav className="top-nav">
        <a href="#hero" className="brand" onClick={() => setMobileMenuOpen(false)}>
          Notes App
        </a>
        <div className="desktop-nav-links">
          <a href="#features">Fitur</a>
          <a href="#services">API</a>
          <a href="#faq">FAQ</a>
        </div>
        <a className="waitlist-btn desktop-only" href="/login">
          Login
        </a>
        <button
          type="button"
          className="menu-btn"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
          >
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>
              Fitur
            </a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>
              API
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
            <a href="/login" onClick={() => setMobileMenuOpen(false)}>
              Login
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

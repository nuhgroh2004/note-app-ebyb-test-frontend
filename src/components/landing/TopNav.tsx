"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Use Cases", href: "#workflows" },
  { label: "Structure", href: "#structure" },
  { label: "Pricing", href: "#pricing" },
];

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="top-nav-wrap">
      <nav className="top-nav">
        <a href="#hero" className="brand" onClick={() => setMobileMenuOpen(false)}>
          <span className="brand-mark">N</span>
          <span className="brand-text">NoteFlow</span>
        </a>
        <div className="desktop-nav-links">
          {NAV_LINKS.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-actions desktop-only">
          <Link className="nav-login" href="/login">
            Log in
          </Link>
          <Link className="waitlist-btn solid" href="/register">
            Try free
          </Link>
        </div>
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
            {NAV_LINKS.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              Log in
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              Try free
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

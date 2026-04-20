"use client";

import Link from "next/link";

const FOOTER_GROUPS = [
  {
    title: "Product",
    links: ["Write", "Plan", "Organize", "Customize", "Pricing"],
  },
  {
    title: "Community",
    links: ["Template Gallery", "Learn", "Release Notes", "Reddit", "Slack"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Security", "Privacy"],
  },
  {
    title: "Download",
    links: ["Web", "Windows", "Mac", "iPhone", "Android"],
  },
];

export default function FooterSection() {
  return (
    <footer className="landing-footer" id="footer-cta">
      <div className="shell footer-shell">
        <div className="footer-top">
          <h2>Let&apos;s get started</h2>
          <p>Start for free and build your personal workspace in minutes.</p>
          <div className="footer-top-actions">
            <Link href="/register" className="waitlist-btn solid">
              Continue on web
            </Link>
            <Link href="/login" className="waitlist-btn outline dark-outline">
              Log in
            </Link>
          </div>
        </div>

        <div className="footer-links-grid">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              {group.links.map((link) => (
                <a key={link} href="#hero">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© 2026 NoteFlow Workspace.</span>
          <span>Landing redesign inspired by modern notes-product patterns.</span>
        </div>
      </div>
    </footer>
  );
}

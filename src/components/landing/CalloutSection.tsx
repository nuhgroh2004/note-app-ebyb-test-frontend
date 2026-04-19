"use client";

import Reveal from "./Reveal";

export default function CalloutSection() {
  return (
    <section className="loud-section">
      <div className="loud-bg" />
      <div className="shell loud-content">
        <Reveal>
          <h2>Kelola catatan harian dari autentikasi sampai dashboard.</h2>
          <a href="#footer-cta" className="waitlist-btn solid">
            Coba Alur Landing
          </a>
        </Reveal>
        <Reveal delay={0.1} className="chip-cloud">
          <span>Register</span>
          <span>Login</span>
          <span>Create</span>
          <span>Read</span>
          <span>Update</span>
          <span>Delete</span>
          <span>Calendar Date</span>
          <span>Profile Dashboard</span>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

export default function FooterSection() {
  return (
    <footer className="shell" id="footer-cta">
      <div className="footer-card">
        <h2 className="footer-big-title">Notes App Landing Page</h2>
        <div className="footer-grid">
          <div>
            <h3>Notes App</h3>
            <p>Landing page fokus pada fitur backend yang sudah tersedia.</p>
            <p>
              Register/Login, CRUD catatan, catatan berdasarkan tanggal, dan
              profile dashboard.
            </p>
            <a href="#hero" className="waitlist-btn solid footer-btn">
              Login
            </a>
          </div>
          <div className="footer-links-grid">
            <div>
              <h4>Menu</h4>
              <a href="#hero">Home</a>
              <a href="#features">Fitur</a>
              <a href="#services">API Scope</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <h4>Feature</h4>
              <a href="/login">Auth</a>
              <a href="#features">Notes CRUD</a>
              <a href="#features">Calendar Notes</a>
            </div>
            <div>
              <h4>Profile</h4>
              <a href="#services">Dashboard</a>
              <a href="#services">Summary</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Notes App. All rights reserved.</span>
          <span>Technical Test Landing</span>
        </div>
      </div>
    </footer>
  );
}

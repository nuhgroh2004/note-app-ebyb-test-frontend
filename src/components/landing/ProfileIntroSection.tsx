"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export default function ProfileIntroSection() {
  return (
    <section className="light-block" id="difference">
      <div className="shell section-grid">
        <Reveal>
          <div className="pill">Overview</div>
          <h2 className="section-title dark-text">Landing Page Sesuai Scope Notes App</h2>
          <p className="section-copy dark-copy">
            Bagian frontend ini menampilkan fitur yang benar-benar tersedia pada
            backend: autentikasi user, CRUD catatan, filter tanggal catatan, dan
            dashboard profile.
          </p>
          <p className="section-copy dark-copy">
            Struktur halaman dibuat fokus untuk memperjelas alur penggunaan Notes
            App dari login hingga monitoring ringkasan catatan.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="preview-card">
            <Image
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80"
              alt="Desk with notebook and laptop"
              width={1400}
              height={980}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

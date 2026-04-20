"use client";

import Link from "next/link";
import Reveal from "./Reveal";

const THEME_PRESETS = [
  "Crimson Coil",
  "Writer",
  "Shape Shift",
  "Little World",
  "Blurry Bloom",
  "Paper Mint",
];

export default function CalloutSection() {
  return (
    <section className="customize-section" id="customize">
      <div className="shell customize-shell">
        <Reveal className="customize-head">
          <p className="section-kicker">Customization</p>
          <h2>Make your workspace unmistakably yours</h2>
          <p>
            Choose visual styles that match your mood while keeping your notes and
            tasks clear and readable.
          </p>
          <Link href="/register" className="text-link">
            Explore all themes
          </Link>
        </Reveal>

        <div className="theme-grid">
          {THEME_PRESETS.map((item, index) => (
            <Reveal key={item} delay={index * 0.06}>
              <article className={`theme-card theme-tone-${(index % 6) + 1}`}>
                <span>{item}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

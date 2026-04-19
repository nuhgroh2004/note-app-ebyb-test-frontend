"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import type { FeatureCardItem } from "./content";

type FeaturesSectionProps = {
  cards: FeatureCardItem[];
};

export default function FeaturesSection({ cards }: FeaturesSectionProps) {
  return (
    <section className="features-dark" id="features">
      <div className="shell features-shell">
        <Reveal className="features-intro">
          <h2 className="section-title">Feature Preview</h2>
          <p className="section-copy">
            Visual section ini menggunakan image yang relevan dengan fitur login,
            notes CRUD, kalender catatan, dan profile dashboard.
          </p>
          <a href="#services" className="waitlist-btn solid">
            Lanjut Lihat API Scope
          </a>
        </Reveal>

        <div className="features-static-grid">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06}>
              <article className="feature-card feature-card-static">
                <Image src={card.image} alt={card.alt} width={1200} height={820} />
                <div className="feature-card-body">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

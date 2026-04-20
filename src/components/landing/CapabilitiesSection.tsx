"use client";

import Reveal from "./Reveal";
import type { CapabilityItem } from "./content";

type CapabilitiesSectionProps = {
  items: CapabilityItem[];
};

export default function CapabilitiesSection({ items }: CapabilitiesSectionProps) {
  return (
    <section className="structure-section" id="structure">
      <div className="shell structure-shell">
        <Reveal className="structure-head">
          <p className="section-kicker">Structure that adapts to your thinking</p>
          <h2 className="section-title dark-text">
            Choose the organization style that matches how your mind works
          </h2>
        </Reveal>

        <div className="structure-grid">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className={`structure-card structure-tone-${(index % 3) + 1}`}>
                <p className="structure-index">0{index + 1}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className="structure-detail">{item.detail}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Reveal from "./Reveal";

type HighlightsSectionProps = {
  items: Array<{
    title: string;
    description: string;
  }>;
};

export default function HighlightsSection({ items }: HighlightsSectionProps) {
  return (
    <section className="persona-section">
      <div className="shell">
        <Reveal>
          <p className="section-kicker">How people use Noteflow</p>
          <h2 className="big-title">Workflows for every style of thinking</h2>
        </Reveal>

        <div className="persona-grid">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className={`persona-card persona-tone-${(index % 5) + 1}`}>
                <div className="persona-badge">0{index + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

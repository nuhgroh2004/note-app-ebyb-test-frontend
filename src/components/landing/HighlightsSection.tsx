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
    <section className="shell designed-section">
      <Reveal>
        <p className="small-lead">Fitur utama Notes App</p>
        <h2 className="big-title">Dibangun sesuai requirement technical test</h2>
      </Reveal>

      <div className="three-cards">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.08}>
            <article className="info-card">
              <div className="icon-dot">0{index + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

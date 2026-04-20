"use client";

import Reveal from "./Reveal";

const PRODUCT_CARDS = [
  {
    title: "Docs",
    description: "Write beautifully formatted notes and long-form documents with ease.",
  },
  {
    title: "Tasks",
    description: "Embed actionable checklists directly inside your documents.",
  },
  {
    title: "Calendar",
    description: "Tie plans to dates so important tasks stay visible and timely.",
  },
  {
    title: "Whiteboards",
    description: "Map ideas visually before turning them into structured plans.",
  },
  {
    title: "Daily Notes",
    description: "Capture quick thoughts, highlights, and personal progress every day.",
  },
];

export default function ProfileIntroSection() {
  return (
    <section className="product-section" id="product">
      <div className="shell product-shell">
        <Reveal className="product-head">
          <p className="section-kicker">Everything in one place</p>
          <h2 className="section-title dark-text">
            Noteflow is not for one thing, it is for all your things.
          </h2>
          <p className="section-copy dark-copy">
            Bring writing, planning, and execution together so your ideas never lose
            context while moving from concept to action.
          </p>
        </Reveal>

        <div className="product-grid">
          {PRODUCT_CARDS.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="product-card">
                <div className="product-icon">{item.title.charAt(0)}</div>
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

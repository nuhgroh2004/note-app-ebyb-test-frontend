"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import type { FaqItem } from "./content";

type FaqSectionProps = {
  items: FaqItem[];
};

export default function FaqSection({ items }: FaqSectionProps) {
  return (
    <section className="pricing-section" id="pricing">
      <div className="shell pricing-shell">
        <Reveal className="pricing-head">
          <p className="section-kicker">Your pace, your plan</p>
          <h2 className="section-title dark-text">
            Use it occasionally or make it part of your daily flow
          </h2>
        </Reveal>

        <div className="pricing-grid">
          {items.map((item, index) => {
            return (
              <Reveal
                key={item.question}
                delay={index * 0.08}
              >
                <article className={`pricing-card ${index === 1 ? "is-featured" : ""}`}>
                  {item.badge ? <p className="pricing-badge">{item.badge}</p> : null}
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                  <p className="pricing-value">{item.price}</p>
                  <Link href="/register" className="waitlist-btn solid">
                    {item.cta}
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import type { FeatureCardItem } from "./content";

type FeaturesSectionProps = {
  cards: FeatureCardItem[];
};

export default function FeaturesSection({ cards }: FeaturesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [cards.length]);

  const active = cards[activeIndex];

  return (
    <section className="workflow-section" id="workflows">
      <div className="shell workflow-shell">
        <Reveal className="workflow-head">
          <p className="section-kicker">From first thought to final form</p>
          <h2 className="section-title dark-text">
            Three focused modes for writing, building, and planning
          </h2>
        </Reveal>

        <div className="workflow-layout">
          <Reveal className="workflow-tabs" delay={0.08}>
            {cards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={index === activeIndex ? "active" : ""}
              >
                <span>{card.tag}</span>
                <h3>{card.title}</h3>
              </button>
            ))}
          </Reveal>

          <Reveal className="workflow-preview" delay={0.14}>
            <div className="workflow-preview-image-wrap">
              <Image src={active.image} alt={active.alt} width={1400} height={980} />
              <p className="workflow-badge">{active.tag}</p>
            </div>

            <div className="workflow-preview-body">
              <p>{active.description}</p>
              <ul>
                {active.bullets.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link href="/register" className="text-link">
                Learn more
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

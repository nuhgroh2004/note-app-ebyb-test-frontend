"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import type { CapabilityItem } from "./content";

type CapabilitiesSectionProps = {
  items: CapabilityItem[];
};

export default function CapabilitiesSection({ items }: CapabilitiesSectionProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [items.length]);

  return (
    <section className="ai-section" id="services">
      <div className="shell ai-shell">
        <Reveal>
          <div className="pill">API Scope</div>
          <h2 className="section-title">
            Endpoint REST API yang ditampilkan pada landing ini hanya mencakup
            fitur yang tersedia di backend Notes App.
          </h2>
        </Reveal>

        <div className="ai-content">
          <Reveal className="ai-menu" delay={0.1}>
            {items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActive(index)}
                className={index === active ? "active" : ""}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </button>
            ))}
          </Reveal>

          <Reveal className="ai-preview" delay={0.2}>
            <Image
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=80"
              alt="Code editor for API development"
              width={1000}
              height={1500}
            />
            <div className="ai-preview-footer">
              <span className="active-dot" />
              <span>{active + 1}/{items.length}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

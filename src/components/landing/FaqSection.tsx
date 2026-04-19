"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Reveal from "./Reveal";
import type { FaqItem } from "./content";

type FaqSectionProps = {
  items: FaqItem[];
};

export default function FaqSection({ items }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section" id="faq">
      <div className="shell faq-shell">
        <Reveal>
          <div className="pill">FAQ</div>
          <h2 className="section-title dark-text">Pertanyaan umum tentang fitur Notes App</h2>
        </Reveal>

        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.article
                key={item.question}
                className="faq-item"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <button
                  type="button"
                  className="faq-head"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <span className={`faq-plus ${isOpen ? "open" : ""}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.p
                      className="faq-answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {item.answer}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

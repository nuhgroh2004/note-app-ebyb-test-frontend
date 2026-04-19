"use client";

import { AnimatePresence, motion } from "framer-motion";

type IntroPhase = "enter" | "exit" | "done";

type IntroOverlayProps = {
  visible: boolean;
  phase: IntroPhase;
  words: string[];
  timing: {
    wordStagger: number;
    wordDelay: number;
    wordDuration: number;
    wordExitDuration: number;
    overlayExitDuration: number;
  };
};

export default function IntroOverlay({ visible, phase, words, timing }: IntroOverlayProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="intro-overlay"
          initial={{ y: 0, opacity: 1 }}
          animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: timing.overlayExitDuration,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="intro-line"
            initial="hidden"
            animate={phase === "enter" ? "visible" : "exit"}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: timing.wordStagger,
                  delayChildren: timing.wordDelay,
                },
              },
              exit: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {words.map((word) => (
              <motion.span
                key={word}
                className="intro-word"
                variants={{
                  hidden: {
                    opacity: 0,
                    x: -22,
                    filter: "blur(12px)",
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: timing.wordDuration,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                  exit: {
                    opacity: 0,
                    x: 26,
                    filter: "blur(10px)",
                    transition: {
                      duration: timing.wordExitDuration,
                      ease: [0.4, 0, 1, 1],
                    },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

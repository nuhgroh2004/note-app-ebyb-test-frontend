"use client";

import Lenis from "lenis";
import { useEffect, useState } from "react";
import CapabilitiesSection from "@/components/landing/CapabilitiesSection";
import CalloutSection from "@/components/landing/CalloutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FooterSection from "@/components/landing/FooterSection";
import FaqSection from "@/components/landing/FaqSection";
import HeroSection from "@/components/landing/HeroSection";
import HighlightsSection from "@/components/landing/HighlightsSection";
import IntroOverlay from "@/components/landing/IntroOverlay";
import ProfileIntroSection from "@/components/landing/ProfileIntroSection";
import TopNav from "@/components/landing/TopNav";
import {
  capabilityPanels,
  faqItems,
  featureCards,
  introWords,
  quickPoints,
} from "@/components/landing/content";

const INTRO_TIMING = {
  wordDelay: 0.38,
  wordStagger: 0.34,
  wordDuration: 0.72,
  wordExitDuration: 0.44,
  holdAfterWords: 0.72,
  overlayExitDuration: 1.05,
  heroGap: 0.16,
} as const;

export default function Home() {
  const [introPhase, setIntroPhase] = useState<"enter" | "exit" | "done">("enter");
  const [introVisible, setIntroVisible] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const textRevealDoneAt =
      (INTRO_TIMING.wordDelay +
        INTRO_TIMING.wordStagger * (introWords.length - 1) +
        INTRO_TIMING.wordDuration) *
      1000;

    const startExitAt = textRevealDoneAt + INTRO_TIMING.holdAfterWords * 1000;
    const overlayGoneAt = startExitAt + INTRO_TIMING.overlayExitDuration * 1000;

    const startExitTimer = window.setTimeout(() => {
      setIntroPhase("exit");
    }, startExitAt);

    const hideOverlayTimer = window.setTimeout(() => {
      setIntroVisible(false);
      setIntroPhase("done");
    }, overlayGoneAt);

    const showHeroTimer = window.setTimeout(() => {
      setHeroReady(true);
    }, overlayGoneAt + INTRO_TIMING.heroGap * 1000);

    return () => {
      window.clearTimeout(startExitTimer);
      window.clearTimeout(hideOverlayTimer);
      window.clearTimeout(showHeroTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = introVisible ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [introVisible]);

  return (
    <div className="fixa-page">
      <IntroOverlay
        visible={introVisible}
        phase={introPhase}
        words={introWords}
        timing={INTRO_TIMING}
      />

      <TopNav />
      <HeroSection heroReady={heroReady} />
      <ProfileIntroSection />
      <HighlightsSection items={quickPoints} />
      <FeaturesSection cards={featureCards} />
      <CapabilitiesSection items={capabilityPanels} />
      <CalloutSection />
      <FaqSection items={faqItems} />
      <FooterSection />
    </div>
  );
}

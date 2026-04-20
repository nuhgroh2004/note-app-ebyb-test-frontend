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
import ProfileIntroSection from "@/components/landing/ProfileIntroSection";
import TopNav from "@/components/landing/TopNav";
import {
  capabilityPanels,
  faqItems,
  featureCards,
  quickPoints,
} from "@/components/landing/content";

export default function Home() {
  const [heroReady] = useState(true);

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

  return (
    <div className="craft-page">
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

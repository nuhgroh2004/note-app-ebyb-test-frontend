"use client";

import Lenis from "lenis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CapabilitiesSection from "@/components/landing/CapabilitiesSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FooterSection from "@/components/landing/FooterSection";
import HeroSection from "@/components/landing/HeroSection";
import HighlightsSection from "@/components/landing/HighlightsSection";
import TopNav from "@/components/landing/TopNav";
import { readAuthToken } from "@/features/auth/lib/authSession";
import {
  capabilityPanels,
  featureCards,
  quickPoints,
} from "@/components/landing/content";

export default function Home() {
  const router = useRouter();
  const [heroReady] = useState(true);

  useEffect(() => {
    const token = readAuthToken();

    if (token) {
      router.replace("/dashboard");
      return;
    }

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
  }, [router]);

  return (
    <div className="craft-page">
      <TopNav />
      <HeroSection heroReady={heroReady} />
      <HighlightsSection items={quickPoints} />
      <FeaturesSection cards={featureCards} />
      <CapabilitiesSection items={capabilityPanels} />
      <FooterSection />
    </div>
  );
}

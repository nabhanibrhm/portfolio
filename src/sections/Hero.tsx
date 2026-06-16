"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import OrbitalNav from "@/components/ui/OrbitalNav";
import { MagicTextReveal } from "@/components/ui/magic-text-reveal";

const HeroShader = dynamic(() => import("@/components/three/HeroShader"), {
  ssr: false,
});

// Layout stacks (full-width text) below 1280px and switches to the side-by-side
// row (narrow text column next to the orbital nav) at >= 1280px ("wide").
type Breakpoint = "sm" | "md" | "wide";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("wide");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < 640 ? "sm" : w < 1280 ? "md" : "wide");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

const revealStyle = {
  backgroundColor: "transparent",
  border: "none",
  backdropFilter: "none",
  borderRadius: 0,
  minWidth: 0,
  minHeight: 0,
  cursor: "default",
} as const;

export default function Hero() {
  const bp = useBreakpoint();
  const px = (sm: number, md: number, wide: number) =>
    bp === "sm" ? sm : bp === "md" ? md : wide;

  // Start the particle → solid-font reveal once the preloader has finished.
  const [revealReady, setRevealReady] = useState(false);
  useEffect(() => {
    const onDone = () => setRevealReady(true);
    window.addEventListener("preloader:complete", onDone);
    // Safety net in case the event is missed (e.g. preloader skipped).
    const fallback = window.setTimeout(onDone, 8000);
    return () => {
      window.removeEventListener("preloader:complete", onDone);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <HeroShader />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-start gap-8 px-6 pb-8 pt-16 xl:flex-row xl:justify-between xl:gap-8 xl:pb-0 xl:pt-0">
        {/* Greeting — left */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex w-full max-w-xl flex-col items-center gap-1 xl:flex-1 xl:items-start"
        >
          {/* Kicker */}
          <MagicTextReveal
            text="DATA ENGINEER · JAKARTA, ID"
            color="rgba(225, 220, 201, 0.5)"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontSize={px(11, 13, 12)}
            fontWeight={500}
            spread={10}
            speed={0.5}
            density={5}
            padding={12}
            autoReveal
            revealStart={revealReady}
            style={revealStyle}
          />
          {/* Greeting */}
          <MagicTextReveal
            text="Hello! I'm"
            color="rgba(225, 220, 201, 1)"
            fontSize={px(28, 44, 30)}
            fontWeight={600}
            spread={12}
            speed={0.5}
            density={5}
            padding={14}
            autoReveal
            revealStart={revealReady}
            style={revealStyle}
          />
          {/* Name */}
          <MagicTextReveal
            text="Luthfi Nabhan Ibrahim"
            color="rgba(225, 220, 201, 1)"
            fontSize={px(30, 46, 28)}
            fontWeight={600}
            spread={14}
            speed={0.5}
            density={5}
            padding={14}
            autoReveal
            revealStart={revealReady}
            style={revealStyle}
          />
          {/* Tagline */}
          <MagicTextReveal
            text="Feel free to dig my portfolio!"
            color="rgba(225, 220, 201, 0.6)"
            fontSize={px(15, 18, 15)}
            fontWeight={400}
            spread={10}
            speed={0.5}
            density={5}
            padding={12}
            autoReveal
            revealStart={revealReady}
            style={revealStyle}
          />
        </motion.div>

        {/* Orbital nav — right */}
        <div className="shrink-0">
          <OrbitalNav />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import OrbitalNav from "@/components/ui/OrbitalNav";
import { MagicTextReveal } from "@/components/ui/magic-text-reveal";

const HeroShader = dynamic(() => import("@/components/three/HeroShader"), {
  ssr: false,
});

// Layout stacks (full-width text) below 1536px and switches to the side-by-side
// row (text column next to the orbital nav) at >= 1536px ("wide").
type Breakpoint = "sm" | "md" | "wide";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("wide");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < 640 ? "sm" : w < 1536 ? "md" : "wide");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

// The canvas renderer can't read CSS variables, so resolve the Satoshi family
// string once on the client and pass it to every particle line.
function useResolvedFont(): string {
  const [family, setFamily] = useState("system-ui, sans-serif");
  useEffect(() => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-satoshi")
      .trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a resolved CSS var after mount
    if (v) setFamily(`${v}, system-ui, sans-serif`);
  }, []);
  return family;
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
  const fontFamily = useResolvedFont();
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col items-center justify-center gap-8 px-6 py-10 2xl:flex-row 2xl:justify-between 2xl:gap-8 2xl:py-0">
        {/* Greeting — left */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex w-full max-w-2xl flex-col items-center gap-0 2xl:flex-1 2xl:items-start"
        >
          {/* Kicker */}
          <MagicTextReveal
            text="DATA ENGINEER · JAKARTA, ID"
            color="rgba(225, 220, 201, 0.5)"
            fontFamily={fontFamily}
            fontSize={px(11, 13, 16)}
            fontWeight={500}
            spread={8}
            speed={0.5}
            density={5}
            padding={8}
            autoReveal
            revealStart={revealReady}
            style={revealStyle}
          />
          {/* Greeting */}
          <MagicTextReveal
            text="Hello! I'm"
            color="rgba(225, 220, 201, 1)"
            fontFamily={fontFamily}
            fontSize={px(16, 22, 30)}
            fontWeight={600}
            spread={8}
            speed={0.5}
            density={5}
            padding={8}
            autoReveal
            revealStart={revealReady}
            style={revealStyle}
          />
          {/* Name */}
          <MagicTextReveal
            text="Luthfi Nabhan Ibrahim"
            color="rgba(225, 220, 201, 1)"
            fontFamily={fontFamily}
            fontSize={px(30, 46, 44)}
            fontWeight={800}
            spread={12}
            speed={0.5}
            density={5}
            padding={10}
            autoReveal
            revealStart={revealReady}
            style={revealStyle}
          />
          {/* Tagline */}
          <MagicTextReveal
            text="Feel free to dig my portfolio!"
            color="rgba(225, 220, 201, 0.6)"
            fontFamily={fontFamily}
            fontSize={px(15, 18, 22)}
            fontWeight={400}
            spread={8}
            speed={0.5}
            density={5}
            padding={8}
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

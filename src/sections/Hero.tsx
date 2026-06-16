"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import OrbitalNav from "@/components/ui/OrbitalNav";

const HeroShader = dynamic(() => import("@/components/three/HeroShader"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <HeroShader />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-center gap-4 px-6 py-8 md:flex-row md:justify-between md:gap-8 md:py-0">
        {/* Greeting — left */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md text-center md:flex-1 md:text-left"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/50 md:text-sm">
            Data Engineer · Jakarta, ID
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl">
            Hello! I&apos;m Luthfi Nabhan Ibrahim.
          </h1>
          <p className="mt-5 text-base text-foreground/60 md:text-lg">
            Feel free to dig my portfolio!
          </p>
        </motion.div>

        {/* Orbital nav — right */}
        <div className="shrink-0">
          <OrbitalNav />
        </div>
      </div>
    </section>
  );
}

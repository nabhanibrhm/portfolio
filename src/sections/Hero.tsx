"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { site } from "@/data/site";

const HeroShader = dynamic(() => import("@/components/three/HeroShader"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <HeroShader />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-sm uppercase tracking-[0.2em] text-foreground/60"
        >
          {site.location} · {site.role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-7xl"
        >
          {site.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 max-w-2xl text-balance text-lg text-foreground/70 md:text-xl"
        >
          {site.tagline}
        </motion.p>

      </div>
    </section>
  );
}

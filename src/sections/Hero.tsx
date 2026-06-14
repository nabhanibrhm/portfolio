"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Image from "next/image";

const HeroShader = dynamic(() => import("@/components/three/HeroShader"), {
  ssr: false,
});

const NAV_LINKS = [
  { href: "#about", label: "About", angleDeg: -90 },
  { href: "#projects", label: "Projects", angleDeg: 30 },
  { href: "#contact", label: "Contact", angleDeg: 150 },
];

const RADIUS = 230;

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

      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6">
        <div className="relative flex items-center justify-center" style={{ width: RADIUS * 2 + 120, height: RADIUS * 2 + 120 }}>
          {/* orbit ring */}
          <div
            className="absolute rounded-full border border-dashed border-foreground/10"
            style={{ width: RADIUS * 2, height: RADIUS * 2 }}
          />

          {/* memoji */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <Image
              src="/memoji.png"
              alt="Luthfi Nabhan Ibrahim memoji"
              width={340}
              height={340}
              priority
            />
          </motion.div>

          {/* orbiting nav links */}
          {NAV_LINKS.map(({ href, label, angleDeg }, i) => {
            const rad = (angleDeg * Math.PI) / 180;
            const x = Math.cos(rad) * RADIUS;
            const y = Math.sin(rad) * RADIUS;
            return (
              <motion.a
                key={href}
                href={href}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="absolute rounded-full border border-foreground/15 bg-background/50 px-4 py-2 text-sm text-foreground/70 backdrop-blur-sm transition hover:bg-foreground/10 hover:text-foreground"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {label}
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

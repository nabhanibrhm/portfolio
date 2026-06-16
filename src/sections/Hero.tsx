"use client";

import dynamic from "next/dynamic";
import OrbitalNav from "@/components/ui/OrbitalNav";

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

      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6">
        <OrbitalNav />
      </div>
    </section>
  );
}

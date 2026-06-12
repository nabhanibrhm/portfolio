"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const DURATION_MS = 4000;
const HOLD_MS = 450;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), HOLD_MS);
      }
    };
    raf = requestAnimationFrame(tick);

    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  const splitTransition = {
    duration: 0.9,
    ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    delay: 0.25,
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] overflow-hidden"
        >
          {/* Top half — slides up on exit */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={splitTransition}
            className="absolute inset-x-0 top-0 h-1/2 bg-background"
            aria-hidden
          />
          {/* Bottom half — slides down on exit */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={splitTransition}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-background"
            aria-hidden
          />

          {/* Content — fades out before the halves part */}
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col"
          >
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-foreground"
              aria-hidden
            >
              <svg
                viewBox="0 0 200 200"
                className="h-28 w-28 md:h-36 md:w-36"
              >
                <defs>
                  <filter id="organic-goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="7" />
                    <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
                  </filter>
                </defs>
                <g filter="url(#organic-goo)" fill="currentColor">
                  <circle
                    className="organic-split-a"
                    cx="100"
                    cy="100"
                    r="30"
                  />
                  <circle
                    className="organic-split-b"
                    cx="100"
                    cy="100"
                    r="30"
                  />
                </g>
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15,
              }}
              className="mt-6"
            >
              <Image
                src="/memoji.png"
                alt="Luthfi memoji"
                width={1024}
                height={1536}
                priority
                className="h-32 w-auto md:h-40"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3,
              }}
              className="mt-4 text-2xl font-semibold tracking-[0.25em] text-foreground md:text-3xl"
            >
              LOADING
            </motion.h1>

            <div className="mt-6 h-5">
              <AnimatePresence>
                {progress >= 80 && (
                  <motion.p
                    key="almost"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/60"
                  >
                    Almost there
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-end justify-end p-6 md:p-10">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="font-mono text-3xl font-medium tabular-nums text-foreground md:text-4xl"
            >
              {progress.toString().padStart(3, "0")}
              <span className="ml-1 text-foreground/40">%</span>
            </motion.span>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-foreground/10">
            <motion.div
              className="h-full bg-foreground"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

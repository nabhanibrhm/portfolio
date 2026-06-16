"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "motion/react";

export type Expression = "flat" | "smile" | "sad";

const SOURCES: Record<Expression, string> = {
  flat: "/memoji-flat.png",
  smile: "/memoji-smile.png",
  sad: "/memoji-sad.png",
};

interface MemojiProps {
  expression: Expression;
  size?: number;
  priority?: boolean;
}

export default function Memoji({
  expression,
  size = 340,
  priority = false,
}: MemojiProps) {
  // The expression currently painted (single opaque image — never blended).
  const [shown, setShown] = useState<Expression>(expression);
  const controls = useAnimationControls();
  const firstRender = useRef(true);
  const busy = useRef(false);

  // Expression change → squash, hard-swap, pop back.
  useEffect(() => {
    if (expression === shown) return;

    if (firstRender.current) {
      firstRender.current = false;
      setShown(expression);
      return;
    }

    let cancelled = false;
    (async () => {
      busy.current = true;
      // 1. Squash down + slight blur (a "blink").
      await controls.start({
        scaleY: 0.82,
        scaleX: 1.06,
        filter: "blur(2px)",
        transition: { duration: 0.12, ease: "easeIn" },
      });
      if (cancelled) {
        busy.current = false;
        return;
      }
      // 2. Hard-swap the image while squashed — the motion hides the cut.
      setShown(expression);
      // 3. Pop back out with a springy overshoot.
      await controls.start({
        scaleY: 1,
        scaleX: 1,
        filter: "blur(0px)",
        transition: { type: "spring", stiffness: 480, damping: 17 },
      });
      busy.current = false;
    })();

    return () => {
      cancelled = true;
    };
  }, [expression, shown, controls]);

  // Occasional auto-blink while idle (quick squash, no expression change).
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = 2800 + Math.random() * 3800;
      timer = setTimeout(async () => {
        if (cancelled) return;
        if (!busy.current) {
          busy.current = true;
          await controls.start({
            scaleY: 0.8,
            scaleX: 1.05,
            transition: { duration: 0.08, ease: "easeIn" },
          });
          if (!cancelled) {
            await controls.start({
              scaleY: 1,
              scaleX: 1,
              transition: { duration: 0.14, ease: "easeOut" },
            });
          }
          busy.current = false;
        }
        if (!cancelled) schedule();
      }, delay);
    };

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [controls]);

  return (
    // Outer layer: gentle breathing float (independent of the blink layer).
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        animate={controls}
        style={{
          transformOrigin: "center bottom",
        }}
      >
        <Image
          src={SOURCES[shown]}
          alt={`Memoji ${shown}`}
          width={1024}
          height={1536}
          priority={priority}
          draggable={false}
          style={{ height: size, width: "auto" }}
        />
      </motion.div>
    </motion.div>
  );
}

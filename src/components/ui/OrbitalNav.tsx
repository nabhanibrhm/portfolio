"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Memoji, { type Expression } from "@/components/ui/Memoji";
import {
  User,
  Code2,
  Mail,
  Briefcase,
  GraduationCap,
  X,
  type LucideIcon,
} from "lucide-react";
import { site, skills, projects, experiences, education } from "@/data/site";

interface NavNode {
  id: number;
  title: string;
  icon: LucideIcon;
  angleDeg: number;
  preview: React.ReactNode;
}

function useViewportSizing() {
  const [{ vw, vh }, setVp] = useState({ vw: 1280, vh: 800 });

  useEffect(() => {
    const onResize = () =>
      setVp({ vw: window.innerWidth, vh: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = vw < 640;
  const isStacked = vw < 1536; // matches the Hero's stacked → row breakpoint

  // padX clears the wide node pills horizontally; padY only clears their height.
  const padX = isMobile ? 40 : isStacked ? 96 : 176;
  const padY = isMobile ? 36 : 52;

  // Space the orbital nav may occupy. In the stacked layout the text sits above
  // it, so reserve vertical room for that; in the row layout it gets the height.
  const reservedForText = isStacked ? (isMobile ? 236 : 300) : 0;
  const navMaxH = vh - reservedForText - (isStacked ? 96 : 48);
  const navMaxW = (isStacked ? vw : Math.min(vw, 1600) * 0.52) - 32;

  // nodeRadius (half the orbit) fits whichever budget is tighter, so the hero
  // never needs to scroll. ringRadius/memojiSize are derived to keep the nodes
  // outside the memoji and the memoji inside the dashed ring.
  const nodeRadius = Math.max(
    isMobile ? 92 : 150,
    Math.min(326, (navMaxH - padY) / 2, (navMaxW - padX) / 2),
  );

  return {
    ringRadius: nodeRadius * 0.82,
    nodeRadius,
    memojiSize: nodeRadius * 1.55,
    cardWidth: isMobile ? 250 : 320,
    // Fixed card height, capped to the viewport (content scrolls inside).
    cardHeight: Math.max(220, Math.min(isMobile ? 300 : 360, vh - 140)),
    padX,
    padY,
    isMobile,
  };
}

const navNodes: NavNode[] = [
  {
    id: 1,
    title: "About",
    icon: User,
    angleDeg: -54,
    preview: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-white/70">{site.tagline}</p>
        <p className="text-xs leading-relaxed text-white/50">
          {site.location} · {site.role}. I design data systems that scale with
          the business — pragmatic pipelines, observable infrastructure, and the
          odd shader to keep things fun.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[11px] text-white/60"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Experiences",
    icon: Briefcase,
    angleDeg: 18,
    preview: (
      <ul className="space-y-4">
        {experiences.map((e) => (
          <li key={e.role + e.company}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-white/90">
                {e.role}
              </span>
              <span className="font-mono text-[11px] text-white/40">
                {e.period}
              </span>
            </div>
            <div className="text-xs text-white/60">{e.company}</div>
            <p className="mt-1 text-xs leading-relaxed text-white/45">
              {e.description}
            </p>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 3,
    title: "Education",
    icon: GraduationCap,
    angleDeg: 90,
    preview: (
      <ul className="space-y-4">
        {education.map((ed) => (
          <li key={ed.degree}>
            <div className="text-sm font-medium text-white/90">{ed.degree}</div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs text-white/60">{ed.school}</span>
              <span className="font-mono text-[11px] text-white/40">
                {ed.period}
              </span>
            </div>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 4,
    title: "Projects",
    icon: Code2,
    angleDeg: 162,
    preview: (
      <ul className="space-y-4">
        {projects.map((p, i) => (
          <li key={p.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 font-mono text-[11px] text-white/30">
              0{i + 1}
            </span>
            <div>
              <div className="text-sm font-medium text-white/90">{p.title}</div>
              <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                {p.description}
              </p>
              <div className="mt-1 font-mono text-[11px] text-white/40">
                {p.tags.join(" · ")}
              </div>
            </div>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 5,
    title: "Contact",
    icon: Mail,
    angleDeg: 234,
    preview: (
      <div className="space-y-4">
        <p className="text-sm text-white/60">
          Open to data engineering roles and consulting.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="block font-mono text-xs text-white/80 transition hover:text-white"
        >
          {site.email}
        </a>
        <div className="flex gap-2">
          <a
            href={site.social.github}
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            GitHub
          </a>
          <a
            href={site.social.linkedin}
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            LinkedIn
          </a>
        </div>
      </div>
    ),
  },
];

export default function OrbitalNav() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [expression, setExpression] = useState<Expression>("flat");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { ringRadius, nodeRadius, memojiSize, cardWidth, cardHeight, padX, padY, isMobile } =
    useViewportSizing();
  const cardRef = useRef<HTMLDivElement>(null);
  const cardShiftRef = useRef({ x: 0, y: 0 });
  const [cardShift, setCardShift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.25) % 360).toFixed(3)));
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRotate]);

  useEffect(() => {
    return () => {
      if (sadTimer.current) clearTimeout(sadTimer.current);
    };
  }, []);

  // After a card opens, nudge it so it sits fully inside the viewport. We use a
  // separate CSS `translate` (composes with motion's `transform`) and measure
  // off the untransformed size so the open/scale animation doesn't skew it.
  useEffect(() => {
    if (isMobile || openId === null) return;
    const raf = requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      const m = 14;
      const s = cardShiftRef.current;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const r = el.getBoundingClientRect();
      // Undo the currently-applied shift to get the anchored (base) position.
      const cx = r.left + r.width / 2 - s.x;
      const cy = r.top + r.height / 2 - s.y;
      const left = cx - w / 2;
      const right = cx + w / 2;
      const top = cy - h / 2;
      const bottom = cy + h / 2;
      let dx = 0;
      let dy = 0;
      if (right > window.innerWidth - m) dx = window.innerWidth - m - right;
      if (left + dx < m) dx = m - left;
      if (bottom > window.innerHeight - m) dy = window.innerHeight - m - bottom;
      if (top + dy < m) dy = m - top;
      const next = { x: dx, y: dy };
      cardShiftRef.current = next;
      setCardShift(next);
    });
    return () => cancelAnimationFrame(raf);
  }, [openId, isMobile, nodeRadius, cardWidth, cardHeight]);

  const getPos = (angleDeg: number) => {
    const angle = (angleDeg + rotationAngle) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = nodeRadius * Math.cos(rad);
    const y = nodeRadius * Math.sin(rad);
    const opacity = Math.max(0.45, Math.min(1, 0.45 + 0.55 * ((1 + Math.sin(rad)) / 2)));
    const zIndex = Math.round(100 + 60 * Math.cos(rad));
    return { x, y, opacity, zIndex };
  };

  const pulseSad = () => {
    if (sadTimer.current) clearTimeout(sadTimer.current);
    setExpression("sad");
    sadTimer.current = setTimeout(() => {
      sadTimer.current = null;
      setExpression("flat");
    }, 900);
  };

  const handleNodeClick = (id: number) => {
    if (activeId === id) {
      setActiveId(null);
      setOpenId(null);
      setAutoRotate(true);
      pulseSad();
    } else {
      if (sadTimer.current) {
        clearTimeout(sadTimer.current);
        sadTimer.current = null;
      }
      setActiveId(id);
      setOpenId(id);
      setAutoRotate(false);
      setExpression("smile");
    }
  };

  const closeCard = () => {
    if (activeId !== null) pulseSad();
    setActiveId(null);
    setOpenId(null);
    setAutoRotate(true);
  };

  const handleBgClick = () => {
    closeCard();
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: nodeRadius * 2 + padX, height: nodeRadius * 2 + padY }}
      onClick={handleBgClick}
    >
      {/* Orbit ring (dashed circle sits inside the nodes) */}
      <div
        className="absolute rounded-full border border-dashed border-white/10"
        style={{ width: ringRadius * 2, height: ringRadius * 2 }}
      />

      {/* Memoji center */}
      <motion.div
        className="relative z-10 pointer-events-none"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute rounded-full border border-white/10 animate-ping opacity-20"
            style={{ width: memojiSize * 0.48, height: memojiSize * 0.48 }}
          />
          <div
            className="absolute rounded-full border border-white/5 animate-ping opacity-10"
            style={{
              width: memojiSize * 0.6,
              height: memojiSize * 0.6,
              animationDelay: "0.8s",
            }}
          />
        </div>
        <Memoji expression={expression} size={memojiSize} priority />
      </motion.div>

      {/* Orbital nodes */}
      {navNodes.map((node) => {
        const pos = getPos(node.angleDeg);
        const isActive = activeId === node.id;
        const Icon = node.icon;
        // Open the card inward (toward the orbit centre) so it never runs off
        // screen: above when the node sits low / below when high, and away from
        // whichever horizontal edge the node is nearer to.
        const cardAbove = pos.y > 0;
        const openLeft = pos.x > 0;

        return (
          <motion.div
            key={node.id}
            className="absolute cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isActive ? 1 : pos.opacity,
              scale: isActive ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
            style={{
              left: `calc(50% + ${pos.x}px)`,
              top: `calc(50% + ${pos.y}px)`,
              transform: "translate(-50%, -50%)",
              zIndex: isActive ? 200 : pos.zIndex,
              transition: "left 0.05s linear, top 0.05s linear",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick(node.id);
            }}
          >
            {/* Node pill — icon-only on mobile, icon + label otherwise */}
            <div
              className={`flex items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 ${
                isMobile ? "h-12 w-12" : "gap-2.5 px-6 py-3 text-base"
              } ${
                isActive
                  ? "border-white bg-white text-black shadow-lg shadow-white/20"
                  : "border-white/20 bg-black/40 text-white/80 hover:border-white/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={isMobile ? 18 : 17} />
              {!isMobile && (
                <span className="font-medium tracking-wide">{node.title}</span>
              )}
            </div>

            {/* Preview card (desktop: anchored to the node) */}
            <AnimatePresence>
              {!isMobile && openId === node.id && (
                <motion.div
                  ref={cardRef}
                  initial={{ opacity: 0, y: cardAbove ? 8 : -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: cardAbove ? 8 : -8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    translate: `${cardShift.x}px ${cardShift.y}px`,
                  }}
                  className={`absolute flex flex-col rounded-3xl border border-white/20 bg-black/25 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl backdrop-saturate-150 ${
                    openLeft ? "right-1/2" : "left-1/2"
                  } ${cardAbove ? "bottom-16" : "top-16"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Card header */}
                  <div className="mb-4 flex shrink-0 items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                      {node.title}
                    </span>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeCard();
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="-mr-2 min-h-0 flex-1 overflow-y-auto pr-2">
                    {node.preview}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Preview card (mobile: centered over the orbit) */}
      {isMobile && (
        <AnimatePresence>
          {openId !== null &&
            (() => {
              const node = navNodes.find((n) => n.id === openId);
              if (!node) return null;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ width: cardWidth, height: cardHeight }}
                  className="absolute left-1/2 top-1/2 z-[250] flex -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl border border-white/20 bg-black/40 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl backdrop-saturate-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-4 flex shrink-0 items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                      {node.title}
                    </span>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeCard();
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="-mr-2 min-h-0 flex-1 overflow-y-auto pr-2">
                    {node.preview}
                  </div>
                </motion.div>
              );
            })()}
        </AnimatePresence>
      )}
    </div>
  );
}

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

const RADIUS = 230;

const navNodes: NavNode[] = [
  {
    id: 1,
    title: "About",
    icon: User,
    angleDeg: -90,
    preview: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-white/70">{site.tagline}</p>
        <p className="text-[11px] leading-relaxed text-white/50">
          {site.location} · {site.role}. I design data systems that scale with
          the business — pragmatic pipelines, observable infrastructure, and the
          odd shader to keep things fun.
        </p>
        <div className="flex flex-wrap gap-1">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/60"
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
    angleDeg: -18,
    preview: (
      <ul className="space-y-3">
        {experiences.map((e) => (
          <li key={e.role + e.company}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium text-white/90">
                {e.role}
              </span>
              <span className="font-mono text-[10px] text-white/40">
                {e.period}
              </span>
            </div>
            <div className="text-[11px] text-white/60">{e.company}</div>
            <p className="mt-1 text-[11px] leading-relaxed text-white/45">
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
    angleDeg: 54,
    preview: (
      <ul className="space-y-2.5">
        {education.map((ed) => (
          <li key={ed.degree}>
            <div className="text-xs font-medium text-white/90">{ed.degree}</div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] text-white/60">{ed.school}</span>
              <span className="font-mono text-[10px] text-white/40">
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
    angleDeg: 126,
    preview: (
      <ul className="space-y-3">
        {projects.map((p, i) => (
          <li key={p.title} className="flex items-start gap-2">
            <span className="mt-0.5 font-mono text-[10px] text-white/30">
              0{i + 1}
            </span>
            <div>
              <div className="text-xs font-medium text-white/90">{p.title}</div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-white/50">
                {p.description}
              </p>
              <div className="mt-1 font-mono text-[10px] text-white/40">
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
    angleDeg: 198,
    preview: (
      <div className="space-y-3">
        <p className="text-xs text-white/60">
          Open to data engineering roles and consulting.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="block font-mono text-[11px] text-white/80 transition hover:text-white"
        >
          {site.email}
        </a>
        <div className="flex gap-2">
          <a
            href={site.social.github}
            className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            GitHub
          </a>
          <a
            href={site.social.linkedin}
            className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/60 transition hover:bg-white/10 hover:text-white"
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
  const [clickedY, setClickedY] = useState<Record<number, number>>({});
  const [expression, setExpression] = useState<Expression>("flat");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const getPos = (angleDeg: number) => {
    const angle = (angleDeg + rotationAngle) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = RADIUS * Math.cos(rad);
    const y = RADIUS * Math.sin(rad);
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

  const handleNodeClick = (id: number, posY: number) => {
    if (activeId === id) {
      setActiveId(null);
      setAutoRotate(true);
      pulseSad();
    } else {
      if (sadTimer.current) {
        clearTimeout(sadTimer.current);
        sadTimer.current = null;
      }
      setActiveId(id);
      setAutoRotate(false);
      setClickedY((prev) => ({ ...prev, [id]: posY }));
      setExpression("smile");
    }
  };

  const handleNodeHover = (entering: boolean) => {
    if (activeId !== null || sadTimer.current) return;
    setExpression(entering ? "smile" : "flat");
  };

  const handleBgClick = () => {
    if (activeId !== null) pulseSad();
    setActiveId(null);
    setAutoRotate(true);
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: RADIUS * 2 + 180, height: RADIUS * 2 + 180 }}
      onClick={handleBgClick}
    >
      {/* Orbit ring */}
      <div
        className="absolute rounded-full border border-dashed border-white/10"
        style={{ width: RADIUS * 2, height: RADIUS * 2 }}
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
            style={{ width: 160, height: 160 }}
          />
          <div
            className="absolute rounded-full border border-white/5 animate-ping opacity-10"
            style={{ width: 200, height: 200, animationDelay: "0.8s" }}
          />
        </div>
        <Memoji expression={expression} size={340} priority />
      </motion.div>

      {/* Orbital nodes */}
      {navNodes.map((node, i) => {
        const pos = getPos(node.angleDeg);
        const isActive = activeId === node.id;
        const Icon = node.icon;
        const cardAbove = (clickedY[node.id] ?? pos.y) > 40;

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
              handleNodeClick(node.id, pos.y);
            }}
            onMouseEnter={() => handleNodeHover(true)}
            onMouseLeave={() => handleNodeHover(false)}
          >
            {/* Node pill */}
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-sm transition-all duration-300 ${
                isActive
                  ? "border-white bg-white text-black shadow-lg shadow-white/20"
                  : "border-white/20 bg-black/40 text-white/80 hover:border-white/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={13} />
              <span className="font-medium tracking-wide">{node.title}</span>
            </div>

            {/* Preview card */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: cardAbove ? 8 : -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: cardAbove ? 8 : -8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute left-1/2 w-60 -translate-x-1/2 rounded-2xl border border-white/20 bg-black/25 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl backdrop-saturate-150 ${
                    cardAbove ? "bottom-14" : "top-14"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Connector line */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-px h-3 bg-white/20 ${
                      cardAbove ? "-bottom-3" : "-top-3"
                    }`}
                  />

                  {/* Card header */}
                  <div className="mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                      {node.title}
                    </span>
                  </div>

                  {node.preview}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

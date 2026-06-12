"use client";

import { motion } from "motion/react";
import { projects } from "@/data/site";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative border-t border-foreground/5 px-6 py-32 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="font-mono text-sm uppercase tracking-[0.3em] text-foreground/60"
        >
          02 — Selected work
        </motion.h2>

        <ul className="mt-12 divide-y divide-foreground/5 border-y border-foreground/5">
          {projects.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative"
            >
              <a
                href={p.href ?? "#"}
                className="grid items-baseline gap-4 py-8 md:grid-cols-12 md:gap-8"
              >
                <span className="font-mono text-xs text-foreground/40 md:col-span-1">
                  0{i + 1}
                </span>
                <div className="md:col-span-5">
                  <h3 className="text-2xl font-medium text-foreground transition group-hover:text-foreground/70 md:text-3xl">
                    {p.title}
                  </h3>
                </div>
                <p className="text-foreground/60 md:col-span-4">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5 md:col-span-2 md:justify-end">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-foreground/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

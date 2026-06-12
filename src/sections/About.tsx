"use client";

import { motion } from "motion/react";
import { skills } from "@/data/site";

export default function About() {
  return (
    <section id="about" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="font-mono text-sm uppercase tracking-[0.3em] text-foreground/60"
        >
          01 — About
        </motion.h2>

        <div className="mt-8 grid gap-12 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-3"
          >
            <p className="text-balance text-2xl leading-snug text-foreground/90 md:text-3xl">
              I design data systems that scale with the business, not against
              it — pragmatic pipelines, observable infrastructure, and the
              odd shader to keep things fun.
            </p>
            <p className="mt-6 max-w-prose text-foreground/60">
              Currently building data platforms at Sinarmas. Previously: a few
              years of analytics engineering, a lot of broken Airflow DAGs,
              and a healthy obsession with cost-aware architecture.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-2 flex flex-wrap content-start gap-2"
          >
            {skills.map((s) => (
              <li
                key={s}
                className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1.5 font-mono text-xs text-foreground/80"
              >
                {s}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

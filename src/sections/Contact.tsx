"use client";

import { motion } from "motion/react";
import { site } from "@/data/site";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative border-t border-foreground/5 px-6 py-32 md:py-48"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="font-mono text-sm uppercase tracking-[0.3em] text-foreground/60"
        >
          03 — Contact
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
        >
          Have a data problem worth <span className="italic">solving</span>?
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href={`mailto:${site.email}`}
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            {site.email}
          </a>
          <a
            href={site.social.github}
            className="rounded-full border border-foreground/15 px-5 py-3 text-sm text-foreground/80 transition hover:bg-foreground/10"
          >
            GitHub
          </a>
          <a
            href={site.social.linkedin}
            className="rounded-full border border-foreground/15 px-5 py-3 text-sm text-foreground/80 transition hover:bg-foreground/10"
          >
            LinkedIn
          </a>
        </motion.div>

        <footer className="mt-24 flex items-center justify-between font-mono text-xs text-foreground/40">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>Built with Next.js · R3F · GLSL</span>
        </footer>
      </div>
    </section>
  );
}

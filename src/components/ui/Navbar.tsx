"use client";

import Link from "next/link";
import { motion } from "motion/react";

const links: { href: string; label: string }[] = [
  // { href: "#about", label: "About" },
  // { href: "#projects", label: "Projects" },
  // { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-6 py-4"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-foreground/10 bg-background/40 px-5 py-2.5 backdrop-blur-md">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-foreground/90"
        >
          luthfi<span className="text-foreground">.</span>dev
        </Link>
        <ul className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-1.5 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}

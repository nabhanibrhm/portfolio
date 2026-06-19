/* ---------------------------------------------------------------------------
 * Single source of truth for site content.
 * Ported from the previous Next.js build and enriched with gallery metadata
 * (slugs, categories, accent assignment). No facts were invented — categories
 * are descriptors of the listed tech stack, and accents are purely visual.
 * ------------------------------------------------------------------------- */

export const site = {
  name: "Luthfi Nabhan Ibrahim",
  // The accent-highlighted token rendered in the hero ("Nabhan" in orange).
  highlight: "Nabhan",
  role: "Data Engineer",
  tagline:
    "I build resilient data platforms, streaming pipelines, and the occasional shader.",
  location: "Jakarta, ID",
  email: "luthfi.ibrahim@smma.co.id",
  social: {
    // TODO: swap in real profile URLs — these placeholders were carried over.
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
  },
} as const;

export const about = {
  lead: "I design data systems that scale with the business.",
  body: [
    "Based in Jakarta, I build resilient data platforms, streaming pipelines, and cost-aware lakehouse infrastructure — pragmatic systems with observability baked in.",
    "I care about the craft at both ends of the stack: the reliability of a streaming job at 3am, and the feel of an interface at 60fps. The occasional shader keeps things fun.",
  ],
};

export const skills = [
  "Python",
  "SQL",
  "Spark",
  "Airflow",
  "dbt",
  "Kafka",
  "BigQuery",
  "Snowflake",
  "Terraform",
  "TypeScript",
];

export type Accent = "accent" | "secondary";

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
  accent: Accent;
};

export const experiences: Experience[] = [
  {
    role: "Data Engineer",
    company: "Sinarmas",
    period: "2023 — Present",
    description:
      "Building data platforms, streaming pipelines, and cost-aware lakehouse infrastructure.",
    accent: "accent",
  },
  {
    role: "Analytics Engineer",
    company: "Previous Co.",
    period: "2021 — 2023",
    description:
      "Owned dbt models and the semantic layer powering self-serve analytics.",
    accent: "secondary",
  },
];

export type Education = {
  degree: string;
  school: string;
  period: string;
};

export const education: Education[] = [
  {
    degree: "B.Sc. Computer Science",
    school: "University",
    period: "2017 — 2021",
  },
];

export type Project = {
  slug: string;
  title: string;
  /** Short discipline descriptor — derived from the tech stack, not invented. */
  category: string;
  description: string;
  tags: string[];
  href?: string;
  accent: Accent;
};

export const projects: Project[] = [
  {
    slug: "realtime-cdc-pipeline",
    title: "Realtime CDC Pipeline",
    category: "Streaming · Lakehouse",
    description:
      "Debezium → Kafka → Iceberg lakehouse with sub-minute freshness powering 12+ downstream marts.",
    tags: ["Kafka", "Debezium", "Iceberg", "Spark"],
    accent: "accent",
  },
  {
    slug: "self-serve-analytics",
    title: "Self-serve Analytics Platform",
    category: "Analytics Engineering",
    description:
      "dbt + semantic layer + Metabase, with CI lineage gates that block breaking schema changes.",
    tags: ["dbt", "BigQuery", "Metabase"],
    accent: "secondary",
  },
  {
    slug: "cost-observability",
    title: "Cost Observability Toolkit",
    category: "FinOps · Observability",
    description:
      "Per-query attribution and budget alerting that cut warehouse spend ~38% over a quarter.",
    tags: ["Snowflake", "Python", "Grafana"],
    accent: "accent",
  },
];

export const getProject = (slug?: string) =>
  projects.find((p) => p.slug === slug);

/** Anchor sections used by the fixed header nav. */
export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Work", href: "/#work" },
  { label: "Contact", href: "/#contact" },
];

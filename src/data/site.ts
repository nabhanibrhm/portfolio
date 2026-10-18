export const site = {
  name: "Luthfi Nabhan Ibrahim",
  highlight: "Nabhan",
  role: "Frontend & Data Engineer",
  tagline:
    "Software Engineer specializing in data architecture, data analysis, and interactive frontend design.",
  /** Hero h1, one entry per line. A segment with `accent: true` renders in the accent style. */
  headline: [
    [{ text: "Data systems" }],
    [{ text: "that " }, { text: "scale", accent: true }, { text: " with" }],
    [{ text: "the business." }],
  ] as { text: string; accent?: boolean }[][],

  /** Contact h2, one entry per line (same shape as `headline`). */
  contactHeadline: [
    [{ text: "Let’s build" }],
    [{ text: "something " }, { text: "great.", accent: true }],
  ] as { text: string; accent?: boolean }[][],
  // TODO(content): confirm this availability line is true before publishing
  availability: "Open to freelance / full-time",

  location: "Bekasi, West Java, ID",
  /** Shown under the local-time tile */
  coordinates: "6.24°S · 106.99°E",
  email: "luthfinabhan@gmail.com",
  social: {

    github: "https://github.com/nabhanibrhm",
    linkedin: "https://linkedin.com/in/luthfinabhanibrahim",
    whatsapp: "https://wa.me/6282297765806",
  },
} as const;

/** Contact + footer text links (labels shown as-is) */
export const socialLinks = [
  { label: "GitHub", href: site.social.github },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "WhatsApp", href: site.social.whatsapp },
];

export const about = {
  // `lead` ("I design data systems that scale with the business.") is no longer
  // rendered: it duplicates the hero headline. Kept here for reference/meta copy.
  lead: "I design data systems that scale with the business.",
  /** Bio tile heading */
  headline: "Pragmatic systems, with observability baked in.",
  body: [
    "Based in Bekasi, I build resilient data platforms, streaming pipelines, and cost-aware lakehouse infrastructure.",
    "I also craft interactive dashboards and data visualizations that empower stakeholders to make informed decisions.",
  ],
  /** Mini-game tile copy */
  game: {
    label: "Bored? Play a round",
    description: "Fly the memoji between the pillars. One tap per flap.",
  },
};

export const skills = [
  "Python",
  "SQL",
  "Spark",
  "Airflow",
  "dbt",
  "Kafka",
  "Tableau",
  "PowerBI",
  "Metabase",
  "Bash Scripting",
  "JavaScript",
  
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  /** One line shown under the title, always visible. */
  summary: string;
  /** Marks the role you hold now (amber rule + dot, "Currently" tile). */
  current?: boolean;
  /** Start label for the "Currently" tile, e.g. "Jan 2022". */
  since?: string;
  /** A single paragraph, or an array of bullet points rendered when expanded. */
  description: string | string[];
};

export const experiences: Experience[] = [
  {
    role: "Data Engineer",
    company: "PT. Sinarmas Multiartha Tbk",
    period: "Jan 2022 — Present",
    current: true,
    since: "Jan 2022",
    summary:
      "Builds and runs the ETL/ELT pipelines, data governance and BI dashboards behind core data assets.",
    description: [
      "Automated end-to-end ETL/ELT pipelines using Python, SQL, and Spark, managed via orchestration tools (Airflow, Dagster).",
      "Maintained data dictionaries and technical documentation for all core data assets, ensuring strict data governance, transparency, and compliance.",
      "Implemented data quality practices, including automated validation checks and error-monitoring workflows.",
      "Helped develop and maintain interactive dashboards using Metabase, Tableau, and Power BI.",
      "Collaborated on system specifications and technical workflows.",
    ],
  },
  {
    role: "Data Entry Intern",
    company: "Incubator Business Center Gunadarma",
    period: "Sep 2021 — Jan 2022",
    // TODO(content): review summary (condensed from the bullets below)
    summary:
      "Supported the Health Center in adopting a new application and wrote the pilot reports that fed its development.",
    description: [
      "Provided assistance to the Health Center in using a new application.",
      "Created piloting reports used as input for application development.",
    ],
  },
  {
    role: "HRIS Intern",
    company: "PT. Global Tiket Network (tiket.com)",
    period: "Dec 2020 — Feb 2021",
    // TODO(content): review summary (condensed from the bullets below)
    summary:
      "Managed, validated and cleaned HR data at tiket.com and answered HRIS questions.",
    description: [
      "Managed and validated Human Resources (HR) data at tiket.com.",
      "Cleaned and repaired tiket.com employee data.",
      "Communicated and answered HRIS-related questions.",
    ],
  },
  {
    role: "Part Time Laboratory Assistant",
    company: "Gunadarma University",
    period: "Aug 2018 — Jan 2022",
    // TODO(content): review summary (condensed from the bullets below)
    summary:
      "Taught students Python and MySQL in the Computer Science laboratory and managed lab scores.",
    description: [
      "Instructed students in Python and MySQL at the Laboratory of Computer Science.",
      "Collected and managed lab scores.",
    ],
  },
];

export type Education = {
  degree: string;
  school: string;
  period: string;
};

export const education: Education[] = [
  {
    degree: "Bachelor of Information Systems",
    school: "Gunadarma University",
    period: "2017 — 2021",
  },
];

export type ProjectLink = {
  kind: "repo" | "apk";
  href: string;
  label: string;
};

export type ProjectDetail = {
  /** Meta strip on the detail page */
  type: string;
  platform: string;
  /** Short stack line for the meta strip (full list = Project.stack) */
  metaStack: string[];
  overview: string;
  /** "What it does" list */
  features: string[];
  /** Demo clip (files in /public): card tile + detail-page figure */
  video: { src: string; poster: string };
};

export type Project = {
  /** Only projects with a `detail` block get a page at /projects/{slug} */
  slug?: string;
  title: string;
  /** Company, or "Personal Project" */
  category: string;
  /** TODO(content): year is not recorded for any project yet — render skips it when missing */
  year?: string;
  /** TODO(content): short key metric for the card (e.g. "12 TB/day") — render skips it when missing */
  metric?: string;
  /** One short line for the card. Falls back to the first sentence of `description`. */
  summary?: string;
  /** Full description (kept as the source of truth for copy) */
  description: string;
  /** 2–3 short chips for the card */
  tags: string[];
  /** Full tech list */
  stack?: string[];
  links?: ProjectLink[];
  detail?: ProjectDetail;
};

export const projects: Project[] = [
  {
    title: "Big Data Pipeline",
    category: "PT. Sinarmas Multiartha Tbk",
    // TODO(content): year, metric and a hand-written one-line summary (card shows the first sentence of `description` until then)
    description:
      "Created a big data pipeline for processing and analyzing large-scale financial transactions using Python, Spark, Airflow, and Iceberg.",
    tags: ["Python", "Airflow", "Iceberg"],
    stack: ["Python", "Airflow", "Iceberg", "Spark", "PostgreSQL"],
  },
  {
    title: "Antifraud System",
    category: "PT. Sinarmas Multiartha Tbk",
    // TODO(content): year, metric and a hand-written one-line summary
    description:
      "Near real-time antifraud monitoring system with Python, Kafka, and Spark Streaming, SQL",
    tags: ["Python", "Kafka", "Iceberg"],
    stack: ["Python", "Kafka", "Spark Structured Streaming", "Iceberg"],
  },
  {
    title: "HRIS AI Chatbot",
    category: "PT. Sinarmas Multiartha Tbk",
    // TODO(content): year, metric and a hand-written one-line summary
    description:
      "AI-powered conversational interface for HRIS data access and employee support queries using LLM, Python, Java, and APIs.",
    tags: ["Python", "LLM", "Java"],
    stack: ["Python", "LLM", "Java", "SQL"],
  },
  {
    title: "PIKK Website",
    category: "PT. Sinarmas Multiartha Tbk",
    // TODO(content): year, metric and a hand-written one-line summary (the first sentence of `description` is long)
    description:
      "Frontend Engineer on PIKK Website platform — a multi-role Vue 3 / Vuetify 3 / Pinia web application for audit planning, findings, monitoring, and analytics with full Indonesian/English localization and light/dark theming. Shipped end-to-end features including an audit report generation module, full edit/delete workflows for audit findings and plan realizations with mandatory-reason capture and two-step delete confirmation, and a redesigned Internal Audit dashboard suite while resolving production defects, i18n and dark-mode issues, and dependency vulnerabilities.",
    tags: ["Vue 3", "Vuetify 3", "Pinia"],
    stack: ["Vue 3", "Vuetify 3", "Pinia", "JavaScript", "TypeScript"],
  },
  {
    slug: "throttlepath",
    title: "ThrottlePath Ride Telemetry",
    category: "Personal Project",
    // TODO(content): year (shown on the card + detail meta) and an optional key metric
    summary:
      "An offline-first motorcycle ride tracker: live GPS map, speed dial, lean-angle telemetry and per-ride analysis, built with Flutter and native Android background services.",
    description:
      "An offline-first motorcycle ride tracker that records rides in real time — live GPS map, speed dial, moving-time and lean-angle telemetry, ride history with multi-stint trips, per-ride analysis (speed zones, smoothness, lean, elevation), and shareable summary cards. Built with Flutter and native Android (Kotlin) background services for continuous raw-GNSS tracking that survives lock and sleep, backed by an on-device Isar database so it works fully offline.",
    tags: ["Flutter", "Kotlin", "Riverpod", "Isar"],
    stack: ["Flutter", "Dart", "Kotlin", "Riverpod", "Isar", "flutter_map", "GPS Tracking"],
    links: [
      {
        kind: "apk",
        href: "https://drive.google.com/drive/folders/1N10aVLbQiAsHobb_CbDjYr-gFronjz7-",
        label: "Download APK (Android)",
      },
      {
        kind: "repo",
        href: "https://github.com/nabhanibrhm/throttlepath",
        label: "View repository",
      },
    ],
    detail: {
      type: "Personal project",
      platform: "Android",
      metaStack: ["Flutter", "Dart", "Kotlin"],
      overview:
        "An offline-first motorcycle ride tracker that records rides in real time. Built with Flutter and native Android (Kotlin) background services for continuous raw-GNSS tracking that survives lock and sleep, backed by an on-device Isar database so it works fully offline.",
      features: [
        "Live GPS map and speed dial",
        "Moving-time and lean-angle telemetry",
        "Ride history with multi-stint trips",
        "Per-ride analysis: speed zones, smoothness, lean, elevation",
        "Shareable ride summary cards",
      ],
      video: {
        src: "/videos/throttlepath-promo.mp4",
        poster: "/videos/throttlepath-promo-poster.jpg",
      },
    },
  },
];

/** "01", "02", … — position in the projects list */
export const projectNumber = (i: number) => String(i + 1).padStart(2, "0");

/** First sentence of a longer text (fallback for a missing `summary`) */
export const firstSentence = (text: string) => text.split(/(?<=[.!?])\s+/)[0];

export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

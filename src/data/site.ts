export const site = {
  name: "Luthfi Nabhan Ibrahim",
  highlight: "Nabhan",
  role: "Frontend & Data Engineer",
  tagline:
    "Software Engineer specializing in data architecture, data analysis, and interactive frontend design",
  location: "Bekasi, West Java, ID",
  email: "luthfinabhan@gmail.com",
  social: {

    github: "https://github.com/nabhanibrhm",
    linkedin: "https://linkedin.com/in/luthfinabhanibrahim",
    whatsapp: "https://wa.me/6282297765806",
  },
} as const;

export const about = {
  lead: "I design data systems that scale with the business.",
  body: [
    "Based in Bekasi, I build resilient data platforms, streaming pipelines, and cost-aware lakehouse infrastructure — pragmatic systems with observability baked in.",
    "I also craft interactive dashboards and data visualizations that empower stakeholders to make informed decisions.",
  ],
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
  /** A single paragraph, or an array of bullet points rendered as a list. */
  description: string | string[];
};

export const experiences: Experience[] = [
  {
    role: "Data Engineer",
    company: "PT. Sinarmas Multiartha Tbk",
    period: "Jan 2022 — Present",
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
    description: [
      "Provided assistance to the Health Center in using a new application.",
      "Created piloting reports used as input for application development.",
    ],
  },
  {
    role: "HRIS Intern",
    company: "PT. Global Tiket Network (tiket.com)",
    period: "Dec 2020 — Feb 2021",
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

export type Project = {
  title: string;
  category: string;
  description: string;
  tags: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Big Data Pipeline",
    category: "PT. Sinarmas Multiartha Tbk",
    description:
      "Created a big data pipeline for processing and analyzing large-scale financial transactions using Python, Spark, Airflow, and Iceberg.",
    tags: ["Python", "Airflow", "Iceberg", "Spark","PostgreSQL"],
  },
  {
    title: "Antifraud System",
    category: "PT. Sinarmas Multiartha Tbk",
    description:
      "Near real-time antifraud monitoring system with Python, Kafka, and Spark Streaming, SQL",
    tags: ["Python", "Kafka", "Spark Structured Streaming", "Iceberg"],
  },
  {
    title: "HRIS AI Chatbot",
    category: "PT. Sinarmas Multiartha Tbk",
    description:
      "AI-powered conversational interface for HRIS data access and employee support queries using LLM, Python, Java, and APIs.",
    tags: ["Python", "LLM", "Java", "SQL"],
  },
  {
    title: "PIKK Website",
    category: "PT. Sinarmas Multiartha Tbk",
    description:
      "Frontend Engineer on PIKK Website platform — a multi-role Vue 3 / Vuetify 3 / Pinia web application for audit planning, findings, monitoring, and analytics with full Indonesian/English localization and light/dark theming. Shipped end-to-end features including an audit report generation module, full edit/delete workflows for audit findings and plan realizations with mandatory-reason capture and two-step delete confirmation, and a redesigned Internal Audit dashboard suite while resolving production defects, i18n and dark-mode issues, and dependency vulnerabilities.",
    tags: ["Vue 3", "Vuetify 3", "Pinia", "JavaScript", "TypeScript"],
  },
  {
    title: "RollingBike Telemetry Tracker",
    category: "Personal Project",
    description:
      "An offline-first mobile app for cyclists that records rides in real time — live GPS map, moving-time and speed telemetry, and shareable post-ride summary cards. Built with Flutter and native Android (Kotlin) background services for continuous GPS tracking, backed by an on-device Isar database so it works fully offline.",
    tags: ["Flutter", "Dart", "Kotlin", "Riverpod", "Isar", "flutter_map", "GPS Tracking"],
    href: "https://github.com/nabhanibrhm/rollingbike",
  },
];

export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#work" },
  { label: "Contact", href: "/#contact" },
];

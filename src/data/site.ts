export const site = {
  name: "Luthfi Nabhan Ibrahim",
  role: "Data Engineer",
  tagline:
    "I build resilient data platforms, streaming pipelines, and the occasional shader.",
  location: "Jakarta, ID",
  email: "luthfi.ibrahim@smma.co.id",
  social: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
  },
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

export type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export const experiences: Experience[] = [
  {
    role: "Data Engineer",
    company: "Sinarmas",
    period: "2023 — Present",
    description:
      "Building data platforms, streaming pipelines, and cost-aware lakehouse infrastructure.",
  },
  {
    role: "Analytics Engineer",
    company: "Previous Co.",
    period: "2021 — 2023",
    description:
      "Owned dbt models and semantic layer powering self-serve analytics.",
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

export const projects: Project[] = [
  {
    title: "Realtime CDC Pipeline",
    description:
      "Debezium → Kafka → Iceberg lakehouse with sub-minute freshness powering 12+ downstream marts.",
    tags: ["Kafka", "Debezium", "Iceberg", "Spark"],
  },
  {
    title: "Self-serve Analytics Platform",
    description:
      "dbt + semantic layer + Metabase, with CI lineage gates that block breaking schema changes.",
    tags: ["dbt", "BigQuery", "Metabase"],
  },
  {
    title: "Cost Observability Toolkit",
    description:
      "Per-query attribution and budget alerting that cut warehouse spend ~38% over a quarter.",
    tags: ["Snowflake", "Python", "Grafana"],
  },
];

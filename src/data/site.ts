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

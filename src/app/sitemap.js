import { getPublishedProjects } from "@/lib/projectsRepo";
import { SERVICES_SLUGS } from "@/lib/servicesData";

const BASE_URL = "https://mnc.sa";

const STATIC_ROUTES = [
  { path: "", priority: 1 },
  { path: "/us", priority: 0.8 },
  { path: "/projects", priority: 0.9 },
  { path: "/suppliers", priority: 0.6 },
  { path: "/careers", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
  { path: "/app", priority: 0.5 },
];

function toDate(value) {
  if (!value) return new Date();
  if (typeof value.toDate === "function") return value.toDate();
  return new Date(value);
}

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    priority,
  }));

  const serviceEntries = SERVICES_SLUGS.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  let projectEntries = [];
  try {
    const projects = await getPublishedProjects();
    projectEntries = projects.map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: toDate(project.updatedAt),
      priority: 0.6,
    }));
  } catch {
    projectEntries = [];
  }

  return [...staticEntries, ...serviceEntries, ...projectEntries];
}

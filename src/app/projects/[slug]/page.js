import { getProjectBySlug, getRelatedProjects, getPublishedProjects } from "@/lib/projectsRepo";
import ProjectPageClient from "./ProjectPageClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.draft || project.archived) return {};

  const title = project.seoTitle || project.name_ar || project.name_en || slug;
  const description = (project.seoDescription || project.shortDesc_ar || project.desc_ar || "").slice(0, 160);

  return {
    title: `${title} – MNC`,
    description,
    keywords: project.keywords?.length ? project.keywords.join(", ") : undefined,
    openGraph: {
      title: `${title} – MNC`,
      description,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.draft || project.archived) notFound();

  const related = await getRelatedProjects(project.category, slug, 3);

  return <ProjectPageClient project={project} related={related} />;
}

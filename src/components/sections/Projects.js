"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useFeaturedProjects } from "@/hooks/useProjects";
import { getLocalizedText } from "@/lib/i18nHelpers";
import { getCategoryLabel, PROJECT_CATEGORY_IDS } from "@/lib/projectCategories";

const Projects = () => {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const { projects: featured } = useFeaturedProjects(12);

  const projects = featured.map((p) => {
    const location = getLocalizedText(p, "location", lang);
    return {
      id: p.slug,
      // Public visitors see a location-based label, not the real project name.
      title: t("projectsSection.genericProjectName").replace("{location}", location),
      category: p.category,
      image: p.coverImage,
      location,
    };
  });

  const categories = [
    { key: "all", label: getCategoryLabel("all", lang) },
    ...PROJECT_CATEGORY_IDS
      .filter((id) => projects.some((p) => p.category === id))
      .map((id) => ({ key: id, label: getCategoryLabel(id, lang) })),
  ];

  const filteredProjects = filter === "all" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-16 md:py-20 bg-white dark:bg-primary">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className={`flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8`}>
          <div className={`${lang === 'ar' || lang === 'ur' ? 'text-right' : 'text-left'} w-full md:w-auto`} data-aos="fade-up">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm block mb-4">
              {t("projectsSection.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("projectsSection.titlePart1")}<span className="text-secondary">{t("projectsSection.titlePart2")}</span>{t("projectsSection.titlePart3")}
            </h2>
            <p className="text-muted mt-2 text-sm font-medium">
              {t("projectsSection.description")}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className={`flex flex-wrap justify-center gap-3`} data-aos="fade-up">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat.key
                    ? "bg-secondary text-white shadow-lg"
                    : "bg-slate-100 text-muted hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-md border border-slate-100 cursor-pointer"
              data-aos="zoom-in"
              data-aos-delay={Math.min(index * 30, 300)}
              onClick={() => setSelectedImage(project)}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4 z-10">
                <span className="text-secondary text-xs font-bold uppercase tracking-wider block mb-1">{project.location}</span>
                <h3 className="text-white text-sm font-bold">{project.title}</h3>
              </div>

              {/* Tag */}
              <div className="absolute top-3 left-3 z-10">
                <div className="glass-morphism px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase border border-white/20">
                  MNC
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              className="absolute top-0 right-0 text-white text-3xl font-bold bg-secondary rounded-full w-10 h-10 flex items-center justify-center z-10 hover:bg-secondary/80 transition"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <Image
              src={selectedImage.image}
              alt={selectedImage.title}
              width={1200}
              height={800}
              className="rounded-xl object-contain max-h-[80vh] w-auto"
              unoptimized
            />
            <p className="text-white mt-3 font-bold text-lg">{selectedImage.title}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;

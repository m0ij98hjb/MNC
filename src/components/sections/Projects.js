"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Projects = () => {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  const projects = [
    {
      id: 1,
      title: t("projectsSection.items.barjisFacade"),
      category: "barjis",
      image: "/asstes/office-projects/BARJIS FRONT FACADE (05.08.2025).jpg",
      location: t("projectsSection.categories.barjis")
    },
    {
      id: 2,
      title: t("projectsSection.items.barjisCourt"),
      category: "barjis",
      image: "/asstes/office-projects/BARJIS - INNER COURT (05.24.2025).jpg",
      location: t("projectsSection.categories.barjis")
    },
    {
      id: 3,
      title: t("projectsSection.items.barjisRoof"),
      category: "barjis",
      image: "/asstes/office-projects/BARJIS - ROOF (05.24.2025).jpg",
      location: t("projectsSection.categories.barjis")
    },
    {
      id: 4,
      title: t("projectsSection.items.barjisBasement"),
      category: "barjis",
      image: "/asstes/office-projects/28.jpg",
      location: t("projectsSection.categories.barjis")
    },
    {
      id: 5,
      title: t("projectsSection.items.villa1"),
      category: "residential",
      image: "/asstes/office-projects/1.jpg",
      location: "MNC"
    },
    {
      id: 6,
      title: t("projectsSection.items.villa2"),
      category: "residential",
      image: "/asstes/office-projects/2.jpg",
      location: "MNC"
    },
    {
      id: 7,
      title: t("projectsSection.items.villa3"),
      category: "residential",
      image: "/asstes/office-projects/3.jpg",
      location: "MNC"
    },
    {
      id: 8,
      title: t("projectsSection.items.villa4"),
      category: "residential",
      image: "/asstes/office-projects/4.jpg",
      location: "MNC"
    },
    {
      id: 9,
      title: t("projectsSection.items.interior1"),
      category: "recent",
      image: "/asstes/office-projects/40.jpg",
      location: "MNC"
    },
    {
      id: 10,
      title: t("projectsSection.items.interior2"),
      category: "recent",
      image: "/asstes/office-projects/41.jpg",
      location: "MNC"
    },
    {
      id: 11,
      title: t("projectsSection.items.interior3"),
      category: "recent",
      image: "/asstes/office-projects/43.jpg",
      location: "MNC"
    },
    {
      id: 12,
      title: t("projectsSection.items.interior4"),
      category: "recent",
      image: "/asstes/office-projects/10.jpg",
      location: "MNC"
    }
  ];

  const categories = [
    { key: "all", label: t("projectsSection.categories.all") },
    { key: "barjis", label: t("projectsSection.categories.barjis") },
    { key: "residential", label: t("projectsSection.categories.residential") },
    { key: "recent", label: t("projectsSection.categories.recent") },
  ];

  const filteredProjects = filter === "all" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-white dark:bg-primary">
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

        {/* View All Projects Button */}
        <div className="mt-16 text-center" data-aos="fade-up">
          <p className="text-white mb-6 italic">
            {t("projectsSection.more")}
          </p>
          <Link
            href="/projects"
            className={`inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-bold hover:bg-secondary/80 transition-all shadow-md ${
              lang === 'ar' || lang === 'ur' ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            {t("projectsSection.viewAll")}
            <ExternalLink size={18} className={lang === 'ar' || lang === 'ur' ? '' : 'rotate-180'} />
          </Link>
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

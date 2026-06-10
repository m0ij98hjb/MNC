"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Projects = () => {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  const projects = [
    // BARJIS Project - Selected best ones
    {
      id: 1,
      title: lang === 'ar' ? "مشروع بارجيس - الواجهة الأمامية" : "BARJIS - Front Facade",
      category: "barjis",
      image: "/asstes/office-projects/BARJIS FRONT FACADE (05.08.2025).jpg",
      location: lang === 'ar' ? "مشروع BARJIS" : "BARJIS Project"
    },
    {
      id: 2,
      title: lang === 'ar' ? "مشروع بارجيس - الفناء الداخلي" : "BARJIS - Inner Court",
      category: "barjis",
      image: "/asstes/office-projects/BARJIS - INNER COURT (05.24.2025).jpg",
      location: lang === 'ar' ? "مشروع BARJIS" : "BARJIS Project"
    },
    {
      id: 3,
      title: lang === 'ar' ? "مشروع بارجيس - السطح" : "BARJIS - Roof",
      category: "barjis",
      image: "/asstes/office-projects/BARJIS - ROOF (05.24.2025).jpg",
      location: lang === 'ar' ? "مشروع BARJIS" : "BARJIS Project"
    },
    {
      id: 4,
      title: lang === 'ar' ? "مشروع بارجيس - البدروم" : "BARJIS - Basement",
      category: "barjis",
      image: "/asstes/office-projects/BARJIS BASEMENT - TWO (07.13.2025).jpg",
      location: lang === 'ar' ? "مشروع BARJIS" : "BARJIS Project"
    },
    // Residential - Selected best ones
    {
      id: 5,
      title: lang === 'ar' ? "تصميم فيلا سكنية - 1" : "Residential Villa - 1",
      category: "residential",
      image: "/asstes/office-projects/1.jpg",
      location: "MNC"
    },
    {
      id: 6,
      title: lang === 'ar' ? "تصميم فيلا سكنية - 2" : "Residential Villa - 2",
      category: "residential",
      image: "/asstes/office-projects/2.jpg",
      location: "MNC"
    },
    {
      id: 7,
      title: lang === 'ar' ? "تصميم فيلا سكنية - 3" : "Residential Villa - 3",
      category: "residential",
      image: "/asstes/office-projects/3.jpg",
      location: "MNC"
    },
    {
      id: 8,
      title: lang === 'ar' ? "تصميم فيلا سكنية - 4" : "Residential Villa - 4",
      category: "residential",
      image: "/asstes/office-projects/4.jpg",
      location: "MNC"
    },
    // Recent - Selected best ones (Interior design)
    {
      id: 9,
      title: lang === 'ar' ? "أعمال داخلية حديثة - 1" : "Modern Interior Work - 1",
      category: "recent",
      image: "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (1).jpeg",
      location: "MNC"
    },
    {
      id: 10,
      title: lang === 'ar' ? "أعمال داخلية حديثة - 2" : "Modern Interior Work - 2",
      category: "recent",
      image: "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (3).jpeg",
      location: "MNC"
    },
    {
      id: 11,
      title: lang === 'ar' ? "أعمال داخلية حديثة - 3" : "Modern Interior Work - 3",
      category: "recent",
      image: "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 03.35.41.jpeg",
      location: "MNC"
    },
    {
      id: 12,
      title: lang === 'ar' ? "أعمال داخلية حديثة - 4" : "Modern Interior Work - 4",
      category: "recent",
      image: "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 05.15.23.jpeg",
      location: "MNC"
    }
  ];

  const categories = [
    { key: "all", label: lang === 'ar' ? "الكل" : "All" },
    { key: "barjis", label: lang === 'ar' ? "مشروع BARJIS" : "BARJIS Project" },
    { key: "residential", label: lang === 'ar' ? "مشاريع سكنية" : "Residential" },
    { key: "recent", label: lang === 'ar' ? "أعمال حديثة" : "Recent Work" },
  ];

  const filteredProjects = filter === "all" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-white dark:bg-primary">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className={`flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8`}>
          <div className={`${lang === 'ar' ? 'text-right' : 'text-left'} w-full md:w-auto`} data-aos="fade-up">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm block mb-4">
              {lang === 'ar' ? 'معرض الأعمال' : 'Portfolio'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {lang === 'ar' ? (
                <>بصماتنا <span className="text-secondary">الميدانية</span></>
              ) : (
                <>Our <span className="text-secondary">Field</span> Marks</>
              )}
            </h2>
            <p className="text-muted mt-2 text-sm">
              {lang === 'ar' ? 'أبرز المشاريع المختارة من أعمال مكتب MNC' : 'Selected highlights from MNC office projects'}
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
          <p className="text-muted mb-6 italic">
            {lang === 'ar' ? 'وهناك المزيد من المشاريع قيد التنفيذ...' : 'And there are more projects in progress...'}
          </p>
          <Link
            href="/projects"
            className={`inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-bold hover:bg-secondary/80 transition-all shadow-md ${
              lang === 'ar' ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            {lang === 'ar' ? 'شاهد جميع المشاريع' : 'View All Projects'}
            <ExternalLink size={18} className={lang === 'ar' ? '' : 'rotate-180'} />
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

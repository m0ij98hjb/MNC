"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Projects = () => {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState(lang === 'ar' ? "الكل" : "All");

  const projects = [
    {
      id: 1,
      title: lang === 'ar' ? "فيلا سكنية فاخرة" : "Luxury Residential Villa",
      category: lang === 'ar' ? "تصميم وتنفيذ" : "Design & Construction",
      image: "/project1.png",
      location: lang === 'ar' ? "جدة، حي أبحر" : "Jeddah, Obhur",
    },
    {
      id: 2,
      title: lang === 'ar' ? "برج إداري تجاري" : "Commercial Admin Tower",
      category: lang === 'ar' ? "إدارة مشاريع" : "Project Management",
      image: "/project2.png",
      location: lang === 'ar' ? "جدة، طريق الملك" : "Jeddah, King Road",
    },
    {
      id: 3,
      title: lang === 'ar' ? "مجمع فلل مودرن" : "Modern Villas Complex",
      category: lang === 'ar' ? "تصميم معماري" : "Architectural Design",
      image: "/project1.png",
      location: lang === 'ar' ? "جدة، حي المحمدية" : "Jeddah, Mohammedia",
    },
    {
      id: 4,
      title: lang === 'ar' ? "مقر شركة هندسية" : "Engineering Office Headquarters",
      category: lang === 'ar' ? "تصميم داخلي" : "Interior Design",
      image: "/project2.png",
      location: lang === 'ar' ? "جدة، حي الروضة" : "Jeddah, Rawdah",
    },
  ];

  const categories = lang === 'ar' 
    ? ["الكل", "تصميم وتنفيذ", "إدارة مشاريع", "تصميم معماري", "تصميم داخلي"]
    : ["All", "Design & Construction", "Project Management", "Architectural Design", "Interior Design"];

  const filteredProjects = filter === (lang === 'ar' ? "الكل" : "All")
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-16 bg-white dark:bg-primary">
      <div className="container mx-auto px-6 max-w-6xl">
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
          </div>

          <div className={`flex flex-wrap justify-center ${lang === 'ar' ? 'md:justify-end' : 'md:justify-start'} gap-4 w-full md:w-auto`} data-aos="fade-up">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat 
                    ? "bg-secondary text-white shadow-lg" 
                    : "bg-slate-100 text-muted hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative h-[350px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-slate-100"
              data-aos="zoom-in-up"
              data-aos-delay={index * 100}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                <div className={`flex justify-between items-end ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                    <span className="text-secondary text-sm font-bold uppercase tracking-widest block mb-2">{project.category}</span>
                    <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-slate-300 text-sm">{project.location}</p>
                  </div>
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-gold transition-colors">
                    <Plus size={32} />
                  </div>
                </div>
              </div>

              {/* Tag in corner */}
              <div className={`absolute top-6 ${lang === 'ar' ? 'right-6' : 'left-6'}`}>
                 <div className="glass-morphism px-4 py-2 rounded-full text-white text-xs font-bold tracking-widest uppercase border border-white/20">
                    MNC PROJECT
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center" data-aos="fade-up">
           <p className="text-muted mb-6 italic">
             {lang === 'ar' ? 'وهناك المزيد من المشاريع قيد التنفيذ...' : 'And there are more projects in progress...'}
           </p>
           <button className={`inline-flex items-center gap-2 text-secondary font-bold hover:gap-4 transition-all ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
             {lang === 'ar' ? 'شاهد جميع المشاريع' : 'View All Projects'} 
             <ExternalLink size={18} className={lang === 'ar' ? '' : 'rotate-180'} />
           </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;

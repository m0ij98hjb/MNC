"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "فيلا سكنية فاخرة",
    category: "تصميم وتنفيذ",
    image: "/project1.png",
    location: "جدة، حي أبحر",
  },
  {
    id: 2,
    title: "برج إداري تجاري",
    category: "إدارة مشاريع",
    image: "/project2.png",
    location: "جدة، طريق الملك",
  },
  {
    id: 3,
    title: "مجمع فلل مودرن",
    category: "تصميم معماري",
    image: "/project1.png",
    location: "جدة، حي المحمدية",
  },
  {
    id: 4,
    title: "مقر شركة هندسية",
    category: "تصميم داخلي",
    image: "/project2.png",
    location: "جدة، حي الروضة",
  },
];

const Projects = () => {
  const [filter, setFilter] = useState("الكل");

  const categories = ["الكل", "تصميم وتنفيذ", "إدارة مشاريع", "تصميم معماري", "تصميم داخلي"];

  const filteredProjects = filter === "الكل" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-16 bg-white dark:bg-primary">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div data-aos="fade-right">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm block mb-4">معرض الأعمال</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">بصماتنا <span className="text-secondary">الميدانية</span></h2>
          </div>

          <div className="flex flex-wrap gap-4" data-aos="fade-left">
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
                <div className="flex justify-between items-end">
                  <div>
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
              <div className="absolute top-6 right-6">
                 <div className="glass-morphism px-4 py-2 rounded-full text-white text-xs font-bold tracking-widest uppercase border border-white/20">
                    MNC PROJECT
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center" data-aos="fade-up">
           <p className="text-muted mb-6 italic">وهناك المزيد من المشاريع قيد التنفيذ...</p>
           <button className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-4 transition-all">
             شاهد جميع المشاريع <ExternalLink size={18} />
           </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;

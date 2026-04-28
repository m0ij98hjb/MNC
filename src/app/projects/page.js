"use client";

import Image from "next/image";
import Link from "next/link";
import TypewriterText from "@/components/TypewriterText";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import GalleryClient from "./GalleryClient";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectsPage() {
  const { lang, t } = useLanguage();

  const galleries = [
    {
      id: "construction",
      title: lang === 'ar' ? "المقاولات" : "Construction",
      description: lang === 'ar' ? "اضغط على الصورة لتكبيرها ومرر لتصفح باقي الصور" : "Click on the image to enlarge and scroll to browse the rest of the images",
      images: [
        "/asstes/vela1.png",
        "/asstes/vela2.png",
        "/asstes/vela3.png",
        "/asstes/vela4.png",
      ]
    },
    {
      id: "architecture",
      title: lang === 'ar' ? "التصميم المعماري" : "Architectural Design",
      description: lang === 'ar' ? "اضغط على الصورة لتكبيرها ومرر لتصفح باقي الصور" : "Click on the image to enlarge and scroll to browse the rest of the images",
      images: [
           "/asstes/mamary1.png",
           "/asstes/mamary2.png",
           "/asstes/mamary3.png",
           "/asstes/mamary4.png",
           "/asstes/mamary5.png",
           "/asstes/mamary6.png",
           "/asstes/mamary7.png",
           "/asstes/mamary8.png",
           "/asstes/mamary9.png",
           "/asstes/mamary10.png",
      ]
    },
    {
      id: "interior",
      title: lang === 'ar' ? "التصميم الداخلي" : "Interior Design",
      description: lang === 'ar' ? "اضغط على الصورة لتكبيرها ومرر لتصفح باقي الصور" : "Click on the image to enlarge and scroll to browse the rest of the images",
      images: [
      "/asstes/internal1.png",
      "/asstes/internal2.png",
      "/asstes/internal3.png",
      "/asstes/internal4.png",
      "/asstes/internal5.png",
      "/asstes/internal6.png",
      "/asstes/internal7.png",
      "/asstes/internal8.png",
      "/asstes/internal9.png",
      "/asstes/internal10.png",
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Projects Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-3xl md:text-6xl font-black text-white mb-6 font-heading">
              <TypewriterText
                texts={lang === 'ar' ? ["مشاريعنا"] : ["Our Projects"]}
                typingSpeed={120}
                deletingSpeed={60}
                pauseDuration={2000}
                loop={true}
                className="text-white"
              />
            </h1>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-xl text-white/80 leading-relaxed font-semibold">
              {lang === 'ar' ? 'اكتشف إبداعاتنا في مختلف المجالات الهندسية' : 'Discover our creations in various engineering fields'}
            </p>
          </div>
        </div>
      </section>

      {/* Galleries Section */}
      <section className="py-24 bg-white text-slate-900">
        <div className="container mx-auto px-6 max-w-7xl space-y-32">
          <GalleryClient galleries={galleries} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-heading">
            {lang === 'ar' ? 'هل لديك مشروع قادم؟' : 'Have a future project?'}
          </h2>
          <Link href="/contact" className={`inline-flex items-center gap-2 bg-[#eaeaea] text-secondary px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all shadow-xl ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
            {lang === 'ar' ? 'دعنا نتحدث' : "Let's Talk"}
            {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </Link>
        </div>
      </section>
    </main>
  );
}

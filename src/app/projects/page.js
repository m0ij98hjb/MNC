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
      title: lang === 'ar' ? "مشروع BARJIS" : "BARJIS Project",
      description: lang === 'ar' ? "اضغط على الصورة لتكبيرها ومرر لتصفح باقي الصور" : "Click on the image to enlarge and scroll to browse the rest of the images",
      images: [
        "/asstes/office-projects/BARJIS FRONT FACADE (05.08.2025).jpg",
        "/asstes/office-projects/BARJIS - BACK ENTRANCE (07.07.2025).jpg",
        "/asstes/office-projects/BARJIS - BACK ENTRANCE 02 (07.07.2025).jpg",
        "/asstes/office-projects/BARJIS - INNER COURT (05.24.2025).jpg",
        "/asstes/office-projects/BARJIS - INNER COURT (TWO) (05.24.2025).jpg",
        "/asstes/office-projects/BARJIS - PARKING ENTRANCE (07.07.2025).jpg",
        "/asstes/office-projects/BARJIS - ROOF (05.24.2025).jpg",
        "/asstes/office-projects/BARJIS BASEMENT - TWO (07.13.2025).jpg",
      ]
    },
    {
      id: "architecture",
      title: lang === 'ar' ? "مشاريع سكنية وإنشائية" : "Residential & Construction Projects",
      description: lang === 'ar' ? "اضغط على الصورة لتكبيرها ومرر لتصفح باقي الصور" : "Click on the image to enlarge and scroll to browse the rest of the images",
      images: [
        "/asstes/office-projects/1.jpg",
        "/asstes/office-projects/2.jpg",
        "/asstes/office-projects/3.jpg",
        "/asstes/office-projects/4.jpg",
        "/asstes/office-projects/5.jpg",
        "/asstes/office-projects/8.jpg",
        "/asstes/office-projects/10.jpg",
        "/asstes/office-projects/11.jpg",
        "/asstes/office-projects/12.jpg",
        "/asstes/office-projects/13.jpg",
        "/asstes/office-projects/14.jpg",
        "/asstes/office-projects/15.jpg",
        "/asstes/office-projects/16.jpg",
        "/asstes/office-projects/17.jpg",
        "/asstes/office-projects/18.jpg",
        "/asstes/office-projects/19.jpg",
        "/asstes/office-projects/20.jpg",
        "/asstes/office-projects/21.jpg",
        "/asstes/office-projects/22.jpg",
        "/asstes/office-projects/23.jpg",
        "/asstes/office-projects/24.jpg",
        "/asstes/office-projects/25.jpg",
        "/asstes/office-projects/26.jpg",
        "/asstes/office-projects/27.jpg",
        "/asstes/office-projects/28.jpg",
        "/asstes/office-projects/29.jpg",
        "/asstes/office-projects/30.jpg",
        "/asstes/office-projects/31.jpg",
        "/asstes/office-projects/32.jpg",
        "/asstes/office-projects/33.jpg",
        "/asstes/office-projects/34.jpg",
        "/asstes/office-projects/35.jpg",
        "/asstes/office-projects/36.jpg",
        "/asstes/office-projects/37.jpg",
        "/asstes/office-projects/38.jpg",
        "/asstes/office-projects/39.jpg",
        "/asstes/office-projects/40.jpg",
        "/asstes/office-projects/41.jpg",
        "/asstes/office-projects/42.jpg",
        "/asstes/office-projects/43.jpg",
        "/asstes/office-projects/44.jpg",
        "/asstes/office-projects/45.jpg",
        "/asstes/office-projects/46.jpg",
        "/asstes/office-projects/47.jpg",
        "/asstes/office-projects/48.jpg",
        "/asstes/office-projects/50.jpg",
        "/asstes/office-projects/51.jpg",
        "/asstes/office-projects/52.jpg",
        "/asstes/office-projects/53.jpg",
        "/asstes/office-projects/54.jpg",
        "/asstes/office-projects/55.jpg",
        "/asstes/office-projects/56.jpg",
        "/asstes/office-projects/57.jpg",
        "/asstes/office-projects/58.jpg",
        "/asstes/office-projects/59.jpg",
        "/asstes/office-projects/60.jpg",
        "/asstes/office-projects/61.jpg",
      ]
    },
    {
      id: "interior",
      title: lang === 'ar' ? "أعمال حديثة 2025" : "Recent Work 2025",
      description: lang === 'ar' ? "اضغط على الصورة لتكبيرها ومرر لتصفح باقي الصور" : "Click on the image to enlarge and scroll to browse the rest of the images",
      images: [
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (1).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (2).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (3).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (4).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (5).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (6).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (7).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (8).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (9).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (10).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48 (11).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.48.jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.49 (1).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.49 (2).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.49 (3).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.49 (4).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.49 (5).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 02.52.49.jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 09.08.25.jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 09.08.26 (1).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 09.08.26.jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 09.08.27.jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-29 at 09.08.28.jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 03.35.41 (1).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 03.35.41 (2).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 03.35.41.jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 03.35.42 (1).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 03.35.42 (2).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 03.35.42 (3).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 03.35.42.jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 05.15.23 (1).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 05.15.23 (2).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 05.15.23 (3).jpeg",
        "/asstes/office-projects/New folder/WhatsApp Image 2025-12-30 at 05.15.23.jpeg",
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/asstes/office-projects/BARJIS FRONT FACADE (05.08.2025).jpg"
            alt="Projects Background"
            fill
            className="object-cover opacity-90 scale-105 animate-slow-zoom"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/15" />
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

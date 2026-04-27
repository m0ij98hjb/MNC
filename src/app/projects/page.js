import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ZoomIn, Globe, Share2, MessageCircle, Link as LinkIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "مشاريعنا – MNC",
  description: "استعرض أحدث مشاريعنا في المقاولات، التصميم المعماري، والتصميم الداخلي.",
};

const galleries = [
  {
    id: "construction",
    title: "المقاولات",
    description: "اضغط على الصورة لتكبيرها ومرر لتصفح باقي الصور",
    images: [
      "/project1.png",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
    ]
  },
  {
    id: "architecture",
    title: "التصميم المعماري",
    description: "اضغط على الصورة لتكبيرها ومرر لتصفح باقي الصور",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1481253127861-534498168948?q=80&w=2070&auto=format&fit=crop",
    ]
  },
  {
    id: "interior",
    title: "التصميم الداخلي",
    description: "اضغط على الصورة لتكبيرها ومرر لتصفح باقي الصور",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2070&auto=format&fit=crop",
    ]
  }
];

export default function ProjectsPage() {
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
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading">
              مشاريعنا
            </h1>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-xl text-white/80 leading-relaxed font-semibold">
              اكتشف إبداعاتنا في مختلف المجالات الهندسية
            </p>
          </div>
        </div>
      </section>

      {/* Galleries Section */}
      <section className="py-24 bg-white text-slate-900">
        <div className="container mx-auto px-6 max-w-7xl space-y-32">
          
          {galleries.map((gallery, index) => (
            <div key={gallery.id} className="space-y-12" data-aos="fade-up">
              {/* Section Header */}
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-4 relative inline-block">
                  {gallery.title}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-secondary rounded-full"></div>
                </h2>
                <p className="text-slate-500 font-medium mt-6">
                  {gallery.description}
                </p>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gallery.images.map((imgSrc, imgIndex) => (
                  <div 
                    key={imgIndex} 
                    className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-slate-100"
                    data-aos="zoom-in"
                    data-aos-delay={imgIndex * 100}
                  >
                    <Image 
                      src={imgSrc} 
                      alt={`${gallery.title} - Image ${imgIndex + 1}`} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <ZoomIn size={40} className="text-white transform scale-50 group-hover:scale-100 transition-transform duration-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-heading">
            هل لديك مشروع قادم؟
          </h2>
          <Link href="/#contact" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all shadow-xl">
            دعنا نتحدث
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}

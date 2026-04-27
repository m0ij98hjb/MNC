"use client";

import Image from "next/image";
import Button from "../ui/Button";
import { ArrowLeft } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="MNC Construction Hero"
          fill
          className="object-cover opacity-80 scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/30 to-transparent"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-secondary/30 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="text-secondary text-sm font-bold tracking-widest uppercase">
              نصنع بصمتنا في عالم البناء
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            بصمة هندسية <br />
            <span className="text-gradient">متميزة</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            مؤسسة مروان أحمد ناظر للمقاولات العامة - خبرة عريقة في التصميم المعماري، إدارة المشاريع، والتنفيذ الإنشائي بأعلى معايير الجودة العالمية.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex items-center justify-center gap-2 group">
              استكشف مشاريعنا
              <ArrowLeft className="group-hover:translate-x-[-5px] transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              من نحن
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 hidden lg:block" data-aos="fade-right">
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-bold text-white">15+</span>
          <span className="text-sm text-muted uppercase tracking-widest">عاماً من الخبرة</span>
        </div>
      </div>
      
      <div className="absolute bottom-10 right-10 hidden lg:block" data-aos="fade-left">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-4xl font-bold text-white">200+</span>
          <span className="text-sm text-muted uppercase tracking-widest text-right">مشروع ناجح</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

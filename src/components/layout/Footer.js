"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { lang } = useLanguage();

  return (
    <footer className="bg-[#eaeaea] py-8 border-t border-slate-300 w-full mt-auto">
      <div className="container mx-auto px-6">
        <div className={`flex flex-col md:flex-row justify-between items-center gap-6 ${lang === 'ar' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          {/* Logo */}
          <div className="flex items-center group">
            <Image
              src="https://marwannazer.com/wp-content/uploads/2018/05/أللوقو-الرئيسي.png"
              alt="MNC Logo"
              width={110}
              height={55}
              className="h-11 w-auto object-contain transition-all duration-500 group-hover:scale-105"
              priority
            />
          </div>

          {/* Copyright */}
          <p className={`text-slate-700 font-medium text-sm ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            &copy; {new Date().getFullYear()} {lang === 'ar' ? 'مروان ناظر للمقاولات. جميع الحقوق محفوظة.' : 'Marwan Nazer Construction. All Rights Reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

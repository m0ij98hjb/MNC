import Image from "next/image";
import { Globe, Share2, MessageCircle, Link as LinkIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#eaeaea] py-8 border-t border-slate-300 w-full mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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
           
           {/* Social / Links */}
           <div className="flex gap-6">
              <Globe className="text-slate-600 hover:text-primary cursor-pointer transition-colors" size={20} />
              <Share2 className="text-slate-600 hover:text-primary cursor-pointer transition-colors" size={20} />
              <MessageCircle className="text-slate-600 hover:text-primary cursor-pointer transition-colors" size={20} />
              <LinkIcon className="text-slate-600 hover:text-primary cursor-pointer transition-colors" size={20} />
           </div>

           {/* Copyright */}
           <p className="text-slate-700 font-medium text-sm">
              &copy; {new Date().getFullYear()} مروان ناظر للمقاولات. جميع الحقوق محفوظة.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

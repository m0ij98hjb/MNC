import { Cairo } from "next/font/google";
import "./globals.css";
import { AOSInit } from "@/components/AOSInit";
import VoicePresentation from "@/components/VoicePresentation";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "مروان ناظر للاستشارات الهندسية: MNC",
  description: "خدماتنا ; مشاريع مقاولات. دراسة وتنفيذ ; التصميم المعماري. الأفكار والحلول ; إدارة المشاريع. إدارة التنفيذ ; التصميم الداخلي. الديكور والتشطيب ...",
  icons: {
    icon: "/asstes/logo13.png",
    apple: "/asstes/logo13.png",
  },
};

import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="antialiased flex flex-col min-h-screen relative">
        <LanguageProvider>
          <AOSInit />
          <VoicePresentation />
          {children}
          <FloatingContact />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

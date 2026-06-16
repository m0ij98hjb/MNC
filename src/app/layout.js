import { Cairo } from "next/font/google";
import "./globals.css";
import { AOSInit } from "@/components/AOSInit";
import VoicePresentation from "@/components/VoicePresentation";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicProvider } from "@/context/MusicContext";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "شركة ام ان سى للانشاءات: MNC",
  description: "خدماتنا ; مشاريع مقاولات. دراسة وتنفيذ ; التصميم المعماري. الأفكار والحلول ; إدارة المشاريع. إدارة التنفيذ ; التصميم الداخلي. الديكور والتشطيب ...",
  icons: {
    icon: [
      { url: "/icon-new.png", type: "image/png", sizes: "any" },
    ],
    apple: [
      { url: "/icon-new.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: "/icon-new.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="antialiased flex flex-col min-h-screen relative">
        <ThemeProvider>
          <LanguageProvider>
            <MusicProvider>
              <AOSInit />
              <VoicePresentation />
              {children}
              <FloatingContact />
              <Footer />
            </MusicProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

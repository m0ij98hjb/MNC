import { Cairo } from "next/font/google";
import "./globals.css";
import { AOSInit } from "@/components/AOSInit";
import VoicePresentation from "@/components/VoicePresentation";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicProvider } from "@/context/MusicContext";
import { AuthProvider } from "@/context/AuthContext";
import AdminShortcut from "@/components/AdminShortcut";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL("https://mnc.sa"),
  title: "شركة ام ان سى للانشاءات: MNC",
  description: "خدماتنا ; مشاريع مقاولات. دراسة وتنفيذ ; التصميم المعماري. الأفكار والحلول ; إدارة المشاريع. إدارة التنفيذ ; التصميم الداخلي. الديكور والتشطيب ...",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    siteName: "MNC",
  },
  verification: {
    google: "0fmi6g2GS7XJ1e8FD_ScN_zIZwWnpJPEJmAOSyb3bwI",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="antialiased flex flex-col min-h-screen relative">
        <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <MusicProvider>
              <AOSInit />
              <AdminShortcut />
              <VoicePresentation />
              {children}
              <FloatingContact />
              <Footer />
            </MusicProvider>
          </LanguageProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

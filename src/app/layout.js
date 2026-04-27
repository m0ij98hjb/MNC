import { Cairo } from "next/font/google";
import "./globals.css";
import { AOSInit } from "@/components/AOSInit";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "MNC Construction | Eng. Marwan Ahmed Nazer",
  description: "A distinguished engineering mark in construction and architectural design. Managed by Eng. Marwan Ahmed Nazer.",
};

import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <AOSInit />
        {children}
        <Footer />
      </body>
    </html>
  );
}

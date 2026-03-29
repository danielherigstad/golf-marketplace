import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: {
    default: "GolfMarked — Kjøp og selg brukt golfutstyr",
    template: "%s | GolfMarked",
  },
  description:
    "Norges markedsplass for brukt golfutstyr. Finn drivere, jern, puttere, bagger og mer. Gratis å legge ut annonser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}

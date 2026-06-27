import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fizo QR — Yapay Zeka Destekli QR Menü",
    template: "%s | Fizo QR",
  },
  description:
    "Restoranlar için yapay zeka destekli QR menü sistemi. Kalori, alerjen tespiti, sipariş ve masa yönetimi — tek panelde.",
  keywords: ["qr menü", "dijital menü", "restoran menü", "yapay zeka menü"],
  openGraph: {
    title: "Fizo QR — Yapay Zeka Destekli QR Menü",
    description: "Restoranlar için QR menü sistemi",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

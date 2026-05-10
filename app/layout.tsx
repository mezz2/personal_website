import type { Metadata } from "next";
import { Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Hoops Lab",
  description: "Building data science skills through my passion for the NBA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} ${pressStart2P.variable} h-full`}>
      <body className="min-h-full bg-[#0a0a0a] text-[#f3f4f6] flex flex-col font-[family-name:var(--font-geist-mono)]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

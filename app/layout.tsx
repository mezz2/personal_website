import type { Metadata } from "next";
import { JetBrains_Mono, Press_Start_2P, Newsreader } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Riley Meredith",
    template: "%s · Riley Meredith",
  },
  description:
    "A young 20-something navigating AI, personal finance, and entrepreneurship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${pressStart2P.variable} ${newsreader.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[var(--paper)] text-[var(--ink)] font-[family-name:var(--font-serif)] antialiased">
        {children}
      </body>
    </html>
  );
}

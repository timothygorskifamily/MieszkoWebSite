import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { BackgroundAudio } from "@/components/background-audio";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Honoring Mieszko Gorski | Composer, Programmer, Father",
  description:
    "A warm tribute site celebrating Mieszko Gorski: composer, professor, immigrant, programmer, and musician once again.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} overflow-x-hidden font-sans antialiased`}>
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:text-stone-50"
        >
          Skip to content
        </a>
        <BackgroundAudio />
        {children}
      </body>
    </html>
  );
}

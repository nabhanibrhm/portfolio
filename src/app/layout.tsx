import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";

// Satoshi (Fontshare) — self-hosted variable font, full 300–900 weight range.
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  style: "normal",
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luthfi Nabhan Ibrahim — Data Engineer",
  description:
    "Portfolio of Luthfi Nabhan Ibrahim — Data Engineer building pipelines, platforms, and interactive experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Preloader />
        <SmoothScroll />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

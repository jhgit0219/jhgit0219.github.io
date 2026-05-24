import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollReset from "@/components/ScrollReset";
import CustomCursor from "@/components/CustomCursor";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import SceneBackdrop from "@/components/SceneBackdrop";
import ImagePreloader from "@/components/ImagePreloader";
import MotionWarmup from "@/components/MotionWarmup";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jetchomen | Full Stack Developer",
  description:
    "Portfolio of Jetchomen Husain – Full Stack Developer specializing in React, Spring Boot, and PEGA.",
  icons: {
    icon: "/images/j-icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollReset />
        <CustomCursor />
        <ImagePreloader />
        <MotionWarmup />
        <SceneBackdrop />
        <SmoothScrollProvider>
          {/* The actual scroll container for the whole site. Lives in the
              layout so it's stable across client-side route changes
              (SceneBackdrop / Lenis attach listeners to this element once
              and don't get stale on navigation). Its bottom edge ends 80px
              above the viewport bottom, reserving that strip for the camera
              footer (progress bar + diagnostic) — content physically cannot
              scroll into it. */}
          <main
            id="scroll-root"
            className="fixed inset-x-0 top-16 bottom-12 z-10 overflow-y-auto overflow-x-hidden"
          >
            <div id="scroll-content" className="w-full">
              {children}
            </div>
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

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

const SITE_URL = "https://jhgit0219-github-io.vercel.app";
const SITE_TITLE = "Jetchomen Husain — Full-Stack & AI Engineering Portfolio";
const SITE_DESCRIPTION =
  "Full-stack engineer at Accenture. Enterprise stacks by day — React, Spring Boot, .NET, PEGA — plus multi-agent orchestration and AI tooling after hours.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/images/j-icon.ico",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Jetchomen Husain",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 572,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
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
          {/* Site-wide scroll container. Lives in layout (not page) so
              listeners attached by Lenis / SceneBackdrop survive route
              changes. Inset top-16/bottom-12 reserves the HUD bands. */}
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

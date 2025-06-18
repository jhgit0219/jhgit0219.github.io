import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollReset from "@/components/ScrollReset";
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
        {children}
      </body>
    </html>
  );
}

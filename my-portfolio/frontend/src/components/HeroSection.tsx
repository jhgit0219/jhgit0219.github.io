"use client";

import { useEffect, useRef } from "react";

export default function HeroSection({
  onViewWorkClick,
}: {
  onViewWorkClick: () => void;
}) {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const spotlight = spotlightRef.current;
      if (spotlight) {
        const rect = spotlight.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 12, 12, 0.2), transparent 40%)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-screen h-screen text-white font-sans overflow-hidden flex flex-col justify-center items-center smoke-bg"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute bottom-0 left-0 w-full h-40 z-10 pointer-events-none bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      <div
        className="absolute inset-0 z-0 pointer-events-none animate-smoke-overlay bg-[url('/images/hero-bg.png')] bg-repeat bg-cover"
        style={{
          opacity: 1,
          backgroundSize: "150% 150%",
          mixBlendMode: "lighten",
        }}
      />

      <div
        ref={spotlightRef}
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 w-full items-center">
        <div className="text-left ml-24">
          <span className="text-2xl md:text-3xl text-red-400 font-semibold mb-0 block leading-tight">
            Hello, I’m
          </span>
          <h1 className="text-8xl md:text-8xl font-extrabold uppercase bg-gradient-to-r from-red-600 via-red-400 to-red-600 text-transparent bg-clip-text tracking-wider mb-4">
            JETCHOMEN
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
            I'm an experienced full stack developer specializing in scalable web
            apps, automation systems, and enterprise solutions using React,
            Spring Boot, and PEGA.
          </p>

          <a
            onClick={onViewWorkClick}
            className="inline-block mt-6 text-red-400 hover:bg-red-600/20 transition px-4 py-2 rounded-lg cursor-pointer"
          >
            View My Work
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

type Props = { children: React.ReactNode };

export default function SmoothScrollProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // #scroll-root is the fixed-positioned <main> that replaces document
    // scroll; #scroll-content is its single child wrapping the page sections.
    // Both are rendered by page.tsx and are present by the time this effect
    // runs (children mount before effects fire in the parent).
    const wrapper = document.getElementById("scroll-root");
    const content = document.getElementById("scroll-content");
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  '.cursor-card, [data-cursor-glow], a, button, [role="button"]';

const TRAIL: { size: number; ease: number }[] = [
  { size: 22, ease: 0.32 },
  { size: 18, ease: 0.22 },
  { size: 14, ease: 0.16 },
  { size: 10, ease: 0.11 },
];

const MAIN_SIZE = 28;

export default function CustomCursor() {
  const mainNodeRef = useRef<HTMLDivElement>(null);
  const trailNodesRef = useRef<(HTMLDivElement | null)[]>(
    TRAIL.map(() => null)
  );
  const currentTargetRef = useRef<Element | null>(null);

  const mouseRef = useRef({ x: -200, y: -200 });
  const trailPosRef = useRef(TRAIL.map(() => ({ x: -200, y: -200 })));
  const scaleRef = useRef(1);

  const lastCursorYRef = useRef(-1);
  const outsideHeroRef = useRef(false);
  const hoveringRef = useRef(false);

  const [outsideHero, setOutsideHero] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
    setEnabled(mq.matches);
    const listener = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const recheckVisibility = () => {
      if (lastCursorYRef.current < 0) return;
      const hero = document.getElementById("hero");
      if (!hero) {
        if (!outsideHeroRef.current) {
          outsideHeroRef.current = true;
          setOutsideHero(true);
        }
        return;
      }
      const heroBottom = hero.getBoundingClientRect().bottom;
      const next = lastCursorYRef.current > heroBottom;
      if (next !== outsideHeroRef.current) {
        outsideHeroRef.current = next;
        setOutsideHero(next);
      }
    };

    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      lastCursorYRef.current = e.clientY;

      const main = mainNodeRef.current;
      if (main) {
        main.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(${scaleRef.current})`;
      }

      recheckVisibility();
    };

    // Write cursor position as the card's pour-fill origin. Called only on
    // enter (fill starts here) and just before exit (retract shrinks here),
    // never on every mousemove.
    const writeFillOriginOn = (el: Element | null) => {
      if (!el) return;
      const card =
        el instanceof HTMLElement && el.classList.contains("cursor-card")
          ? el
          : el.closest?.(".cursor-card") ?? null;
      if (card instanceof HTMLElement) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--fill-x", `${mouseRef.current.x - rect.left}px`);
        card.style.setProperty("--fill-y", `${mouseRef.current.y - rect.top}px`);
      }
    };

    const handleScroll = () => recheckVisibility();

    const clearCurrent = () => {
      if (currentTargetRef.current) {
        // Update origin to cursor's current position so retract shrinks there.
        writeFillOriginOn(currentTargetRef.current);
        currentTargetRef.current.removeAttribute("data-cursor-active");
        currentTargetRef.current = null;
      }
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      for (const pos of trailPosRef.current) {
        pos.x = mx;
        pos.y = my;
      }
      hoveringRef.current = false;
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || typeof target.closest !== "function") return;
      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (!interactive) {
        clearCurrent();
        return;
      }
      if (interactive === currentTargetRef.current) return;

      // Switching targets: update old card's origin to exit point before unsetting.
      if (currentTargetRef.current) {
        writeFillOriginOn(currentTargetRef.current);
        currentTargetRef.current.removeAttribute("data-cursor-active");
      }
      // Set new card's origin at cursor's entry position.
      writeFillOriginOn(target);
      interactive.setAttribute("data-cursor-active", "true");
      currentTargetRef.current = interactive;
      hoveringRef.current = true;
    };

    const handleOut = (e: MouseEvent) => {
      const related = e.relatedTarget as Element | null;
      const relatedInteractive =
        related && typeof related.closest === "function"
          ? related.closest(INTERACTIVE_SELECTOR)
          : null;
      if (!relatedInteractive) clearCurrent();
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    document.addEventListener("mouseleave", clearCurrent);

    let raf = 0;
    const tick = () => {
      scaleRef.current = 1;

      for (let i = 0; i < TRAIL.length; i++) {
        const pos = trailPosRef.current[i];
        const spec = TRAIL[i];
        if (!pos || !spec) continue;
        pos.x += (mouseRef.current.x - pos.x) * spec.ease;
        pos.y += (mouseRef.current.y - pos.y) * spec.ease;
        const node = trailNodesRef.current[i];
        if (node) {
          node.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scaleRef.current})`;
        }
      }
      const main = mainNodeRef.current;
      if (main) {
        const x = mouseRef.current.x;
        const y = mouseRef.current.y;
        main.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scaleRef.current})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mouseleave", clearCurrent);
      cancelAnimationFrame(raf);
      clearCurrent();
    };
  }, [enabled]);

  if (!enabled) return null;

  const heroOpacity = outsideHero ? 1 : 0;

  return (
    <>
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          <filter id="cursor-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 6 -2"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          filter: "url(#cursor-goo)",
          opacity: heroOpacity,
          mixBlendMode: "lighten",
          transition: "opacity 260ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "opacity",
        }}
      >
        {TRAIL.map((spec, i) => (
          <div
            key={i}
            ref={(node) => {
              trailNodesRef.current[i] = node;
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: spec.size,
              height: spec.size,
              marginLeft: -spec.size / 2,
              marginTop: -spec.size / 2,
              borderRadius: "9999px",
              background: "rgb(153, 27, 27)",
              willChange: "transform",
            }}
          />
        ))}

        <div
          ref={mainNodeRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: MAIN_SIZE,
            height: MAIN_SIZE,
            marginLeft: -MAIN_SIZE / 2,
            marginTop: -MAIN_SIZE / 2,
            borderRadius: "9999px",
            background: "rgb(153, 27, 27)",
            willChange: "transform",
          }}
        />
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  '.cursor-card, [data-cursor-glow], a, button, [role="button"]';

// Trail sizes ≥ 10 — below the goo threshold (~0.39 after 18×-7 matrix at
// stdDev 6) the blobs flicker.
const TRAIL: { size: number; ease: number }[] = [
  { size: 16, ease: 0.32 },
  { size: 14, ease: 0.22 },
  { size: 12, ease: 0.16 },
  { size: 10, ease: 0.11 },
];

const MAIN_SIZE = 18;

const DRIP_COUNT = 14;
const DRIP_LIFETIME = 200;
const DRIP_SPAWN_INTERVAL_MS = 340;
const DRIP_BASE_SIZE = 14;
const DRIP_GRAVITY = 0.12;
const SPLASH_LIFETIME = 18;
const COLLISION_GRACE_FRAMES = 5;

type DripState = "falling" | "splashing";
type Drip = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  size: number;
  alive: boolean;
  state: DripState;
  splashAge: number;
  // If set, drip splashes at this element's bottom edge. If null, drip
  // splashes on the first DRIP_TARGET_SELECTOR it enters.
  spawnContainer: Element | null;
};

const DRIP_CONTAINER_SELECTOR =
  '.cursor-card, button, a[href], [role="button"], [data-drip-container]';
const DRIP_TARGET_SELECTOR =
  '.cursor-card, h1, h2, h3, h4, h5, h6, p, li, button, a[href], [role="button"], img, svg, [data-drip-target]';

// Text tags use glyph-precise Range hit-testing so drips can fall through
// line gaps and trailing whitespace.
const TEXT_TAGS = new Set([
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "P",
  "LI",
  "SPAN",
]);

function isOverRenderedText(el: Element, x: number, y: number): boolean {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (!node.textContent || !node.textContent.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = range.getClientRects();
    for (const rect of rects) {
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return true;
      }
    }
  }
  return false;
}

export default function CustomCursor() {
  const mainNodeRef = useRef<HTMLDivElement>(null);
  const trailNodesRef = useRef<(HTMLDivElement | null)[]>(
    TRAIL.map(() => null),
  );
  const currentTargetRef = useRef<Element | null>(null);

  const mouseRef = useRef({ x: -200, y: -200 });
  const trailPosRef = useRef(TRAIL.map(() => ({ x: -200, y: -200 })));
  const scaleRef = useRef(1);

  const dripsRef = useRef<Drip[]>(
    Array.from({ length: DRIP_COUNT }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      age: 0,
      size: 0,
      alive: false,
      state: "falling" as DripState,
      splashAge: 0,
      spawnContainer: null,
    })),
  );
  const dripNodesRef = useRef<(HTMLDivElement | null)[]>(
    Array(DRIP_COUNT).fill(null),
  );
  const lastDripTimeRef = useRef(0);

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

    const spawnDrip = (cx: number, cy: number) => {
      if (cx < 0 || cy < 0) return;
      const now = performance.now();
      if (now - lastDripTimeRef.current < DRIP_SPAWN_INTERVAL_MS) return;
      const drips = dripsRef.current;
      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
        if (!d || d.alive) continue;
        // Y offset detaches the drop from the cursor's goo merge radius
        // so it visibly drips instead of being absorbed back into the blob.
        d.x = cx + (Math.random() - 0.5) * 3;
        d.y = cy + 6 + Math.random() * 8;
        d.vx = (Math.random() - 0.5) * 0.25;
        d.vy = 0.15 + Math.random() * 0.25;
        d.age = 0;
        d.size = 12 + Math.random() * 6;
        d.alive = true;
        d.state = "falling";
        d.splashAge = 0;
        const spawnEl = document.elementFromPoint(d.x, d.y);
        d.spawnContainer = spawnEl?.closest(DRIP_CONTAINER_SELECTOR) ?? null;
        lastDripTimeRef.current = now;
        return;
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

      spawnDrip(e.clientX, e.clientY);
      recheckVisibility();
    };

    // Writes the cursor entry/exit point as the card's CSS fill origin
    // so the radial flood expands from where the cursor crossed the edge.
    const writeFillOriginOn = (el: Element | null) => {
      if (!el) return;
      const card =
        el instanceof HTMLElement && el.classList.contains("cursor-card")
          ? el
          : (el.closest?.(".cursor-card") ?? null);
      if (card instanceof HTMLElement) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty(
          "--fill-x",
          `${mouseRef.current.x - rect.left}px`,
        );
        card.style.setProperty(
          "--fill-y",
          `${mouseRef.current.y - rect.top}px`,
        );
      }
    };

    const handleScroll = () => recheckVisibility();

    const clearCurrent = () => {
      if (currentTargetRef.current) {
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
      document.body.removeAttribute("data-cursor-hovering");
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

      if (currentTargetRef.current) {
        writeFillOriginOn(currentTargetRef.current);
        currentTargetRef.current.removeAttribute("data-cursor-active");
      }
      writeFillOriginOn(target);
      interactive.setAttribute("data-cursor-active", "true");
      currentTargetRef.current = interactive;
      hoveringRef.current = true;
      // Color flip only fires on cards (the red flood needs dark contrast).
      // Plain links / buttons keep the default red cursor.
      const inCard =
        (interactive instanceof HTMLElement &&
          interactive.classList.contains("cursor-card")) ||
        (typeof interactive.closest === "function" &&
          interactive.closest(".cursor-card"));
      if (inCard) {
        document.body.setAttribute("data-cursor-hovering", "true");
      } else {
        document.body.removeAttribute("data-cursor-hovering");
      }
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

      // Spawn from rAF too so drips keep falling while the cursor is idle.
      spawnDrip(mouseRef.current.x, mouseRef.current.y);

      const drips = dripsRef.current;
      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
        const node = dripNodesRef.current[i];
        if (!node || !d) continue;
        if (!d.alive) {
          if (node.style.opacity !== "0") node.style.opacity = "0";
          continue;
        }
        const sizeScale = d.size / DRIP_BASE_SIZE;

        if (d.state === "splashing") {
          d.splashAge += 1;
          if (d.splashAge >= SPLASH_LIFETIME) {
            d.alive = false;
            node.style.opacity = "0";
            continue;
          }
          const sp = d.splashAge / SPLASH_LIFETIME;
          const splashX = 1 + sp * 3; // 1 → 4
          const splashY = Math.max(0.08, 1 - sp * 0.95); // 1 → 0.05
          node.style.opacity = String(1 - sp);
          node.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) scale(${sizeScale * splashX}, ${sizeScale * splashY})`;
          continue;
        }

        d.vy += DRIP_GRAVITY;
        d.vx *= 0.985;
        d.x += d.vx;
        d.y += d.vy;
        d.age += 1;

        if (d.y > window.innerHeight + 30 || d.age >= DRIP_LIFETIME) {
          d.alive = false;
          node.style.opacity = "0";
          continue;
        }

        // Two collision checks, whichever fires first splashes the drop:
        //   A) bottom edge of the spawn container (always, so drops in
        //      card padding don't miss the bottom).
        //   B) elementFromPoint hitting a different target than the spawn
        //      container (free-fall onto text / siblings).
        if (d.age > COLLISION_GRACE_FRAMES) {
          let hit = false;

          if (d.spawnContainer) {
            const rect = d.spawnContainer.getBoundingClientRect();
            if (d.y >= rect.bottom) {
              d.y = rect.bottom;
              hit = true;
            }
          }

          if (!hit) {
            const el = document.elementFromPoint(d.x, d.y);
            const target = el?.closest(DRIP_TARGET_SELECTOR) ?? null;
            if (target && target !== d.spawnContainer) {
              if (TEXT_TAGS.has(target.tagName)) {
                if (isOverRenderedText(target, d.x, d.y)) hit = true;
              } else {
                hit = true;
              }
            }
          }

          if (hit) {
            d.state = "splashing";
            d.splashAge = 0;
            d.vx = 0;
            d.vy = 0;
            node.style.opacity = "1";
            node.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) scale(${sizeScale}, ${sizeScale})`;
            continue;
          }
        }

        const stretch = Math.min(2.4, 1 + Math.abs(d.vy) / 3.5);
        const sx = sizeScale / Math.sqrt(stretch);
        const sy = sizeScale * stretch;
        if (node.style.opacity !== "1") node.style.opacity = "1";
        node.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) scale(${sx}, ${sy})`;
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

  return (
    <>
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          {/* stdDev 6 keeps 8-16px blobs above the alpha threshold while
              still merging within ~20px for the goo effect. */}
          <filter id="cursor-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            <feColorMatrix
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 18 -7"
            />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          filter: "url(#cursor-goo)",
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
              background: "var(--cursor-color, rgb(153, 27, 27))",
              willChange: "transform",
              pointerEvents: "none",
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
            background: "var(--cursor-color, rgb(153, 27, 27))",
            willChange: "transform",
            pointerEvents: "none",
          }}
        />

        {Array.from({ length: DRIP_COUNT }).map((_, i) => (
          <div
            key={`drip-${i}`}
            ref={(node) => {
              dripNodesRef.current[i] = node;
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: DRIP_BASE_SIZE,
              height: DRIP_BASE_SIZE,
              marginLeft: -DRIP_BASE_SIZE / 2,
              marginTop: -DRIP_BASE_SIZE / 2,
              borderRadius: "9999px",
              background: "var(--cursor-color, rgb(153, 27, 27))",
              opacity: 0,
              willChange: "transform, opacity",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
    </>
  );
}

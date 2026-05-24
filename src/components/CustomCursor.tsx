"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  '.cursor-card, [data-cursor-glow], a, button, [role="button"]';

// All trail sizes ≥ 10 so each is reliably above the goo filter's alpha
// threshold (~0.39 after the 18×-7 matrix at stdDev 6 blur). Below 10 the
// blob math leaves them flickering in and out as they move.
const TRAIL: { size: number; ease: number }[] = [
  { size: 16, ease: 0.32 },
  { size: 14, ease: 0.22 },
  { size: 12, ease: 0.16 },
  { size: 10, ease: 0.11 },
];

const MAIN_SIZE = 18;

// Dripping ink: a pool of particles that spawn at the cursor and fall with
// gravity. They share the same goo filter as the main + trail blobs so they
// visually extrude from the cursor like wet ink.
const DRIP_COUNT = 14;
const DRIP_LIFETIME = 200; // frames (~3.3s at 60fps) — drops fall far
const DRIP_SPAWN_INTERVAL_MS = 340;
const DRIP_BASE_SIZE = 14; // node base diameter; per-drip size scales transform
// Ink physics: gentle initial vy + drops spawn just below cursor so they
// detach visibly from the cursor blob from frame 1 instead of being
// merged in by the goo filter. Steady gravity then carries them down.
// Drops keep their size as they fall (only opacity fades) so they remain
// visible far below the source. All drip sizes ≥ 12px so each is reliably
// above the goo filter alpha threshold (no flicker).
const DRIP_GRAVITY = 0.12;
const SPLASH_LIFETIME = 18; // frames (~300ms) — quick splash and gone
const COLLISION_GRACE_FRAMES = 5; // skip checks until drop has detached

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
  // The "container" (card / button / link) the drip spawned inside, or null
  // if spawned over background / text. Drives the splash rule:
  //   • container set   → drip falls within it and splashes at its BOTTOM
  //   • container null  → drip falls freely and splashes the moment it
  //                       enters any DRIP_TARGET_SELECTOR element
  spawnContainer: Element | null;
};

// "Containers" — the cursor is considered INSIDE one of these. When a drip
// spawns inside, it falls through the container and splashes at its BOTTOM
// edge instead of immediately. Cards / buttons / links.
const DRIP_CONTAINER_SELECTOR =
  '.cursor-card, button, a[href], [role="button"], [data-drip-container]';
// "Targets" — anything a drip can splash onto. Cards ARE included now:
// closest() will resolve to the deepest match, so text inside a card still
// wins over the card itself (text is nearer in the DOM). The container
// selector still drives the cursor-inside-card "fall to bottom" rule.
const DRIP_TARGET_SELECTOR =
  '.cursor-card, h1, h2, h3, h4, h5, h6, p, li, button, a[href], [role="button"], img, svg, [data-drip-target]';

// Tags that should use precise text-glyph hit-testing (via Range rects)
// instead of element bounding boxes. Falling through trailing whitespace
// of a wrapped paragraph or the gap between lines passes through cleanly.
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

// Walk all descendant text nodes of `el` and return true if (x, y) is inside
// any of their rendered glyph rectangles. Wrapped text produces one rect
// per line via Range.getClientRects, so collision is line-precise: drops
// passing through the empty space at line ends or between lines aren't
// counted as hits.
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
      // Only skip before the cursor has been positioned for the first time.
      // Drips spawn regardless of which section the cursor is in.
      if (cx < 0 || cy < 0) return;
      const now = performance.now();
      if (now - lastDripTimeRef.current < DRIP_SPAWN_INTERVAL_MS) return;
      const drips = dripsRef.current;
      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
        if (!d || d.alive) continue;
        // Spawn slightly below cursor so drops are partially detached from
        // the cursor blob from frame 1 (goo merge radius ~20px). Without
        // this offset, slow drops get absorbed into the cursor for the
        // first 20-30 frames and never visibly drip.
        d.x = cx + (Math.random() - 0.5) * 3;
        d.y = cy + 6 + Math.random() * 8;
        d.vx = (Math.random() - 0.5) * 0.25;
        d.vy = 0.15 + Math.random() * 0.25;
        d.age = 0;
        d.size = 12 + Math.random() * 6;
        d.alive = true;
        d.state = "falling";
        d.splashAge = 0;
        // If drip spawned INSIDE a container (card / button / link), record
        // it so the drip splashes at that container's BOTTOM edge instead
        // of immediately on contact. If null (spawn over text or empty
        // space), drip falls freely until it enters any DRIP_TARGET.
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

    // Write cursor position as the card's pour-fill origin. Called only on
    // enter (fill starts here) and just before exit (retract shrinks here),
    // never on every mousemove.
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
      // Only flip the cursor to its on-card black when the hovered target is
      // actually a cursor-card (the red flood needs the dark cursor for
      // contrast). Plain links / buttons outside cards keep the default red
      // cursor since there's no flood color competing with it.
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

      // Spawn a drip from the rAF loop too (in addition to handleMove). This
      // keeps drips falling while the cursor is idle. Time-throttled inside
      // spawnDrip, so calling it every frame is cheap.
      spawnDrip(mouseRef.current.x, mouseRef.current.y);

      // Dripping ink: each live drip falls with gravity, drifts a touch
      // horizontally, stretches vertically by velocity, and fades out.
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
          // Splash: scaleX expands outward, scaleY flattens, opacity fades.
          // Drop stays at the impact point (vx/vy frozen).
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

        // Falling state
        d.vy += DRIP_GRAVITY;
        d.vx *= 0.985;
        d.x += d.vx;
        d.y += d.vy;
        d.age += 1;

        // Drop dies when it falls off the bottom of the viewport (preferred,
        // no visible pop-out) or hits the lifetime cap (safety net).
        if (d.y > window.innerHeight + 30 || d.age >= DRIP_LIFETIME) {
          d.alive = false;
          node.style.opacity = "0";
          continue;
        }

        // Collision detection. Two independent checks, whichever hits first
        // splashes the drop:
        //   A) If the drop spawned inside a container (card / button), splash
        //      at that container's bottom edge as soon as y >= rect.bottom.
        //      Checked every frame regardless of what's under the drop, so
        //      drops in card padding don't "miss" the bottom when something
        //      outside the card appears below the boundary.
        //   B) If elementFromPoint resolves to a DIFFERENT target than the
        //      spawn container (text inside the card, a sibling, anything in
        //      free-fall), splash on that target. Text uses glyph-precise
        //      Range rects; non-text uses bounding box.
        if (d.age > COLLISION_GRACE_FRAMES) {
          let hit = false;

          // A) bottom-of-spawn-container check, independent of elementFromPoint
          if (d.spawnContainer) {
            const rect = d.spawnContainer.getBoundingClientRect();
            if (d.y >= rect.bottom) {
              d.y = rect.bottom;
              hit = true;
            }
          }

          // B) element-hit check (only if A didn't already trigger)
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

        // Stretch divisor tuned for the ink-drip velocity range.
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
          {/* Gooey blob filter (Lucas Bebber pattern). stdDeviation tuned
              for our blob sizes (8–16px): with stronger blur, small blobs'
              center alpha drops below the matrix threshold and they pop in
              and out of visibility — flicker. At stdDev 6, even 8px blobs
              keep enough alpha to render reliably while nearby blobs within
              ~20px still merge for the gooey blend. */}
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

        {/* Dripping ink particles. Position/scale/opacity updated in rAF.
            Same red as the main blob; the goo filter merges them with the
            cursor so drops look extruded rather than separate. */}
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

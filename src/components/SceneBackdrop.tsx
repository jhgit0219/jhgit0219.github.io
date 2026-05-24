"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import EyebrowBadge from "@/components/ui/EyebrowBadge";
import HudFrame from "@/components/ui/HudFrame";
import { FRAME_COUNT, framePath } from "@/lib/heroFrames";
import projectsData from "@/data/projects.json";
import type { Project } from "@/class/project";

export default function SceneBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const depthReadoutRef = useRef<HTMLSpanElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Route-aware HUD context. On a project detail route the persistent
  // header swaps the "Signal Lock / Abyss Depth" sci-fi readouts for the
  // back link + current project path, so the per-page nav bar above the
  // project hero can be removed without losing navigation.
  const pathname = usePathname();
  const projectContext = useMemo(() => {
    const match = pathname?.match(/^\/projects\/([^/]+)\/?$/);
    if (!match) return null;
    const slug = match[1]!;
    const project = (projectsData as Project[]).find((p) => p.slug === slug);
    const backHref = project?.kind === "lab" ? "/#lab" : "/#features";
    const backLabel =
      project?.kind === "lab" ? "All lab entries" : "All projects";
    return { slug, backHref, backLabel };
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      imgs.push(img);
    }
    framesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW: number;
    let drawH: number;
    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  useEffect(() => {
    // #scroll-root is the fixed-positioned <main> in page.tsx — the actual
    // scroll container. We listen to its scroll events and read scrollTop /
    // scrollHeight / clientHeight from it instead of window.
    const root = document.getElementById("scroll-root");
    if (!root) return;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        if (!loadedRef.current) return;

        const maxScroll = root.scrollHeight - root.clientHeight;
        const progress =
          maxScroll <= 0
            ? 0
            : Math.min(1, Math.max(0, root.scrollTop / maxScroll));

        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * FRAME_COUNT),
        );
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }

        if (depthReadoutRef.current) {
          const depth = 87.3 + Math.sin(progress * Math.PI * 2) * 6.7;
          depthReadoutRef.current.textContent = depth.toFixed(1) + "%";
        }

        // Readability scrim: transparent during hero (so iron man is vivid),
        // fades in to dim the canvas behind prose sections.
        if (scrimRef.current) {
          const scrim = Math.min(1, Math.max(0, (progress - 0.04) / 0.10));
          scrimRef.current.style.opacity = String(scrim);
        }

        // Bottom HUD is the canonical site footer now (persistent copyright
        // + progress bar). It stays visible at all scroll positions.

        // Top HUD stays persistently visible — it lives in the reserved top
        // 48px band of the viewport (above #scroll-root). No fade or slide.
      });
    };

    root.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => root.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  return (
    <>
      {/* Persistent canvas: fixed-positioned, sits behind all page content. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-abyss-900"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0) scaleX(-1)" }}
        />
        {/* Vignette + base dim. Uses mix-blend-mode: multiply with grayscale
            stops so the underlying canvas keeps its saturation (multiply
            darkens RGB proportionally, unlike an alpha-black overlay which
            blends toward gray and kills chroma). White = no darkening,
            black = full darkening, gray = partial darkening that preserves
            color. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 75% at 50% 20%, rgb(180,180,180) 0%, rgb(95,95,95) 55%, rgb(20,20,20) 100%)",
            mixBlendMode: "multiply",
          }}
        />
        {/* Extra left-side darken so hero text on the left half always has
            a darker backdrop. Same multiply trick. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgb(110,110,110) 0%, rgb(210,210,210) 50%, rgb(255,255,255) 75%)",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* Readability scrim: dims the canvas behind prose sections.
          Transparent during hero, fades in by ~15% scroll. */}
      <div
        ref={scrimRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/10 via-black/40 to-black/60"
        style={{ opacity: 0, transition: "opacity 180ms linear" }}
      />

      {/* Frosted strips for the top and bottom HUD bands so the chrome
          (signal lock / abyss depth / progress bar / copyright) sits on the
          same frosted surface as the cards rather than floating directly
          on the canvas. Z-index sits below #scroll-root (z-10) so the
          drawer chevron and other content inside scroll-root render above
          the strip (they'd otherwise get captured by the strip's
          backdrop-filter and end up blurred). The bands don't overlap
          scroll-root spatially, so visibility is unaffected. The HUD
          chrome itself sits at z-20 and renders on top of the strip. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-16 z-[2] frost border-b border-red-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-12 z-[2] frost border-t border-red-500/10"
      />

      {/* HUD chrome: fixed, sits above the canvas + scrim. The <main> scroll
          container is constrained to bottom-20, so the bottom 80px of the
          viewport is reserved for the HUD frame — section content physically
          cannot scroll into it. No blur/gate needed. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[20]">
        {/* Top HUD: persistent, lives in the reserved 48px top band of the
            viewport (above #scroll-root). Signal Lock at left-14 to clear
            the chevron toggle at left-3. L-corner brackets sit at top-12,
            on the top edge of the #scroll-root content pane. Text labels
            sit at top-5/6 to vertically center with the chevron's h-7 box. */}
        <div
          data-hud-section="top"
          className="transition-opacity duration-200 ease-out"
          aria-hidden
        >
          <div className="absolute left-6 top-16 text-blood-500 md:left-10">
            <HudFrame corner="tl" size={26} />
          </div>
          <div className="absolute right-6 top-16 text-blood-500 md:right-10">
            <HudFrame corner="tr" size={26} />
          </div>

          {projectContext ? (
            <Link
              href={projectContext.backHref}
              className="pointer-events-auto absolute left-14 top-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-300 hover:text-blood-500 transition-colors md:left-16 md:top-6"
            >
              <FaArrowLeft className="text-[9px]" />
              {projectContext.backLabel}
            </Link>
          ) : (
            <div className="absolute left-14 top-5 flex items-center gap-2 md:left-16 md:top-6">
              <div className="h-px w-8 bg-blood-700/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
                Signal Lock // Live
              </span>
            </div>
          )}

          {projectContext ? (
            <div className="absolute right-6 top-5 flex items-center gap-2 md:right-10 md:top-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                /projects/
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-blood-500">
                {projectContext.slug}
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blood-600 shadow-[0_0_10px_rgba(220,38,38,0.85)]" />
            </div>
          ) : (
            <div className="absolute right-6 top-5 flex items-center gap-3 md:right-10 md:top-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
                Abyss Depth
              </span>
              <span
                ref={depthReadoutRef}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-blood-500"
              >
                87.3%
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blood-600 shadow-[0_0_10px_rgba(220,38,38,0.85)]" />
            </div>
          )}

          {/* Horizontal divider sitting on the #scroll-root content pane
              top edge (top-16). Spans BETWEEN the bracket horizontal strokes
              so the line and brackets visually form one continuous frame
              instead of overlapping in color. */}
          <div className="absolute inset-x-[50px] top-16 -translate-y-px h-px bg-white/10 md:inset-x-[66px]" />
        </div>

        {/* Bottom HUD: persistent canonical footer (brackets + progress bar
            + copyright). Always visible at every scroll position. */}
        <div>
          {/* L-corner brackets sit on the bottom edge of the #scroll-root
              content pane (which ends at bottom-12 = 48px from viewport
              bottom). The L-corner aligns with the pane edge; the bracket
              extends up into content, framing the pane. The progress bar +
              persistent copyright sit below, in the 48px footer chrome. */}
          <div className="absolute bottom-12 left-6 text-blood-500 md:left-10">
            <HudFrame corner="bl" size={26} />
          </div>
          <div className="absolute bottom-12 right-6 text-blood-500 md:right-10">
            <HudFrame corner="br" size={26} />
          </div>

          {/* Progress bar sits BETWEEN the bottom brackets at bottom-12,
              the content pane's bottom edge — mirrors the top divider. */}
          <div className="absolute inset-x-[50px] bottom-12 h-px bg-white/10 md:inset-x-[66px]">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-blood-600"
              style={{
                transform: "scaleX(0)",
                transition: "transform 80ms linear",
              }}
            />
          </div>

          {/* Persistent copyright — single canonical footer line for the
              whole site, replaces the per-page <Footer /> components. */}
          <div className="absolute inset-x-0 bottom-3 mx-6 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
            &copy; {new Date().getFullYear()} Jetchomen Husain. All rights reserved.
          </div>
        </div>
      </div>

      {/* Loading screen: fixed, covers everything until frames are ready. */}
      {!loaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-abyss-900 px-6">
          <EyebrowBadge>DESCENT PROTOCOL // BOOTING</EyebrowBadge>
          <div className="h-px w-60 bg-white/10 md:w-80">
            <div
              className="h-full bg-blood-600 transition-[width] duration-150 ease-out"
              style={{ width: `${Math.round(loadProgress * 100)}%` }}
            />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Loading Sequence &nbsp;&middot;&nbsp; {Math.round(loadProgress * 100)}%
          </p>
        </div>
      )}
    </>
  );
}

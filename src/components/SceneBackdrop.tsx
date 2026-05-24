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

  // On /projects/[slug], the HUD swaps its sci-fi readouts for a back
  // link + project path so the per-page nav bar isn't needed.
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
    // #scroll-root is the actual scroll container, not window.
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

        if (scrimRef.current) {
          const scrim = Math.min(1, Math.max(0, (progress - 0.04) / 0.10));
          scrimRef.current.style.opacity = String(scrim);
        }
      });
    };

    root.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => root.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-abyss-900"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0) scaleX(-1)" }}
        />
        {/* Vignette via multiply blend so darkening keeps canvas saturation
            (alpha-black overlays would blend toward gray and kill chroma). */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 75% at 50% 20%, rgb(180,180,180) 0%, rgb(95,95,95) 55%, rgb(20,20,20) 100%)",
            mixBlendMode: "multiply",
          }}
        />
        {/* Extra left-side darken for hero text readability. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgb(110,110,110) 0%, rgb(210,210,210) 50%, rgb(255,255,255) 75%)",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* Scrim dims the canvas behind prose sections, fades in past hero. */}
      <div
        ref={scrimRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/10 via-black/40 to-black/60"
        style={{ opacity: 0, transition: "opacity 180ms linear" }}
      />

      {/* Frosted strips for the top + bottom HUD bands. z-[2] keeps them
          below #scroll-root (z-10) so content inside isn't captured by
          the backdrop-filter and blurred. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-16 z-[2] frost border-b border-red-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-12 z-[2] frost border-t border-red-500/10"
      />

      <div aria-hidden className="pointer-events-none fixed inset-0 z-[20]">
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

          <div className="absolute inset-x-[50px] top-16 -translate-y-px h-px bg-white/10 md:inset-x-[66px]" />
        </div>

        <div>
          <div className="absolute bottom-12 left-6 text-blood-500 md:left-10">
            <HudFrame corner="bl" size={26} />
          </div>
          <div className="absolute bottom-12 right-6 text-blood-500 md:right-10">
            <HudFrame corner="br" size={26} />
          </div>

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

          <div className="absolute inset-x-0 bottom-3 mx-6 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
            &copy; {new Date().getFullYear()} Jetchomen Husain. All rights reserved.
          </div>
        </div>
      </div>

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

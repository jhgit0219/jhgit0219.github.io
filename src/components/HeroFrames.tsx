"use client";

import EyebrowBadge from "@/components/ui/EyebrowBadge";

export default function HeroFrames({
  onViewWorkClick,
}: {
  onViewWorkClick?: () => void;
}) {
  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-[calc(100dvh-7rem)] w-full flex-col justify-start px-6 pt-12 pb-12 md:px-12 md:pt-16"
    >
      <div className="flex w-full max-w-3xl flex-col items-start gap-5">
        <EyebrowBadge>
          [STATUS: REMOTE-AVAILABLE] [STACK: FULL-STACK + AI] [REGION: CEBU, PH · GMT+8]
        </EyebrowBadge>
        <h1 className="max-w-[14ch] font-sans text-5xl font-extrabold uppercase leading-[0.95] tracking-tighter text-white md:text-7xl lg:text-8xl">
          Hello, I&rsquo;m
          <br />
          <span className="bg-gradient-to-r from-blood-600 via-blood-500 to-blood-600 bg-clip-text text-transparent">
            JETCHOMEN
          </span>
        </h1>
        <p className="max-w-[42ch] font-sans text-sm leading-relaxed text-zinc-300 md:text-base">
          Full-stack engineer at Accenture. Enterprise stacks by day,
          multi-agent orchestration and AI tooling on the side.
          Scroll to descend.
        </p>
        {onViewWorkClick && (
          <button
            onClick={onViewWorkClick}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blood-700/60 bg-blood-700/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.22em] text-blood-300 transition hover:bg-blood-700/25 hover:text-white"
          >
            View My Work
            <span aria-hidden>&darr;</span>
          </button>
        )}
      </div>
    </section>
  );
}

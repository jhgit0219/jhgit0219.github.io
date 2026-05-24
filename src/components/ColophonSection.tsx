import { FaRobot, FaCode, FaHandPaper } from "react-icons/fa";

export default function ColophonSection() {
  return (
    <section
      id="colophon"
      className="relative z-10 w-screen py-8 md:py-12 px-6 md:px-12 scroll-mt-14 md:scroll-mt-0 overflow-hidden md:min-h-[calc(100dvh-7rem)] md:flex md:flex-col md:justify-center"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-10 md:mb-14 max-w-3xl">
          <div className="text-sm md:text-base uppercase tracking-[0.3em] text-red-400 font-mono font-semibold mb-3">
            /colophon
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            How this site was <span className="text-red-500">built</span>
          </h2>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
            Next.js, React, and Tailwind, deployed as a static export to
            GitHub Pages. I work with AI tooling daily, so I want to be
            upfront about where it shows up here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            data-cursor-glow
            tabIndex={0}
            className="cursor-card p-6 rounded-sm frost border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaRobot className="text-red-400" />
              <h3 className="text-white font-semibold">AI in the workflow</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              The hero animation is an AI-generated frame sequence. A lot of
              the scaffolding (component skeletons, the canvas chrome, the
              cursor effects) was paired with an AI coding assistant.
            </p>
          </div>

          <div
            data-cursor-glow
            tabIndex={0}
            className="cursor-card p-6 rounded-sm frost border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaHandPaper className="text-red-400" />
              <h3 className="text-white font-semibold">The human part</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              I drive the design decisions. I write the prompts. I open the
              codebase and fix what the assistant gets wrong, which is
              regularly. The voice on this page is mine.
            </p>
          </div>

          <div
            data-cursor-glow
            tabIndex={0}
            className="cursor-card p-6 rounded-sm frost border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaCode className="text-red-400" />
              <h3 className="text-white font-semibold">Why I show it</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              AI tooling is part of the job now. Pretending otherwise on a
              portfolio feels dishonest. The work that matters is the
              judgment around the tools, not whether the tools were used.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import projectsData from "@/data/projects.json";
import FeatureItem from "@/components/FeatureItem";
import { Project } from "@/class/project";

const projects = (projectsData as Project[]).filter((p) => p.kind === "product");

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="relative z-10 w-screen pt-8 md:pt-12 pb-8 md:pb-12 px-6 md:px-12 space-y-24 scroll-mt-14 md:scroll-mt-0 overflow-x-hidden md:min-h-[calc(100dvh-7rem)]"
    >
      <div className="max-w-4xl mx-auto text-center text-gray-300 space-y-4">
        <div className="text-sm md:text-base uppercase tracking-[0.3em] text-red-400 font-mono font-semibold">/selected-work</div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white">
          PROJECTS
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
          Software I&rsquo;ve shipped recently. Click any project for the
          stack, the design calls, and what I actually built.
        </p>
      </div>
      {projects.map((project) => (
        <div
          key={project.id}
          data-cursor-glow
          tabIndex={0}
          className="cursor-card group relative w-full max-w-6xl mx-auto rounded-sm border border-red-500/15 frost px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 md:px-8 md:py-8"
        >
          <FeatureItem project={project} reverse={project.reverse} />
        </div>
      ))}
    </section>
  );
}

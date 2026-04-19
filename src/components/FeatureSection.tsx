import projectsData from "@/data/projects.json";
import FeatureItem from "@/components/FeatureItem";
import { Project } from "@/class/project";

const projects = (projectsData as Project[]).filter((p) => p.kind === "product");

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="w-screen bg-[#0a0a0a] pt-16 md:pt-20 pb-32 space-y-24 scroll-mt-14 md:scroll-mt-0 overflow-x-hidden"
    >
      <div className="max-w-4xl mx-auto text-center text-gray-300 space-y-4 px-6">
        <div className="text-xs uppercase tracking-widest text-red-400">Selected work</div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white">
          PROJECTS
        </h1>
        <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto">
          Recent software I have built. Select any project to see the tech
          stack, implementation details, and my role.
        </p>
      </div>
      {projects.map((project) => (
        <div
          key={project.id}
          data-cursor-glow
          tabIndex={0}
          className="cursor-card group relative w-full md:w-[calc(100vw-7rem)] md:ml-[7rem] rounded-3xl md:rounded-l-3xl md:rounded-r-none outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
        >
          <FeatureItem project={project} reverse={project.reverse} />
        </div>
      ))}
    </section>
  );
}

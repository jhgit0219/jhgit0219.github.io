import projectsData from "@/data/projects.json";
import LabItem from "@/components/LabItem";
import { Project } from "@/class/project";

const labProjects = (projectsData as Project[]).filter((p) => p.kind === "lab");

export default function LabSection() {
  if (labProjects.length === 0) return null;

  return (
    <section
      id="lab"
      className="relative z-10 w-screen py-8 md:py-12 px-6 md:px-12 scroll-mt-14 md:scroll-mt-0 overflow-hidden md:min-h-[calc(100dvh-7rem)] md:flex md:flex-col md:justify-center"
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <div className="text-sm md:text-base uppercase tracking-[0.3em] text-red-400 font-mono font-semibold mb-3">
            /lab
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Tools and <span className="text-red-500">experiments</span>
          </h2>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
            Backend services, ML pipelines, and CLI tools. The stuff that
            doesn&rsquo;t get a fancy UI. Some live on GitHub, some stay local
            until the idea settles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {labProjects.map((project, i) => (
            <LabItem key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

import projectsData from "@/data/projects.json";
import LabItem from "@/components/LabItem";
import { Project } from "@/class/project";

const labProjects = (projectsData as Project[]).filter((p) => p.kind === "lab");

export default function LabSection() {
  if (labProjects.length === 0) return null;

  return (
    <section
      id="lab"
      className="relative w-screen bg-[#0a0a0a] py-16 md:py-20 px-6 md:px-12 scroll-mt-14 md:scroll-mt-0 overflow-hidden"
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-red-400 mb-3 font-mono">
            /lab
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Tools and <span className="text-red-500">experiments</span>
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed">
            Backend services, machine-learning pipelines, and scripts that do
            not come with a polished UI. Some are public, some are local while
            the ideas stabilize.
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

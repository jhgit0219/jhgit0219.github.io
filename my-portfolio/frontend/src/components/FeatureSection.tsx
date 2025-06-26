import projects from "@/data/projects.json";
import FeatureItem from "@/components/FeatureItem";

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="w-screen bg-[#0a0a0a] py-32 space-y-24 scroll-mt-20 overflow-x-hidden"
    >
      <div className="max-w-4xl mx-auto text-center text-gray-300 space-y-4">
        <h1 className="text-6xl font-semibold text-white">FEATURED PROJECTS</h1>
        <p className="text-2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                xl text-gray-400">
          A curated selection of things I’ve built recently — focused on design,
          interactivity, and performance.
        </p>
      </div>
      {projects.map((project) => (
        <div key={project.id} className="relative group w-full">
          {/* Full-width red hover background */}
          <div className="absolute inset-y-0 left-[6rem] md:left-[7rem] right-0 bg-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />

          {/* Padded & centered content */}
          <FeatureItem project={project} reverse={project.reverse} />
        </div>
      ))}
    </section>
  );
}

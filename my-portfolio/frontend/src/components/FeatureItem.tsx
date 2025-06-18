import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function FeatureItem({
  project,
  reverse,
}: {
  project: any;
  reverse: boolean;
}) {
  const { title, description, image, links } = project;

  return (
    <ScrollReveal reverse={false}>
      <div
        className={`mx-auto w-full max-w-7xl px-4 md:px-8 py-6 flex flex-col md:flex-row items-start gap-6 md:gap-10 ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Image Panel */}
        <div className="relative w-full md:w-[90%] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,0,0,0.25)] border border-red-600">
          <div className="relative w-full aspect-[16/9] md:h-[360px]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Text Panel */}
        <div className="w-full md:w-[90%] p-5 md:p-6 rounded-xl text-left text-gray-200">
          <h3 className="text-3xl font-bold text-white mb-3">{title}</h3>
          <p className="text-lg text-gray-300 mb-5 leading-relaxed">
            {description}
          </p>
          <div className="space-x-4">
            <a
              href={links.demo}
              target="_blank"
              className="text-red-300 hover:text-white underline"
            >
              Live Demo
            </a>
            <a
              href={links.github}
              target="_blank"
              className="text-red-300 hover:text-white underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

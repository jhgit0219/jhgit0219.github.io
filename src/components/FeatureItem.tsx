import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import TiltImage from "./TiltImage";
import { Project } from "@/class/project";
import { FaArrowRight, FaExternalLinkAlt, FaGithub, FaTerminal } from "react-icons/fa";

function ProjectPreview({
  image,
  title,
  statusLabel,
  tags,
}: {
  image: string | undefined;
  title: string;
  statusLabel: string;
  tags: string[];
}) {
  if (image) {
    return (
      <div className="relative w-full aspect-[16/9] md:h-[360px]">
        <Image
          src={image}
          alt={title}
          fill
          quality={95}
          sizes="(max-width: 768px) 100vw, 1280px"
          className="object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-sm text-red-300 border border-red-500/40 rounded-full px-2.5 py-1">
          {statusLabel}
        </span>
      </div>
    );
  }

  // Fallback preview for projects without a screenshot yet
  return (
    <div className="relative w-full aspect-[16/9] md:h-[360px] bg-[#0d0d0d] flex flex-col justify-center items-start p-8 md:p-12 overflow-hidden">
      <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-sm text-red-300 border border-red-500/40 rounded-full px-2.5 py-1">
        {statusLabel}
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-red-400/70 mb-4">
        <FaTerminal />
        <span className="text-gray-500">$</span>
        <span className="text-gray-400">open {title.toLowerCase().replace(/\s+/g, "-")}</span>
      </div>
      <div className="font-mono text-white text-2xl md:text-4xl font-bold mb-5 leading-tight">
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5 max-w-full">
        {tags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] text-red-200/80 bg-red-500/10 border border-red-500/20 rounded px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
      {/* Subtle grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,68,68,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.6) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}

export default function FeatureItem({
  project,
  reverse,
}: {
  project: Project;
  reverse: boolean;
}) {
  const { slug, title, description, image, links, tags, status } = project;
  const statusLabel =
    status === "live" ? "Live" : status === "in-progress" ? "In Progress" : "Archived";

  return (
    <ScrollReveal reverse={false}>
      <div
        className={`mx-auto w-full max-w-7xl px-4 md:px-8 py-6 flex flex-col md:flex-row items-start gap-6 md:gap-10 ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Preview panel — links to detail */}
        <Link
          href={`/projects/${slug}`}
          aria-label={`Open ${title} details`}
          className="relative w-full md:w-[90%]"
        >
          <TiltImage className="relative w-full rounded-xl overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.2)] border border-red-600 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.4),0_0_60px_rgba(220,38,38,0.15)] transition-shadow duration-500">
            <ProjectPreview image={image} title={title} statusLabel={statusLabel} tags={tags} />
          </TiltImage>
        </Link>

        {/* Text Panel */}
        <div className="w-full md:w-[90%] p-5 md:p-6 rounded-xl text-left text-gray-200">
          <Link href={`/projects/${slug}`} className="inline-block group/title">
            <h3 className="text-3xl font-bold text-white mb-3 group-hover/title:text-red-300 transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-lg text-gray-300 mb-4 leading-relaxed">
            {description}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href={`/projects/${slug}`}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm transition"
            >
              Read more
              <FaArrowRight className="text-xs" />
            </Link>
            {links.demo && (
              <a
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-red-500/50 text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm transition"
              >
                <FaExternalLinkAlt className="text-xs" />
                Live Demo
              </a>
            )}
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-red-500/50 text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm transition"
              >
                <FaGithub />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

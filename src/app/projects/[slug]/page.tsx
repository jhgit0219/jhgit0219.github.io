import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import projects from "@/data/projects.json";
import { Project } from "@/class/project";
import ProjectDetailClient from "@/components/ProjectDetailClient";

export function generateStaticParams() {
  return (projects as Project[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (projects as Project[]).find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} | Jetchomen`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = projects as Project[];
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return notFound();

  const project = all[index]!;
  const prev = index > 0 ? all[index - 1] : all[all.length - 1];
  const next = index < all.length - 1 ? all[index + 1] : all[0];

  const statusLabel =
    project.status === "live"
      ? "Live"
      : project.status === "in-progress"
      ? "In Progress"
      : project.status === "local"
      ? "Local"
      : "Archived";

  const backHref = project.kind === "lab" ? "/#lab" : "/#features";
  const backLabel = project.kind === "lab" ? "All lab entries" : "All projects";

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-gray-200">
      <ProjectDetailClient />

      {/* Top bar with back */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#0a0a0a]/70 border-b border-red-500/20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-red-300 hover:text-white transition text-sm"
          >
            <FaArrowLeft className="text-xs" />
            {backLabel}
          </Link>
          <Link
            href="/"
            className="text-white text-xl font-bold tracking-wide hover:text-red-300 transition"
          >
            J
          </Link>
        </div>
      </div>

      {/* Hero banner */}
      <section className="relative w-full border-b border-red-500/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-12 md:pt-20 pb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-red-300 mb-4">
            <span className="rounded-full border border-red-500/40 px-3 py-1">
              {project.year}
            </span>
            <span className="rounded-full border border-red-500/40 px-3 py-1">
              {statusLabel}
            </span>
            <span className="rounded-full border border-red-500/40 px-3 py-1">
              {project.role}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            {project.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm transition"
              >
                <FaExternalLinkAlt className="text-xs" />
                Live Demo
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-red-500/50 text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm transition"
              >
                <FaGithub />
                GitHub
              </a>
            )}
            {!project.links.github && !project.links.demo && (
              <span className="border border-gray-600/60 text-gray-400 px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm">
                Local project, not public yet
              </span>
            )}
          </div>
        </div>

        {project.image && (
          <div className="max-w-6xl mx-auto px-6 md:px-10 pb-12 md:pb-16">
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-red-600/60 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                quality={95}
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
      </section>

      {/* Overview + sidebar */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Overview</h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-line">
            {project.longDescription}
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-4">Highlights</h2>
          <ul className="space-y-3">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex gap-3 items-start text-gray-300 leading-relaxed"
              >
                <span className="mt-2 block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          {project.challenges.length > 0 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-4">
                Challenges and approach
              </h2>
              <ul className="space-y-5">
                {project.challenges.map((c, i) => (
                  <li
                    key={i}
                    className="border-l-2 border-red-500/50 pl-4 text-gray-300 leading-relaxed"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-4">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.gallery.map((src) => (
                  <div
                    key={src}
                    className="relative aspect-[16/10] rounded-xl overflow-hidden border border-red-500/30"
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="50vw" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="space-y-8">
          <div
            data-cursor-glow
            tabIndex={0}
            className="cursor-card border border-red-500/20 rounded-2xl p-6 bg-red-500/5 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
          >
            <h3 className="text-sm uppercase tracking-widest text-red-300 mb-4">At a glance</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">Role</dt>
                <dd className="text-white">{project.role}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Year</dt>
                <dd className="text-white">{project.year}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd className="text-white">{statusLabel}</dd>
              </div>
            </dl>
          </div>

          <div
            data-cursor-glow
            tabIndex={0}
            className="cursor-card border border-red-500/20 rounded-2xl p-6 bg-red-500/5 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
          >
            <h3 className="text-sm uppercase tracking-widest text-red-300 mb-4">Stack</h3>
            <div className="space-y-4">
              {project.techStack.map((group) => (
                <div key={group.label}>
                  <div className="text-xs text-gray-500 mb-2">{group.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs text-red-200 border border-red-500/30 bg-red-500/10 rounded-full px-2.5 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Prev / Next */}
      <nav className="border-t border-red-500/10 bg-red-500/[0.02]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href={`/projects/${prev.slug}`}
            className="cursor-card group rounded-2xl border border-red-500/20 p-5 transition flex items-center gap-4"
          >
            <FaArrowLeft className="text-red-400 group-hover:-translate-x-1 transition" />
            <div>
              <div className="text-xs text-gray-500">Previous</div>
              <div className="text-white font-semibold">{prev.title}</div>
            </div>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="cursor-card group rounded-2xl border border-red-500/20 p-5 transition flex items-center justify-end gap-4 text-right"
          >
            <div>
              <div className="text-xs text-gray-500">Next</div>
              <div className="text-white font-semibold">{next.title}</div>
            </div>
            <FaArrowRight className="text-red-400 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </nav>

      <footer className="w-full border-t border-red-500/20 pt-6 pb-10 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Jetchomen Husain. All rights reserved.
      </footer>
    </main>
  );
}

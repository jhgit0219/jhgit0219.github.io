"use client";

import Link from "next/link";
import { FaGithub, FaArrowRight, FaTerminal } from "react-icons/fa";
import { motion } from "framer-motion";
import { Project } from "@/class/project";

function StatusBadge({ status }: { status: Project["status"] }) {
  const map = {
    "live": { label: "live", dotClass: "bg-emerald-400" },
    "in-progress": { label: "wip", dotClass: "bg-amber-400" },
    "local": { label: "local", dotClass: "bg-gray-500" },
    "archived": { label: "archived", dotClass: "bg-gray-600" },
  };
  const info = map[status];
  return (
    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-gray-400">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${info.dotClass}`} />
      {info.label}
    </div>
  );
}

export default function LabItem({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { slug, title, description, tags, language, status, links } = project;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="cursor-card group relative h-full flex flex-col rounded-xl border border-red-500/20 bg-[#0d0d0d] p-5 md:p-6 overflow-hidden"
    >
      {/* Card-wide click target: invisible, anchored to the title link via ::after */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/projects/${slug}`}
          aria-label={`Open ${title} details`}
          className="inline-flex items-center gap-2 font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 rounded-sm after:content-[''] after:absolute after:inset-0 after:z-0"
        >
          <FaTerminal className="text-red-400/70 text-xs" />
          <span className="text-gray-500">$</span>
          <span className="text-white font-semibold group-hover:text-red-300 transition-colors">
            {title}
          </span>
        </Link>
        {language && (
          <span className="relative z-10 font-mono text-[10px] uppercase tracking-wider text-red-300/80 border border-red-500/20 rounded px-2 py-0.5">
            {language}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-5 min-h-[3.5rem]">
        {description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {tags.slice(0, 6).map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] text-red-200/90 bg-red-500/10 border border-red-500/20 rounded px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
        {tags.length > 6 && (
          <span className="font-mono text-[10px] text-gray-500 px-2 py-0.5">
            +{tags.length - 6}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-red-500/10">
        <StatusBadge status={status} />
        <div className="relative z-10 flex items-center gap-3 text-xs">
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-300 transition-colors inline-flex items-center gap-1.5"
              aria-label={`${title} on GitHub`}
            >
              <FaGithub />
              <span className="hidden sm:inline font-mono">source</span>
            </a>
          )}
          <Link
            href={`/projects/${slug}`}
            className="text-red-300 hover:text-red-200 inline-flex items-center gap-1.5 font-mono transition-colors"
          >
            details
            <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

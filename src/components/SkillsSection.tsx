"use client";

import { motion } from "framer-motion";

interface SkillGroup {
  label: string;
  blurb: string;
  items: string[];
}

const groups: SkillGroup[] = [
  {
    label: "Frontend",
    blurb: "Strictly typed components, accessible interfaces, and performant state management.",
    items: [
      "React",
      "Next.js",
      "Angular",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "RxJS",
    ],
  },
  {
    label: "Backend",
    blurb: "Clear API boundaries, isolated services, and stable deployments.",
    items: [
      "Node.js",
      "Express",
      "FastAPI",
      "Python",
      "Spring Boot",
      "Java EE",
      ".NET",
      "REST",
      "WebSockets",
    ],
  },
  {
    label: "Data",
    blurb: "Domain-driven database schemas and optimized indexing.",
    items: ["MongoDB", "PostgreSQL", "Firebase", "pandas", "Redis"],
  },
  {
    label: "AI and automation",
    blurb: "Managing local inference, agent workflows, and streaming responses.",
    items: [
      "PyTorch",
      "Diffusers",
      "Hugging Face",
      "Agentic Workflows",
      "Multi-Agent Systems",
      "Prompt Engineering",
    ],
  },
  {
    label: "Test automation",
    blurb: "Comprehensive end-to-end testing focused on edge cases and state validation.",
    items: ["Playwright", "Jest", "Vitest", "TypeScript"],
  },
  {
    label: "DevOps and tooling",
    blurb: "CI/CD pipelines, containerization, and infrastructure monitoring.",
    items: [
      "Docker",
      "GitHub Actions",
      "Jenkins",
      "Git",
      "ESLint",
      "Vite",
      "Vercel",
    ],
  },
  {
    label: "Enterprise",
    blurb: "Maintaining legacy systems, implementing audit logging, and workflow routing.",
    items: ["PEGA", "Java", "C#", "Case Management", "Integration Patterns"],
  },
];

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative w-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0505] to-[#0a0a0a] py-16 md:py-20 px-6 md:px-12 scroll-mt-14 md:scroll-mt-0 overflow-hidden"
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <div className="text-xs uppercase tracking-widest text-red-400 mb-3">
            Toolkit
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Core <span className="text-red-500">technologies</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-5 text-gray-400 text-base md:text-lg">
            Everything listed here is a tool I use heavily in either day-to-day
            engineering or active personal projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g, i) => (
            <motion.div
              key={g.label}
              data-cursor-glow
              tabIndex={0}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="cursor-card group rounded-2xl bg-[#111] border border-red-500/20 p-6 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{g.label}</h3>
                <span className="text-xs text-gray-500">
                  {g.items.length} tools
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                {g.blurb}
              </p>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs text-red-200 border border-red-500/30 bg-red-500/10 rounded-full px-2.5 py-1 hover:bg-red-500/20 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

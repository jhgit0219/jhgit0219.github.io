"use client";

import { motion } from "framer-motion";
import { FaCode, FaServer, FaBrain, FaTools, FaGraduationCap, FaAward } from "react-icons/fa";

const pillars = [
  {
    icon: FaCode,
    title: "Frontend engineering",
    body: "Modular component systems designed for maintainability. Fast, accessible interfaces that prioritize user content.",
  },
  {
    icon: FaServer,
    title: "Backend architecture",
    body: "Data-driven API design. End-to-end type safety from the database straight to the client.",
  },
  {
    icon: FaBrain,
    title: "Applied AI",
    body: "Integrating local ML models, streaming interfaces, and multi-agent systems into practical applications.",
  },
  {
    icon: FaTools,
    title: "Test automation",
    body: "Reliable Playwright and Jest test suites covering edge cases and expected failures.",
  },
];

const timeline = [
  {
    year: "Now",
    text: "Full-stack development with Angular, React, and Node. Building Python AI workflows.",
  },
  {
    year: "2025",
    text: "Playwright and TypeScript end-to-end testing for enterprise web applications.",
  },
  {
    year: "2024",
    text: "Java EE and Spring Boot development for case management systems.",
  },
  {
    year: "2023",
    text: "Hardware test engineering using C# and automated tooling.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-screen bg-[#0a0a0a] py-16 md:py-20 px-6 md:px-12 scroll-mt-14 md:scroll-mt-0 overflow-hidden"
    >
      {/* Decorative ember line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-start">
          {/* Left: headline + bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-widest text-red-400 mb-4">
              About
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              I build <span className="text-red-500">reliable</span> software systems.
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-5">
              I am a software engineer focused on full-stack development, test
              automation, and AI systems. I primarily work with the MERN/MEAN
              stacks and Python. I value clear system boundaries, strict type
              definitions, and reliable testing.
            </p>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              My recent projects focus on applying AI to practical interfaces,
              including streaming chat, local video generation, and multi-agent
              development. I also build smaller utilities like a pixel editor
              and a market dashboard. Everything listed here is a shipped
              project or active work in progress.
            </p>
          </motion.div>

          {/* Right: pillars grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {pillars.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                data-cursor-glow
                tabIndex={0}
                className="cursor-card group p-6 rounded-2xl bg-red-500/[0.03] border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="text-red-400 group-hover:text-red-300 transition-colors" />
                  <h3 className="text-white font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Timeline strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {timeline.map((item) => (
            <div
              key={item.year}
              data-cursor-glow
              tabIndex={0}
              className="cursor-card relative p-5 rounded-xl bg-[#111] border border-red-500/10 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
            >
              <div className="absolute -top-2 left-4 text-[10px] uppercase tracking-widest text-red-400 bg-[#0a0a0a] px-2">
                {item.year}
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mt-2">
                {item.text}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Education and recognition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div
            data-cursor-glow
            tabIndex={0}
            className="cursor-card p-6 rounded-2xl bg-red-500/[0.03] border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaGraduationCap className="text-red-400" />
              <h3 className="text-white font-semibold">Education</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              BS Computer Engineering
            </p>
            <p className="text-sm text-gray-500">
              University of San Carlos, Talamban Campus
            </p>
            <p className="text-sm text-gray-500">2018 to 2022</p>
          </div>
          <div
            data-cursor-glow
            tabIndex={0}
            className="cursor-card p-6 rounded-2xl bg-red-500/[0.03] border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaAward className="text-red-400" />
              <h3 className="text-white font-semibold">Recognition</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Cum Laude graduate</li>
              <li>DOST Merit Scholar</li>
              <li>Carolinian Academic Distinction Awardee</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

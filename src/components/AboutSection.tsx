"use client";

import { motion } from "framer-motion";
import { FaCode, FaServer, FaBrain, FaTools, FaGraduationCap, FaAward } from "react-icons/fa";

const pillars = [
  {
    icon: FaCode,
    title: "Frontend engineering",
    body: "Component systems that don't fight you six months later. Accessible by default. The content does the talking, not the chrome.",
  },
  {
    icon: FaServer,
    title: "Backend architecture",
    body: "Clear API contracts. Types that hold from the database to the client. Boring deployments are good deployments.",
  },
  {
    icon: FaBrain,
    title: "AI and multi-agent systems",
    body: "Local model inference, agent orchestration, LLM integrations (Claude, OpenAI, Ollama). The useful kind, not the demo kind.",
  },
  {
    icon: FaTools,
    title: "Test automation",
    body: "Playwright and Jest suites that catch real regressions instead of just covering the happy path.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 w-screen py-8 md:py-12 px-6 md:px-12 scroll-mt-14 md:scroll-mt-0 overflow-hidden md:min-h-[calc(100dvh-7rem)] md:flex md:flex-col md:justify-center"
    >
      {/* Decorative ember line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-start">
          {/* Left: headline + bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            style={{ willChange: "transform, opacity" }}
          >
            <div className="text-sm md:text-base uppercase tracking-[0.3em] text-red-400 font-mono font-semibold mb-4">
              /about
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              I build <span className="text-red-500">reliable</span> software systems.
            </h2>
            <p className="text-gray-100 text-base md:text-lg leading-relaxed mb-5 [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
              Full-stack engineer at Accenture, based in Cebu. Day job
              spans Angular, React, .NET, Node.js, and PEGA across
              enterprise systems, plus AI-assisted Python workflows that
              wire previously siloed tools together. After hours skews to
              multi-agent orchestration, LLM integrations, and whatever
              side project annoyed me into building a tool for it that
              week.
            </p>
            <p className="text-gray-200 text-base md:text-lg leading-relaxed [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
              What I obsess over is the invisible part. Types that hold up
              after a refactor. Tests that fail loudly for the right reason.
              Migrations that don&rsquo;t require a Friday-night Slack
              thread. The projects below are real, most still get commits,
              and the lab section says which ones don&rsquo;t deserve a UI
              yet.
            </p>
          </motion.div>

          {/* Right: pillars grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ willChange: "transform, opacity" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {pillars.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                data-cursor-glow
                tabIndex={0}
                className="cursor-card group p-6 rounded-sm frost border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
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

        {/* Education and recognition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ willChange: "transform, opacity" }}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div
            data-cursor-glow
            tabIndex={0}
            className="cursor-card p-6 rounded-sm frost border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
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
            className="cursor-card p-6 rounded-sm frost border border-red-500/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaAward className="text-red-400" />
              <h3 className="text-white font-semibold">Recognition</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Cum Laude graduate</li>
              <li>DOST Merit Scholar</li>
              <li>Maxim Integrated Scholar</li>
              <li>Carolinian Academic Distinction Awardee</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

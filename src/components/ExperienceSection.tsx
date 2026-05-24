import { Fragment } from "react";

type Role = {
  id: string;
  dateRange: string;
  title: string;
  company: string;
  bullets: string[];
};

const roles: Role[] = [
  {
    id: "fullstack-accenture",
    dateRange: "Apr 2025 — Now",
    title: "Full Stack Developer",
    company: "Accenture",
    bullets: [
      "Ship full-stack features for enterprise clients across Angular and React frontends backed by .NET, PEGA, and Node.js. Most of the work crosses legacy and modern systems in production.",
      "Design AI-assisted Python workflows that automate internal process steps and stitch together tools that used to require manual handoffs.",
      "Built an AI mock-response layer that generates backend stubs matching the API spec, so frontend teams stop blocking on downstream APIs coming online.",
    ],
  },
  {
    id: "test-automation-accenture",
    dateRange: "Mar 2025 — Apr 2025",
    title: "Test Automation Engineer",
    company: "Accenture",
    bullets: [
      "Built end-to-end Playwright and TypeScript automation over critical PEGA application flows. Killed a meaningful chunk of manual regression work.",
      "Wrote reusable page-object and fixture utilities so coverage scaled across multiple feature streams without rewriting setup every time.",
    ],
  },
  {
    id: "pega-architect-accenture",
    dateRange: "Dec 2024 — Mar 2025",
    title: "PEGA Systems Architect",
    company: "Accenture",
    bullets: [
      "Built a Car Insurance Claim proof-of-concept in PEGA covering the full case lifecycle. Claim initiation, validation routing, approval.",
      "Turned business requirements into case-management designs, decision tables, and integration patterns ready for production hand-off.",
    ],
  },
  {
    id: "java-packaged-accenture",
    dateRange: "Sep 2024 — Dec 2024",
    title: "Java Packaged Application Developer",
    company: "Accenture",
    bullets: [
      "Built packaged applications on Java EE and Spring Boot backends with React frontends. Jenkins pipelines for CI/CD.",
      "Completed the Agile Methodology bootcamp and applied Scrum to feature delivery. First Accenture rotation.",
    ],
  },
  {
    id: "test-dev-maxim",
    dateRange: "Feb 2023 — Sep 2023",
    title: "Test Development Engineer",
    company: "Maxim Integrated PH (now Analog Devices)",
    bullets: [
      "Developed semiconductor test programs in Teradyne's proprietary language and C# for production hardware validation.",
      "Diagnosed test-program failures by comparing measured hardware behavior against expected electrical specifications, which cut debug cycles meaningfully.",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative z-10 w-screen py-8 md:py-12 px-6 md:px-12 scroll-mt-14 md:scroll-mt-0 overflow-hidden md:min-h-[calc(100dvh-7rem)] md:flex md:flex-col md:justify-center"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-10 md:mb-14 max-w-3xl">
          <div className="text-sm md:text-base uppercase tracking-[0.3em] text-red-400 font-mono font-semibold mb-3">
            /experience
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Work <span className="text-red-500">history</span>
          </h2>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
            The last three years in detail. Mostly Accenture rotations across
            full-stack, automation, PEGA, and packaged apps, with a stretch
            in hardware test before that.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-x-8 gap-y-6 md:gap-y-10">
          {roles.map((role) => (
            <Fragment key={role.id}>
              <div className="hidden md:block pt-6 text-right">
                <div className="font-mono text-xs uppercase tracking-[0.22em] text-red-300/90">
                  {role.dateRange}
                </div>
              </div>
              <div
                data-cursor-glow
                tabIndex={0}
                className="cursor-card group rounded-sm border border-red-500/20 frost p-5 md:p-6 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1.5 md:hidden">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-300/90">
                    {role.dateRange}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {role.title}
                  </h3>
                  <span className="text-red-300 text-sm md:text-base">
                    {role.company}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {role.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex gap-3 items-start text-sm md:text-base text-gray-300 leading-relaxed"
                    >
                      <span className="mt-2 block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

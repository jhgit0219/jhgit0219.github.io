"use client";

import { useSectionNavigation } from "@/hooks/useSectionNavigation";
import NavDrawer from "@/components/NavDrawer";
import HeroFrames from "@/components/HeroFrames";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import FeatureSection from "@/components/FeatureSection";
import LabSection from "@/components/LabSection";
import GithubRepos from "@/components/GithubRepos";
import GithubActivity from "@/components/GithubActivity";
import ColophonSection from "@/components/ColophonSection";
import ContactSection from "@/components/ContactSection";
import ConnectPrompt from "@/components/ConnectPrompt";
import ScrollSection from "@/components/ScrollSection";

export default function Home() {
  const {
    aboutRef,
    experienceRef,
    skillsRef,
    featureRef,
    labRef,
    contactRef,
    activeSection,
    scrollToSection,
  } = useSectionNavigation();

  return (
    <>
      <NavDrawer onNavigate={scrollToSection} activeSection={activeSection} />
      <HeroFrames onViewWorkClick={() => scrollToSection("features")} />

        <ScrollSection>
          <section id="about" ref={aboutRef}>
            <AboutSection />
          </section>
        </ScrollSection>

        <ScrollSection>
          <section id="experience" ref={experienceRef}>
            <ExperienceSection />
          </section>
        </ScrollSection>

        <ScrollSection>
          <section id="skills" ref={skillsRef}>
            <SkillsSection />
          </section>
        </ScrollSection>

        <ScrollSection>
          <section id="features" ref={featureRef}>
            <FeatureSection />
          </section>
        </ScrollSection>

        <ScrollSection>
          <section id="lab" ref={labRef}>
            <LabSection />
          </section>
        </ScrollSection>

        <ScrollSection>
          <section
            id="github"
            className="relative z-10 w-screen py-8 md:py-12 px-6 md:px-12 scroll-mt-14 md:scroll-mt-0 overflow-hidden md:min-h-[calc(100dvh-7rem)] md:flex md:flex-col md:justify-center"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <div className="max-w-6xl mx-auto w-full">
              <div className="mb-10 md:mb-14 max-w-3xl">
                <div className="text-sm md:text-base uppercase tracking-[0.3em] text-red-400 font-mono font-semibold mb-3">
                  /code
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                  Live from <span className="text-red-500">GitHub</span>
                </h2>
                <p className="text-base md:text-lg text-gray-200 leading-relaxed [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)]">
                  Contribution heatmap and recent activity from my public
                  repos. The stuff I&rsquo;m actively pushing on, plus the
                  long tail of side projects that didn&rsquo;t make the
                  featured cut above.
                </p>
              </div>

              <GithubActivity />

              <div className="mt-14 md:mt-16 mb-6 md:mb-8 flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-red-400 mb-2 font-mono">
                    /repos
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    Recent repositories
                  </h3>
                </div>
              </div>
              <GithubRepos />
            </div>
          </section>
        </ScrollSection>

        <ScrollSection>
          <ColophonSection />
        </ScrollSection>

        <ScrollSection>
          <section id="contact" ref={contactRef}>
            <ContactSection />
          </section>
        </ScrollSection>

        <ConnectPrompt />
    </>
  );
}

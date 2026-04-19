"use client";

import { useSectionNavigation } from "@/hooks/useSectionNavigation";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import FeatureSection from "@/components/FeatureSection";
import LabSection from "@/components/LabSection";
import ContactSection from "@/components/ContactSection";
import ScrollSection from "@/components/ScrollSection";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";

export default function Home() {
  const {
    aboutRef,
    skillsRef,
    featureRef,
    labRef,
    contactRef,
    activeSection,
    scrollToSection,
  } = useSectionNavigation();

  return (
    <>
      <MobileNavbar onNavigate={scrollToSection} />
      <Sidebar onNavigate={scrollToSection} activeSection={activeSection} />
      <main className="w-full overflow-hidden">
        <ScrollSection suppressInitial>
          <HeroSection onViewWorkClick={() => scrollToSection("features")} />
        </ScrollSection>

        <ScrollSection>
          <section id="about" ref={aboutRef}>
            <AboutSection />
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
          <section id="contact" ref={contactRef}>
            <ContactSection />
          </section>
        </ScrollSection>
        <Footer />
      </main>
    </>
  );
}

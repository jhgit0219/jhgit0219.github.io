"use client";

import { useSectionNavigation } from "@/hooks/useSectionNavigation";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import ContactSection from "@/components/ContactSection";
import ScrollSection from "@/components/ScrollSection";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";

export default function Home() {
  const { featureRef, contactRef, activeSection, scrollToSection } =
    useSectionNavigation();

  return (
    <>
      <MobileNavbar
        onProjectsClick={() => scrollToSection("features")}
        onContactClick={() => scrollToSection("contact")}
      />
      <Sidebar
        onProjectsClick={() => scrollToSection("features")}
        onContactClick={() => scrollToSection("contact")}
        activeSection={activeSection}
      />
      <main className="w-full overflow-hidden">
        <ScrollSection suppressInitial>
          <HeroSection onViewWorkClick={() => scrollToSection("features")} />
        </ScrollSection>

        <ScrollSection>
          <section id="features" ref={featureRef}>
            <FeatureSection />
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

"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import ContactSection from "@/components/ContactSection";
import ScrollSection from "@/components/ScrollSection";
import Footer from "@/components/Footer";

export default function Home() {
  const featureRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState<
    "features" | "contact" | null
  >(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    featureRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === "features" || id === "contact") {
              setActiveSection(id);
            }
          }
        }
      },
      { threshold: 0.6 }
    );

    const featureEl = document.getElementById("features");
    const contactEl = document.getElementById("contact");

    if (featureEl) observer.observe(featureEl);
    if (contactEl) observer.observe(contactEl);

    return () => {
      if (featureEl) observer.unobserve(featureEl);
      if (contactEl) observer.unobserve(contactEl);
    };
  }, []);

  return (
    <>
      <Sidebar
        onProjectsClick={scrollToFeatures}
        onContactClick={scrollToContact}
        activeSection={activeSection}
      />
      <main className="w-full overflow-hidden">
        <ScrollSection suppressInitial>
          <HeroSection onViewWorkClick={scrollToFeatures} />
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

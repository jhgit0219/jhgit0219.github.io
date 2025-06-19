import { useEffect, useRef, useState } from "react";

type SectionKey = "features" | "contact";

export function useSectionNavigation() {
  const featureRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  const scrollToSection = (section: SectionKey) => {
    if (section === "features") {
      featureRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (section === "contact") {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionKey;
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

  return {
    featureRef,
    contactRef,
    activeSection,
    scrollToSection,
  };
}

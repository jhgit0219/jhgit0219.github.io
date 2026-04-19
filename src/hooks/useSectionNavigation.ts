import { useEffect, useRef, useState } from "react";

export type SectionKey = "about" | "skills" | "features" | "lab" | "contact";

// offsetTop walk ignores ancestor transforms, so nav-click scroll lands
// correctly even while a parent motion wrapper is mid-animation.
function computeLayoutTop(el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

function scrollMarginTopPx(el: HTMLElement): number {
  const raw = getComputedStyle(el).scrollMarginTop;
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function useSectionNavigation() {
  const aboutRef = useRef<HTMLElement | null>(null);
  const skillsRef = useRef<HTMLElement | null>(null);
  const featureRef = useRef<HTMLElement | null>(null);
  const labRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  const scrollToSection = (section: SectionKey) => {
    const map: Record<SectionKey, React.RefObject<HTMLElement | null>> = {
      about: aboutRef,
      skills: skillsRef,
      features: featureRef,
      lab: labRef,
      contact: contactRef,
    };
    const el = map[section].current;
    if (!el) return;

    const inner = (el.firstElementChild as HTMLElement | null) ?? el;
    const target = computeLayoutTop(inner) - scrollMarginTopPx(inner);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    const ids: SectionKey[] = ["about", "skills", "features", "lab", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionKey;
            if (ids.includes(id)) {
              setActiveSection(id);
            }
          }
        }
      },
      { threshold: 0.4 }
    );

    const observed: Element[] = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observed.push(el);
      }
    }

    return () => {
      for (const el of observed) observer.unobserve(el);
      observer.disconnect();
    };
  }, []);

  return {
    aboutRef,
    skillsRef,
    featureRef,
    labRef,
    contactRef,
    activeSection,
    scrollToSection,
  };
}

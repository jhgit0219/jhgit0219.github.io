import { useEffect, useRef, useState } from "react";

export type SectionKey = "about" | "experience" | "skills" | "features" | "lab" | "contact";

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
  const experienceRef = useRef<HTMLElement | null>(null);
  const skillsRef = useRef<HTMLElement | null>(null);
  const featureRef = useRef<HTMLElement | null>(null);
  const labRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  const scrollToSection = (section: SectionKey) => {
    const map: Record<SectionKey, React.RefObject<HTMLElement | null>> = {
      about: aboutRef,
      experience: experienceRef,
      skills: skillsRef,
      features: featureRef,
      lab: labRef,
      contact: contactRef,
    };
    const el = map[section].current;
    if (!el) return;

    const inner = (el.firstElementChild as HTMLElement | null) ?? el;
    const target = computeLayoutTop(inner) - scrollMarginTopPx(inner);
    const root = document.getElementById("scroll-root");
    if (root) {
      root.scrollTo({ top: target, behavior: "smooth" });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const ids: SectionKey[] = ["about", "experience", "skills", "features", "lab", "contact"];
    let ticking = false;
    let lastActive: SectionKey | null = null;

    // Scroll-based active-section detection. IO + isIntersecting=true was
    // unreliable here: in the gap between one section exiting the rootMargin
    // band and the next entering it, no event fires, so the indicator gets
    // stuck on the section the user just left. Polling all sections per
    // scroll frame is simpler and correct.
    const recompute = () => {
      ticking = false;
      const triggerLine = window.innerHeight * 0.35;
      let next: SectionKey | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerLine && rect.bottom > triggerLine) {
          next = id;
          break;
        }
      }
      if (next !== lastActive) {
        lastActive = next;
        setActiveSection(next);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(recompute);
    };

    const root = document.getElementById("scroll-root");
    const scrollTarget: EventTarget = root ?? window;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
    window.addEventListener("resize", onScroll, { passive: true });
    // Initial run after layout settles.
    requestAnimationFrame(recompute);

    return () => {
      scrollTarget.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return {
    aboutRef,
    experienceRef,
    skillsRef,
    featureRef,
    labRef,
    contactRef,
    activeSection,
    scrollToSection,
  };
}

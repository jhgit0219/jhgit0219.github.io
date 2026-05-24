"use client";

import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { SectionKey } from "@/hooks/useSectionNavigation";

interface NavItem {
  key: SectionKey;
  label: string;
}

const items: NavItem[] = [
  { key: "about", label: "About" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills" },
  { key: "features", label: "Projects" },
  { key: "lab", label: "Lab" },
  { key: "contact", label: "Contact" },
];

export default function NavDrawer({
  onNavigate,
  activeSection,
}: {
  onNavigate: (section: SectionKey) => void;
  activeSection: SectionKey | null;
}) {
  const [open, setOpen] = useState(false);
  // Chevron starts hidden during hero, fades in + slides down once the user
  // scrolls past the hero so the top HUD chrome can hand off the top-left.
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Body attribute lets the SceneBackdrop HUD fade out when the drawer is open.
  useEffect(() => {
    if (open) {
      document.body.setAttribute("data-nav-open", "true");
    } else {
      document.body.removeAttribute("data-nav-open");
    }
    return () => {
      document.body.removeAttribute("data-nav-open");
    };
  }, [open]);

  useEffect(() => {
    const root = document.getElementById("scroll-root");
    if (!root) return;
    const onScroll = () => {
      const maxScroll = root.scrollHeight - root.clientHeight;
      const progress = maxScroll <= 0 ? 0 : root.scrollTop / maxScroll;
      // Match SceneBackdrop's top-HUD fade-out window (~0.02 → 0.08).
      setScrolledPastHero(progress > 0.05);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (key: SectionKey) => {
    onNavigate(key);
    setOpen(false);
  };

  return (
    <>
      {/* Invisible left-edge hover hot zone (24px wide, full height) */}
      <div
        aria-hidden
        onMouseEnter={() => setOpen(true)}
        className="fixed left-0 top-0 z-40 h-screen w-6"
      />

      {/* Hidden during hero so it doesn't compete with the HUD chrome. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-hidden={!scrolledPastHero && !open}
        tabIndex={!scrolledPastHero && !open ? -1 : 0}
        className={`fixed left-3 top-3 z-[60] inline-flex h-7 w-7 items-center justify-center rounded-md border border-blood-700/50 bg-abyss-900/70 text-blood-300 backdrop-blur-md transition-[opacity,transform,border-color,color] duration-300 ease-out hover:border-blood-500 hover:text-white md:left-4 md:top-4 ${
          scrolledPastHero || open
            ? "translate-y-0 opacity-100"
            : "-translate-y-[150%] opacity-0 pointer-events-none"
        }`}
      >
        {open ? <FaChevronLeft className="text-[11px]" /> : <FaChevronRight className="text-[11px]" />}
      </button>

      {/* No backdrop-blur — would muddy the drawer's frost behind it. */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/15 transition-opacity"
        />
      )}

      <aside
        onMouseLeave={() => setOpen(false)}
        style={{ ["--frost-blur" as string]: "var(--frost-blur-strong)" }}
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-red-500/20 frost transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col gap-8 px-6 pt-20 pb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-blood-500">
            // Navigate
          </div>
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const active = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavigate(item.key)}
                  data-cursor-glow
                  className={`cursor-card group inline-flex items-center justify-between rounded-md px-3 py-3 text-left font-sans text-lg tracking-tight transition ${
                    active
                      ? "bg-blood-700/15 text-white"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.22em] transition ${
                      active ? "text-blood-400" : "text-zinc-600 group-hover:text-blood-400"
                    }`}
                  >
                    {active ? "active" : "→"}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

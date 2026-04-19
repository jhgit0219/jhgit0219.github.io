"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import type { SectionKey } from "@/hooks/useSectionNavigation";

interface NavItem {
  key: SectionKey;
  label: string;
}

const items: NavItem[] = [
  { key: "about", label: "About" },
  { key: "skills", label: "Skills" },
  { key: "features", label: "Projects" },
  { key: "lab", label: "Lab" },
  { key: "contact", label: "Contact" },
];

export default function Sidebar({
  onNavigate,
  activeSection,
}: {
  onNavigate: (section: SectionKey) => void;
  activeSection: SectionKey | null;
}) {
  const { scrollY } = useScroll();
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    setViewportHeight(window.innerHeight);
  }, []);

  const appearY = viewportHeight * 1.0;
  const disappearY = viewportHeight * 0.6;

  const opacity = useTransform(scrollY, [disappearY, appearY], [0, 1]);
  const top = useTransform(scrollY, [disappearY, appearY], ["90%", "40%"]);

  return (
    <div className="hidden md:block md:fixed md:top-0 md:left-0 md:w-28 md:h-screen md:z-50 md:pointer-events-none">
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-red-500/10 backdrop-blur-md border-none pointer-events-none"
      />
      <motion.div
        style={{ top, opacity }}
        className="absolute left-0 w-full pointer-events-auto"
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-lg text-gray-200 font-light tracking-wide">
          {items.map((item) => (
            <a
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`cursor-pointer px-2 py-1 transition ${
                activeSection === item.key
                  ? "text-white drop-shadow-[0_0_8px_rgba(255,0,0,0.9)] font-semibold"
                  : "hover:text-white text-red-200"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

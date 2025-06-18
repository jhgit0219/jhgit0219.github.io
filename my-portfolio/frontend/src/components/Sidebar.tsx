"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Sidebar({
  onProjectsClick,
  onContactClick,
  activeSection,
}: {
  onProjectsClick: () => void;
  onContactClick: () => void;
  activeSection: "features" | "contact" | null;
}) {
  const { scrollY } = useScroll();
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    setViewportHeight(window.innerHeight);
  }, []);

  const appearY = viewportHeight * 1.0;
  const disappearY = viewportHeight * 0.6;

  const opacity = useTransform(scrollY, [disappearY, appearY], [0, 1]);

  const top = useTransform(scrollY, [disappearY, appearY], ["90%", "45%"]);

  return (
    <div className="fixed top-0 left-0 w-24 md:w-28 h-screen z-50 pointer-events-none">
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-red-500/10 backdrop-blur-md border-r border-red-400/30 pointer-events-none"
      />
      <motion.div
        style={{ top, opacity }}
        className="absolute left-0 w-full pointer-events-auto"
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-xl text-gray-200 font-light tracking-wide">
          <a
            onClick={onProjectsClick}
            className={`cursor-pointer px-2 py-1 transition ${
              activeSection === "features"
                ? "text-white drop-shadow-[0_0_8px_rgba(255,0,0,0.9)] font-semibold"
                : "hover:text-white text-red-200"
            }`}
          >
            Projects
          </a>
          <a
            onClick={onContactClick}
            className={`cursor-pointer px-2 py-1 transition ${
              activeSection === "contact"
                ? "text-white drop-shadow-[0_0_8px_rgba(255,0,0,0.9)] font-semibold"
                : "hover:text-white text-red-200"
            }`}
          >
            Contact
          </a>
        </div>
      </motion.div>
    </div>
  );
}

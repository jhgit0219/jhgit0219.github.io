"use client";

import type { SectionKey } from "@/hooks/useSectionNavigation";

export default function MobileNavbar({
  onNavigate,
}: {
  onNavigate: (section: SectionKey) => void;
}) {
  return (
    <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-[#0a0a0a] border-b border-red-500/20 px-4 py-2 flex items-center justify-between text-sm text-red-300">
      <div className="text-xl font-bold text-white">J</div>

      <div className="flex space-x-3 text-xs">
        <button onClick={() => onNavigate("about")} className="hover:text-white">
          About
        </button>
        <button onClick={() => onNavigate("skills")} className="hover:text-white">
          Skills
        </button>
        <button onClick={() => onNavigate("features")} className="hover:text-white">
          Projects
        </button>
        <button onClick={() => onNavigate("lab")} className="hover:text-white">
          Lab
        </button>
        <button onClick={() => onNavigate("contact")} className="hover:text-white">
          Contact
        </button>
      </div>
    </div>
  );
}

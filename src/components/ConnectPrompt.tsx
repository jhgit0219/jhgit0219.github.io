"use client";

import { useEffect, useState } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa";

// 0.55 lands them around Lab / GitHub — past projects, before contact.
const SHOW_AT = 0.55;

export default function ConnectPrompt() {
  const [pastThreshold, setPastThreshold] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const root = document.getElementById("scroll-root");
    if (!root) return;
    const onScroll = () => {
      const max = root.scrollHeight - root.clientHeight;
      if (max <= 0) return;
      setPastThreshold(root.scrollTop / max > SHOW_AT);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.getElementById("scroll-root");
    const contact = document.getElementById("contact");
    if (!root || !contact) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setContactVisible(Boolean(e?.isIntersecting));
      },
      { root, threshold: 0.15 },
    );
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  const handleJump = () => {
    const contact = document.getElementById("contact");
    if (contact) contact.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visible = pastThreshold && !contactVisible && !dismissed;

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed right-6 bottom-20 md:right-10 md:bottom-24 z-30 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3"
      }`}
    >
      <div
        data-cursor-glow
        className={`cursor-card relative w-[220px] md:w-[240px] rounded-sm border border-red-500/30 frost p-3.5 shadow-[0_0_30px_rgba(220,38,38,0.15)] ${
          visible ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Inline position: absolute beats `.cursor-card > *` in globals.css
            which would otherwise float the × into document flow. */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          style={{ position: "absolute" }}
          className="top-1 right-1 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-300 hover:bg-red-500/10 active:bg-red-500/20 transition rounded-sm text-xs"
        >
          <FaTimes />
        </button>

        <div className="font-mono text-[9px] uppercase tracking-widest text-red-400 mb-1.5">
          /signal
        </div>
        <p className="text-white text-[13px] font-semibold leading-snug mb-0.5">
          You&apos;re deep in the portfolio.
        </p>
        <p className="text-gray-400 text-[11px] leading-snug mb-3">
          Like what you see? Let&apos;s talk.
        </p>

        <button
          type="button"
          onClick={handleJump}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-sm inline-flex items-center justify-center gap-1.5 transition"
        >
          Jump to contact
          <FaArrowRight className="text-[9px]" />
        </button>
      </div>
    </div>
  );
}

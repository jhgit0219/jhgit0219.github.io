"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

// Pre-warms framer-motion's animation runtime + GPU compositor paths at app
// startup. Mounts a few off-screen motion elements that run the same
// transition profiles used by the real scroll-reveal sections (tween easeOut
// for x/y, spring for TiltImage). First-ever execution pays the cost of
// JIT-compiling the tween/spring runtime and allocating the initial
// compositor texture. By doing it here on a 1x1 invisible node, the user's
// first actual scroll into About / Skills / Lab hits hot code paths and
// pre-allocated GPU pipelines instead of paying that cost mid-animation.
//
// Auto-unmounts after the warmup window so we don't keep dead DOM around.
// will-change on the real motion elements (set in their style props) keeps
// their layers hot independently of this component's lifetime.
export default function MotionWarmup() {
  const [mounted, setMounted] = useState(true);

  // Drive a spring once to JIT the spring runtime (used by TiltImage).
  const spring = useMotionValue(0);
  const sprung = useSpring(spring, { stiffness: 220, damping: 18 });

  useEffect(() => {
    spring.set(1);
    const t = setTimeout(() => setMounted(false), 1500);
    return () => clearTimeout(t);
  }, [spring]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: -200,
        left: -200,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
        overflow: "hidden",
        contain: "strict",
      }}
    >
      {/* Tween: x-translate (ScrollReveal) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ willChange: "transform, opacity", width: 1, height: 1 }}
      />
      {/* Tween: y-translate (Skills cards, Lab cards, ScrollSection) */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ willChange: "transform, opacity", width: 1, height: 1 }}
      />
      {/* Spring: rotate (TiltImage uses rotateX/rotateY springs) */}
      <motion.div
        style={{
          rotateX: sprung,
          rotateY: sprung,
          willChange: "transform",
          width: 1,
          height: 1,
          transformStyle: "preserve-3d",
        }}
      />
    </div>
  );
}

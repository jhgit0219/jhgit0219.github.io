"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

// Off-screen 1x1 node that runs the same transition profiles as the real
// scroll-reveal sections, so framer-motion's tween + spring runtimes JIT
// before the user's first scroll lands on a hot path. Self-unmounts after
// the warmup window.
export default function MotionWarmup() {
  const [mounted, setMounted] = useState(true);

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
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ willChange: "transform, opacity", width: 1, height: 1 }}
      />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ willChange: "transform, opacity", width: 1, height: 1 }}
      />
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

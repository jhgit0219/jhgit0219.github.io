"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export default function ScrollReveal({
  children,
  reverse = false,
}: {
  children: React.ReactNode;
  reverse?: boolean;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 70%"],
  });

  // Scroll range: 0 (just entering) → 1 (fully centered in viewport)
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? [100, 0] : [-100, 0]
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} style={{ x, opacity }} className="w-full">
      {children}
    </motion.div>
  );
}

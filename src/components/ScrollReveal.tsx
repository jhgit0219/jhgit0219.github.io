"use client";

import { motion } from "framer-motion";

export default function ScrollReveal({
  children,
  reverse = false,
}: {
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <motion.div
      initial={{ x: reverse ? 100 : -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

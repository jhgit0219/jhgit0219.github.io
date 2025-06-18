"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function ScrollSection({
  children,
  suppressInitial = false,
  id,
  className = "",
}: {
  children: React.ReactNode;
  suppressInitial?: boolean;
  id?: string;
  className?: string;
}) {
  const [hasMounted, setHasMounted] = useState(false);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHasScrolledUp(currentY < lastY);
      lastY = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={suppressInitial ? {} : { opacity: 0, y: 100 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : hasMounted && hasScrolledUp
          ? { opacity: 0, y: -100 }
          : { opacity: 1, y: 0 }
      }
      transition={{ duration: 0.6 }}
      className={`min-h-screen flex items-center justify-center ${className}`}
    >
      {children}
    </motion.section>
  );
}

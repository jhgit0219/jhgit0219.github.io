"use client";

import { useEffect } from "react";

export default function ProjectDetailClient() {
  useEffect(() => {
    const root = document.getElementById("scroll-root");
    if (root) {
      root.scrollTo({ top: 0, behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);
  return null;
}

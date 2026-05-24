"use client";

import { useEffect } from "react";
import projects from "@/data/projects.json";
import type { Project } from "@/class/project";

// Primes the browser cache with project previews + contact assets on mount.
// Hero frames are preloaded separately by SceneBackdrop.
export default function ImagePreloader() {
  useEffect(() => {
    const urls = new Set<string>();
    for (const p of projects as Project[]) {
      if (p.image) urls.add(p.image);
      if (p.gallery) for (const g of p.gallery) urls.add(g);
    }
    urls.add("/images/laptop.png");
    urls.add("/images/phone.png");

    for (const url of urls) {
      const img = new window.Image();
      img.src = url;
    }
  }, []);

  return null;
}

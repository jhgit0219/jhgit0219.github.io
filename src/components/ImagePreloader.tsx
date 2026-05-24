"use client";

import { useEffect } from "react";
import projects from "@/data/projects.json";
import type { Project } from "@/class/project";

/**
 * Fires once on app mount and primes the browser cache with every image the
 * page will eventually need — project previews, contact section laptop/phone.
 * The hero frame sequence is preloaded separately by SceneBackdrop (which
 * also gates render with a loading screen until those 169 frames are ready).
 *
 * After this runs, scrolling into the projects / contact sections paints
 * instantly because the images are already in the HTTP cache.
 */
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

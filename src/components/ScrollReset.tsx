"use client";

import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    const root = document.getElementById("scroll-root");
    if (root) {
      root.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  return null;
}

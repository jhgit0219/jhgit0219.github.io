"use client";

import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return null;
}

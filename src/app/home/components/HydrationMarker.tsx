// src/components/shared/HydrationMarker.tsx
"use client";

import { useEffect } from "react";

export default function HydrationMarker() {
  useEffect(() => {
    try {
      document.body.classList.add("hydrated");
      // useful for debugging — remove in production
      // console.log("HydrationMarker: added body.hydrated");
    } catch (e) {
      // ignore
    }
    return () => {
      try { document.body.classList.remove("hydrated"); } catch {}
    };
  }, []);

  return null;
}

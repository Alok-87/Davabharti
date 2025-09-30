// src/components/shared/FeatureMobileCarouselClient.tsx
"use client";

import React from "react";
import Image from "next/image";
import cosmetic from "@/assets/Cosmetic.png";
import cosmetic_2 from "@/assets/Cosmetic2.png";
import winterscare from "@/assets/winterscare.png";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

const IMAGES = [
  { src: cosmetic, alt: "Cosmetic product 1" },
  { src: winterscare, alt: "Winter care products" },
  { src: cosmetic_2, alt: "Cosmetic product 2" },
];

export default function FeatureMobileCarouselClient() {
  const [index, setIndex] = React.useState(0);
  const len = IMAGES.length;

  const prev = () => setIndex((i) => (i - 1 + len) % len);
  const next = () => setIndex((i) => (i + 1) % len);

  // keyboard nav
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    // This component is hidden on md+ via CSS (same behavior as original)
    <div className="relative md:hidden w-full mt-6 overflow-hidden" aria-roledescription="carousel" aria-label="Promotional images">
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {IMAGES.map((img, i) => (
          <div key={i} className="w-full flex-shrink-0 px-4">
            <Image src={img.src} alt={img.alt} className="rounded-lg object-cover" />
          </div>
        ))}
      </div>

      <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 text-3xl z-10">
        <BiLeftArrow />
      </button>
      <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 text-3xl z-10">
        <BiRightArrow />
      </button>
    </div>
  );
}

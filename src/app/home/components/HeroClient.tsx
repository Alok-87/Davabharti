// src/components/shared/HeroClient.tsx
'use client';

import Image from 'next/image';
import hero_1 from '@/assets/hero_1.png';
import hero_2 from '@/assets/hero_2.avif';
import hero_3 from '@/assets/hero_3.jpg';

const IMAGES = [
  { src: hero_1, alt: 'Person receiving a prescription medicine at home' },
  { src: hero_2, alt: 'Medicine box and blister pack' },
  { src: hero_3, alt: 'Health products and care items' },
];

export default function HeroClient() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const length = IMAGES.length;

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % length), 4000);
    return () => clearInterval(id);
  }, [paused, length]);

  const go = (i: number) => setIndex((i + length) % length);

  // keyboard accessibility
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + length) % length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [length]);

  return (
    <div
      className="relative w-full h-[400px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Promotional hero"
    >
      {IMAGES.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={i === index ? 'false' : 'true'}
        >
          <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} />
        </div>
      ))}

      {/* indicators */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
        role="tablist"
        aria-label="Hero images"
      >
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-selected={i === index}
            aria-label={`Show slide ${i + 1}`}
            className={`w-3 h-3 rounded-full focus:outline-none focus:ring-2 ${i === index ? 'bg-white' : 'bg-gray-400'}`}
          />
        ))}
      </div>

      {/* previous / next for keyboard & screen readers */}
      <div className="absolute inset-y-0 left-2 flex items-center">
        <button
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="p-2 rounded-full focus:outline-none focus:ring-2 bg-black/30 text-white"
        >
          ‹
        </button>
      </div>
      <div className="absolute inset-y-0 right-2 flex items-center">
        <button
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="p-2 rounded-full focus:outline-none focus:ring-2 bg-black/30 text-white"
        >
          ›
        </button>
      </div>
    </div>
  );
}

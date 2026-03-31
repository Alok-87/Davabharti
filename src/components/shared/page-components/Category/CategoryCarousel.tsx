'use client';
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Category } from '@/features/categories/type';


const Slider = dynamic(() => import('react-slick'), { ssr: false });

interface CategoryCarouselProps {
  categories: Category[];
}

const PrevArrow = ({ onClick }: any) => (
  <button
    aria-label="Previous"
    className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
    onClick={onClick}
    type="button"
  >
    <FaChevronLeft className="text-gray-700" />
  </button>
);

const NextArrow = ({ onClick }: any) => (
  <button
    aria-label="Next"
    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
    onClick={onClick}
    type="button"
  >
    <FaChevronRight className="text-gray-700" />
  </button>
);

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const router = useRouter();

  // --- Controlled slidesToShow (no react-slick responsive glitches)
  const [slidesToShow, setSlidesToShow] = useState(7);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setSlidesToShow(w < 640 ? 2 : w < 1024 ? 3 : w < 1280 ? 4 : 7);
    };
    calc();
    window.addEventListener('resize', calc);
    // nudge react-slick when DevTools changes device
    setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const settings = useMemo(
    () => ({
      dots: false,
      infinite: false,
      slidesToShow,
      slidesToScroll: 1,
      speed: 500,
      arrows: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      swipeToSlide: true,
      touchThreshold: 12,
      // keep height stable
      adaptiveHeight: false,
    }),
    [slidesToShow]
  );

  const clickHandler = (name: string) => {
    router.push(`/medicines?categoryNames=${encodeURIComponent(name)}`);
  };

  return (
    <div className="relative w-full overflow-hidden md:px-4">
      {/* key forces a clean remount when slidesToShow changes */}
      <Slider key={slidesToShow} {...settings}>
        {categories.map((category) => (
          <div key={category.id} className="px-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-full border border-gray-200 rounded-lg bg-white hover:shadow-md transition">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  width={220}
                  height={160}
                  className="w-full h-[160px] object-contain p-4 cursor-pointer"
                  onClick={() => clickHandler(category.name)}
                  // priority
                />
              </div>
              <p
                className="text-gray-800 font-medium text-sm mt-3 cursor-pointer line-clamp-1"
                onClick={() => clickHandler(category.id)}
                title={category.name}
              >
                {category.name}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

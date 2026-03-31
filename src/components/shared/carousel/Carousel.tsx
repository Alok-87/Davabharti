// 'use client';

// import { useRef, useEffect, useState, ReactNode } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper/modules';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// import 'swiper/css';
// import 'swiper/css/navigation';
// import { IoIosArrowBack, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle, IoIosArrowForward } from 'react-icons/io';

// interface CarouselProps<T> {
//   items: T[];
//   loading?: boolean;
//   slidesPerViewDesktop?: number;
//   slidesPerViewTablet?: number;
//   slidesPerViewMobile?: number;
//   spaceBetween?: number;
//   renderItem: (item: T, index: number) => ReactNode;
//   renderLoader?: (index: number) => ReactNode; // optional shimmer
// }

// export default function Carousel<T>({
//   items,
//   loading = false,
//   slidesPerViewDesktop = 4,
//   slidesPerViewTablet = 2,
//   slidesPerViewMobile = 1,
//   spaceBetween = 20,
//   renderItem,
//   renderLoader,
// }: CarouselProps<T>) {
//   const prevRef = useRef<HTMLButtonElement>(null);
//   const nextRef = useRef<HTMLButtonElement>(null);
//   const [swiperInstance, setSwiperInstance] = useState<any>(null);
//   const [isBeginning, setIsBeginning] = useState(true);
//   const [isEnd, setIsEnd] = useState(false);

//   useEffect(() => {
//     if (swiperInstance && prevRef.current && nextRef.current) {
//       swiperInstance.params.navigation.prevEl = prevRef.current;
//       swiperInstance.params.navigation.nextEl = nextRef.current;
//       swiperInstance.navigation.destroy();
//       swiperInstance.navigation.init();
//       swiperInstance.navigation.update();

//       setIsBeginning(swiperInstance.isBeginning);
//       setIsEnd(swiperInstance.isEnd);
//     }
//   }, [swiperInstance]);

//   const handleSlideChange = (swiper: any) => {
//     setIsBeginning(swiper.isBeginning);
//     setIsEnd(swiper.isEnd);
//   };

//   return (

// <div className="relative w-full">
//   <Swiper
//     modules={[Navigation]}
//     spaceBetween={spaceBetween}
//     slidesPerView={slidesPerViewDesktop}
//     onSwiper={setSwiperInstance}
//     onSlideChange={handleSlideChange}
//     breakpoints={{
//       1024: { slidesPerView: slidesPerViewDesktop },
//       640: { slidesPerView: slidesPerViewTablet },
//       0: { slidesPerView: slidesPerViewMobile },
//     }}
//   >
//     {loading
//       ? Array.from({ length: slidesPerViewDesktop }).map((_, index) => (
//           <SwiperSlide key={index}>
//             {renderLoader ? (
//               renderLoader(index)
//             ) : (
//               <div className="p-4 bg-gray-200 rounded-md">Loading...</div>
//             )}
//           </SwiperSlide>
//         ))
//       : items.map((item, idx) => (
//           <SwiperSlide key={idx}>{renderItem(item, idx)}</SwiperSlide>
//         ))}
//   </Swiper>

//   {/* Left overlay + arrow (hidden on mobile) */}
//   <div
//     className={`absolute inset-y-0 left-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-white via-white/60 to-transparent transition-opacity duration-300 hidden sm:block ${
//       isBeginning ? "opacity-0" : "opacity-100"
//     }`}
//   />
//   <button
//     ref={prevRef}
//     className={`absolute -left-4 top-1/2 -translate-y-12 z-20
//       bg-gray-700 text-white p-3 rounded-full shadow-md transition hidden sm:flex
//       ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
//   >
//     <IoIosArrowBack className="text-3xl" />
//   </button>

//   {/* Right overlay + arrow (hidden on mobile) */}
//   <div
//     className={`absolute inset-y-0 right-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-white via-white/60 to-transparent transition-opacity duration-300 hidden sm:block ${
//       isEnd ? "opacity-0" : "opacity-100"
//     }`}
//   />
//   <button
//     ref={nextRef}
//     className={`absolute -right-4 top-1/2 -translate-y-12 z-20
//       bg-gray-700 text-white p-3 rounded-full shadow-md transition hidden sm:flex
//       ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
//   >
//     <IoIosArrowForward className="text-3xl" />
//   </button>
// </div>

//   );
// }
'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselProps<T> {
  items: T[];
  loading?: boolean;
  slidesPerViewDesktop?: number;
  slidesPerViewTablet?: number;
  slidesPerViewMobile?: number;
  spaceBetween?: number;
  renderItem: (item: T, index: number) => ReactNode;
  renderLoader?: (index: number) => ReactNode;
  autoplay?: boolean; // auto scroll
  autoplayDelay?: number; // delay between auto scrolls
  loop?: boolean; // infinite loop
  showPagination?: boolean; // pagination dots
  showArrows?: boolean;
  centeredSlides?: boolean; // left/right arrows
}

export default function Carousel<T>({
  items,
  loading = false,
  slidesPerViewDesktop = 4,
  slidesPerViewTablet = 2,
  slidesPerViewMobile = 1,
  spaceBetween = 20,
  renderItem,
  renderLoader,
  autoplay = false,
  autoplayDelay = 2500,
  loop = false,
  showPagination = false,
  showArrows = true,
  centeredSlides = false, // <-- NEW
}: CarouselProps<T>) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiperInstance && showArrows && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();

      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);
    }
  }, [swiperInstance, showArrows]);

  const handleSlideChange = (swiper: any) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="relative w-full">
      <Swiper
        modules={[
          Navigation,
          ...(autoplay ? [Autoplay] : []),
          ...(showPagination ? [Pagination] : []),
        ]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerViewDesktop}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        centeredSlides={centeredSlides}
        loop={loop}
        autoplay={autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false}
        pagination={
          showPagination
            ? {
                clickable: true,
                renderBullet: (i, className) => `<span class="${className} custom-bullet"></span>`,
              }
            : false
        }
        breakpoints={{
          1024: { slidesPerView: slidesPerViewDesktop },
          640: { slidesPerView: slidesPerViewTablet },
          0: { slidesPerView: slidesPerViewMobile },
        }}
      >
        {loading
          ? Array.from({ length: slidesPerViewDesktop }).map((_, index) => (
              <SwiperSlide key={index}>
                {renderLoader ? (
                  renderLoader(index)
                ) : (
                  <div className="p-4 bg-gray-200 rounded-md">Loading...</div>
                )}
              </SwiperSlide>
            ))
          : items.map((item, idx) => <SwiperSlide key={idx}>{renderItem(item, idx)}</SwiperSlide>)}
      </Swiper>

      {/* Conditional Arrows */}
      {showArrows && (
        <>
          <button
            ref={prevRef}
            className={`absolute -left-4 top-1/2 -translate-y-12 z-20
              bg-gray-700 text-white p-3 rounded-full shadow-md transition hidden sm:flex
              ${isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
          >
            <IoIosArrowBack className="text-3xl" />
          </button>

          <button
            ref={nextRef}
            className={`absolute -right-4 top-1/2 -translate-y-12 z-20
              bg-gray-700 text-white p-3 rounded-full shadow-md transition hidden sm:flex
              ${isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
          >
            <IoIosArrowForward className="text-3xl" />
          </button>
        </>
      )}

      {/* Pagination Dots Styling */}
      {showPagination && (
        <style jsx global>{`
          .swiper-pagination {
            position: absolute !important;
            bottom: 12px !important;
            left: 50% !important;
            transform: translateX(-50%);
            display: flex !important;
            justify-content: center;
            gap: 8px;
            z-index: 20;
          }

          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background-color: #9ca3af;
            opacity: 1;
            transition: all 0.3s ease;
            border-radius: 9999px; /* fully round */
          }

          .swiper-pagination-bullet-active {
            width: 40px;
            height: 10px;
            background-color: #1f2937;
          }
        `}</style>
      )}
    </div>
  );
}

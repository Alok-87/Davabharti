// "use client";

// import { useRef, useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// import "swiper/css";
// import "swiper/css/navigation";
// import ShimmerCard from "../shimmer/ShimmerCard";

// interface CarouselProps<T> {
//   items: T[];
//   variant?: "product"; // can add more variants later
//   loading?: boolean;
//   slidesPerViewDesktop?: number;
//   slidesPerViewTablet?: number;
//   slidesPerViewMobile?: number;
//   spaceBetween?: number;
// }

// export default function Carousel<T>({
//   items,
//   variant = "product",
//   loading,
//   slidesPerViewDesktop = 4,
//   slidesPerViewTablet = 2,
//   slidesPerViewMobile = 1,
//   spaceBetween = 20,
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

//   const renderCard = (item: any) => {
//     if (variant === "product") {
//       return (
//         <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
//           <img src={item.image} alt={item.name} className="w-full aspect-square rounded-xl object-cover" />
//           <div className="mt-4 flex justify-between items-center">
//             <h6 className="font-semibold text-lg">{item.name}</h6>
//             <span className="text-indigo-600 font-bold">{item.price}</span>
//           </div>
//           <p className="text-sm text-gray-500">{item.description}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="relative w-full">
//       <Swiper
//         modules={[Navigation]}
//         spaceBetween={spaceBetween}
//         slidesPerView={slidesPerViewDesktop}
//         onSwiper={setSwiperInstance}
//         onSlideChange={handleSlideChange}
//         breakpoints={{
//           1024: { slidesPerView: slidesPerViewDesktop },
//           640: { slidesPerView: slidesPerViewTablet },
//           0: { slidesPerView: slidesPerViewMobile },
//         }}
//       >
//         {loading
//           ? Array.from({ length: slidesPerViewDesktop }).map((_, index) => (
//               <SwiperSlide key={index}>
//                 <ShimmerCard />
//               </SwiperSlide>
//             ))
//           : items.map((item, idx) => <SwiperSlide key={idx}>{renderCard(item)}</SwiperSlide>)}
//       </Swiper>

//       {/* Left arrow */}
//       <button
//         ref={prevRef}
//         className={`absolute left-0 top-1/2 -translate-y-1/2 z-10
//           bg-gray-700 text-white p-3 rounded-full shadow-md transition
//           ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
//       >
//         <FaArrowLeft />
//       </button>

//       {/* Right arrow */}
//       <button
//         ref={nextRef}
//         className={`absolute right-0 top-1/2 -translate-y-1/2 z-10
//           bg-gray-700 text-white p-3 rounded-full shadow-md transition
//           ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
//       >
//         <FaArrowRight />
//       </button>
//     </div>
//   );
// }
"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

interface CarouselProps<T> {
  items: T[];
  loading?: boolean;
  slidesPerViewDesktop?: number;
  slidesPerViewTablet?: number;
  slidesPerViewMobile?: number;
  spaceBetween?: number;
  renderItem: (item: T, index: number) => ReactNode;
  renderLoader?: (index: number) => ReactNode; // optional shimmer
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
}: CarouselProps<T>) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();

      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);
    }
  }, [swiperInstance]);

  const handleSlideChange = (swiper: any) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerViewDesktop}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        breakpoints={{
          1024: { slidesPerView: slidesPerViewDesktop },
          640: { slidesPerView: slidesPerViewTablet },
          0: { slidesPerView: slidesPerViewMobile },
        }}
      >
        {loading
          ? Array.from({ length: slidesPerViewDesktop }).map((_, index) => (
              <SwiperSlide key={index}>
                {renderLoader ? renderLoader(index) : <div className="p-4 bg-gray-200 rounded-md">Loading...</div>}
              </SwiperSlide>
            ))
          : items.map((item, idx) => (
              <SwiperSlide key={idx}>{renderItem(item, idx)}</SwiperSlide>
            ))}
      </Swiper>

      {/* Left arrow */}
      <button
        ref={prevRef}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10
          bg-gray-700 text-white p-3 rounded-full shadow-md transition
          ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
      >
        <FaArrowLeft />
      </button>

      {/* Right arrow */}
      <button
        ref={nextRef}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10
          bg-gray-700 text-white p-3 rounded-full shadow-md transition
          ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
      >
        <FaArrowRight />
      </button>
    </div>
  );
}

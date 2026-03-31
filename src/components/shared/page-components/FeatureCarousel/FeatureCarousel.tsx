'use client';

import images_1 from '@/assets/Cosmetic.png';
import images_2 from '@/assets/Cosmetic2.png';
import images_3 from '@/assets/winterscare.png';
import dynamic from 'next/dynamic';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Dynamically import react-slick
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const Images = [images_1, images_2, images_3];

// Custom Arrow Components
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-gray-700 bg-white rounded-full p-2 shadow hover:bg-gray-200"
    onClick={onClick}
  >
    <FaArrowLeft />
  </div>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-gray-700 bg-white rounded-full p-2 shadow hover:bg-gray-200"
    onClick={onClick}
  >
    <FaArrowRight />
  </div>
);

const FeatureCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false, // autoplay disabled
    speed: 500,
    fade: true,
    cssEase: 'linear',
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // below large screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
        },
      },
      {
        breakpoint: 768, // below medium screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
        },
      },
      {
        breakpoint: 480, // below small screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
        },
      },
    ],
  };

  return (
    <div className="w-full relative">
      <Slider {...settings}>
        {Images.map((image, index) => (
          <div key={index} className="flex justify-center px-2">
            <Image
              src={image}
              alt={`feature_${index + 1}`}
              className="w-full max-w-[400px] h-auto object-cover shadow-md rounded-lg"
              priority
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeatureCarousel;

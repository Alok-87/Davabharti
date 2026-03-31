'use client';

import React from 'react';
import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Feature {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
}

interface WhyChooseUsCarouselProps {
  features: Feature[];
}

const NextArrow = ({ onClick }: any) => (
  <div
    className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 cursor-pointer text-gray-900 bg-white p-2 rounded-full shadow"
    onClick={onClick}
  >
    <FaArrowRight />
  </div>
);

const PrevArrow = ({ onClick }: any) => (
  <div
    className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10 cursor-pointer text-gray-900 bg-white p-2 rounded-full shadow"
    onClick={onClick}
  >
    <FaArrowLeft />
  </div>
);

const WhyChooseUsCarousel: React.FC<WhyChooseUsCarouselProps> = ({ features }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="md:hidden px-4 mt-5">
      <Slider {...settings} className="flex justify-center">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center justify-center text-center px-4">
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-full ${feature.color} flex justify-center items-center ml-35`}
            >
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="mt-4 text-lg font-bold text-gray-900">{feature.title}</h3>

            {/* Description */}
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default WhyChooseUsCarousel;

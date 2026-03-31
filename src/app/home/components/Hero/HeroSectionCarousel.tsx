import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { HomePageResponse } from '@/features/homepage/homepage';

const Slider = dynamic(() => import('react-slick'), { ssr: false });

const HeroSectionCarousel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { loading, data } = useAppSelector((state) => state.homepageData);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: 'linear',
  };

  if (loading || !data || !data.heroSection) {
    return null; // Or a loading skeleton
  }

  const { desktopImages, mobileImages } = data.heroSection;
  const images = isMobile ? mobileImages : desktopImages;

  return (
    <div className="w-full max-w-[100vw] overflow-hidden  lg:px-0 relative">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="w-full">
            <img
              src={image}
              width={1200}
              height={500}
              alt={`hero_${index + 1}`}
              className="w-full h-[180px] sm:h-[280px]"
              priority
            />
          </div>
        ))}
      </Slider>
      <style jsx global>{`
        .slick-dots {
          bottom: 20px !important;
          z-index: 10;
        }
        .slick-dots li {
          margin: 0 5px;
        }
        .slick-dots li button {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          background: rgba(255, 255, 255, 0.5) !important;
          border: 2px solid white !important;
        }
        .slick-dots li button:before {
          display: none !important;
        }
        .slick-dots li.slick-active button {
          background: white !important;
        }
      `}</style>
    </div>
  );
};

export default HeroSectionCarousel;

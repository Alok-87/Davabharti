'use client';
import banner_1 from '@/assets/banner_1.png';
import banner_2 from '@/assets/banner_2.png';
import banner_3 from '@/assets/banner_3.png';
import banner_4 from '@/assets/banner_4.png';
import banner_5 from '@/assets/banner_5.png';
import dynamic from 'next/dynamic';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

// Dynamically import react-slick
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const Images = [banner_1, banner_2, banner_3, banner_4, banner_5];

const HeroSectionCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: 'linear',
  };

  return (
    <div className="w-full max-w-[100vw] overflow-hidden md:px-6 lg:px-0">
      <Slider {...settings}>
        {Images.map((image, index) => (
          <div key={index} className="w-full">
            <Image
              src={image}
              alt={`hero_${index + 1}`}
              className="w-full h-[180px] sm:h-[280px]  "
              priority
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSectionCarousel;

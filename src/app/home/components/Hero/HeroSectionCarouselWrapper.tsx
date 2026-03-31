'use client';
import dynamic from 'next/dynamic';

const HeroSectionCarousel = dynamic(() => import('./HeroSectionCarousel'), {
  ssr: false,
});

const HeroSectionCarouselWrapper = () => {
  return <HeroSectionCarousel />;
};

export default HeroSectionCarouselWrapper;

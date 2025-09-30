import Image from 'next/image';
import hero_1 from '@/assets/hero_1.png';
import HeroSectionCarouselWrapper from './HeroSectionCarouselWrapper';

const HeroSection = () => {
  return (
    <div className="w-full relative">
      {/* ✅ Always SSR a single static image for SEO */}
      <div className="sr-only">
        <Image src={hero_1} alt="Hero Banner" width={1200} height={500} priority />
      </div>

      {/* ✅ Client-only carousel (all screen sizes) */}
      <HeroSectionCarouselWrapper />
    </div>
  );
};

export default HeroSection;

import React from 'react';
import images_1 from '@/assets/Cosmetic.png';
import images_2 from '@/assets/Cosmetic2.png';
import images_3 from '@/assets/winterscare.png';
import Image from 'next/image';
import FeatureCarousel from '@/components/shared/page-components/FeatureCarousel/FeatureCarousel';

const Images = [images_1, images_2, images_3];

const FeatureCards = () => {
  return (
    <>
      <div className=" hidden md:flex items-center justify-center max-w-8xl gap-5 px-20 mt-10">
        {Images.map((image, index) => (
          <Image key={index} src={image} alt="cards" className="rounded-md shadow-md" />
        ))}
      </div>

      <div className=" w-full md:hidden sm:block px-2 mt-10">
        <FeatureCarousel />
      </div>
    </>
  );
};

export default FeatureCards;

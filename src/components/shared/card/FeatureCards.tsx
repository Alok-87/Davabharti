import React from 'react';
import images_1 from '@/assets/Cosmetic.png';
import images_2 from '@/assets/Cosmetic2.png';
import images_3 from '@/assets/winterscare.png';
import Image from 'next/image';
import Link from 'next/link';
import FeatureCarousel from '@/components/shared/page-components/FeatureCarousel/FeatureCarousel';

const Images = [
  { image: images_1, link: '/medicines?categoryIds=a6ee9407-ea36-43fb-b4bd-bc83edadfb81' }, 
  { image: images_2, link: '/medicines?categoryIds=5d5abc58-7438-460a-b942-1786eca80bd8' }, 
  { image: images_3, link: '/medicines?categoryIds=2ae617c1-8add-4f44-9225-576ff19d2835' }
];

const FeatureCards = () => {
  return (
    <>
      <div className=" hidden md:flex items-center justify-center max-w-8xl gap-5 px-20 mt-10">
        {Images.map((item, index) => (
          <Link key={index} href={item.link} className="block">
            <Image 
              src={item.image} 
              alt="cards" 
              className="rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
            />
          </Link>
        ))}
      </div>

      <div className=" w-full md:hidden sm:block px-2 mt-10">
        <FeatureCarousel />
      </div>
    </>
  );
};

export default FeatureCards;

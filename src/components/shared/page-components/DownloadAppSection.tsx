'use client';

import Image from 'next/image';
import mobile from '@/assets/mobile.png';
import mobile_2 from '@/assets/mobile_2.png';
import apple_store from '@/assets/apple_store.png';
import google_play from '@/assets/google_play.png';
import iphone from '@/assets/iphone.png'

const storeLinks = [
  {
    src: apple_store,
    alt: 'Download on the Apple App Store',
    href: 'https://apps.apple.com/us/developer/davabharti-health-care-private-limited/id1666771481', // Replace with your actual Apple Store link
  },
  {
    src: google_play,
    alt: 'Get it on Google Play',
    href: 'https://play.google.com/store/apps/details?id=com.davaBharti&hl=en', // Replace with your actual Google Play link
  },
];

const AppDownloadSection = () => {
  return (
    <section className="w-full py-10 overflow-hidden bg-[#a4c2ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        {/* Flex wrapper */}
        <div className="flex flex-col relative lg:flex-row items-center justify-between gap-10">
          {/* Left Phone Image */}
          <div className="w-full lg:w-1/3 flex justify-center">
            {/* Replace with your image */}
            <Image
              src={iphone}
              alt="App preview left"
              className="hidden lg:block absolute -bottom-[300px] w-24 sm:w-72 lg:w-72 object-contain"
            />
          </div>

          {/* Center Text */}
          <div className="flex flex-col text-center lg:text-left flex-1">
            <h2 className="text-2xl  font-bold text-black">
              Download the App for <span className="text-primary">FREE!</span>
            </h2>
            <div className="w-11/12 h-[2px] bg-black mx-auto lg:mx-0 my-4"></div>

            <p className="text-black text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
              Carry this platform in your pocket with Dava Bharti app! Explore the offers and
              thousands of products for the need of your health.
            </p>
            {/* Store Buttons */}

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
              {storeLinks.map((store, index) => (
                <a
                  key={index}
                  href={store.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <Image
                    src={store.src}
                    alt={store.alt}
                    className="w-36 cursor-pointer rounded-md"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right Phone Image */}
          <div className="w-full lg:w-1/3 flex justify-center">
            {/* Replace with your image */}
            <Image
              src={iphone}
              alt="App preview left"
              className="hidden lg:block  -mt-[280px] w-24 sm:w-72 lg:w-72 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;

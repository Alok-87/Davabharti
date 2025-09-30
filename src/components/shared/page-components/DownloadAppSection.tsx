import React from 'react';
import Image from 'next/image';

// Sample images (replace with your real ones)
import mobileMockup from '@/assets/daunload_app.png';
import googlePlay from '@/assets/google_play.png';
import appStore from '@/assets/apple_store.png';

const Icons = [googlePlay, appStore];

const DownloadAppSection = () => {
  return (
    <section className="w-full bg-primary pt-3">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-5">
        {/* Left Text Section */}
        <div className="flex flex-col text-center lg:text-left flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Download the App for <span className="text-yellow-300">FREE!</span>
          </h2>
          <div className="max-w-7/12 h-[2px] bg-white mx-auto lg:mx-0 my-4"></div>
          <p className="text-white text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
            Carry this platform in your pocket with Dava Bharti app! Explore the offers and
            thousands of products for the need of your health.
          </p>
          {/* Store Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
            {Icons.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Store Button ${index}`}
                className=" w-40 cursor-pointer rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Right Mobile Image */}
        <div className="  ">
          <Image src={mobileMockup} alt="Mobile App" className="" />
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;

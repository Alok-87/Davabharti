'use client';
import React from 'react';
import Image from 'next/image';
import family_2 from '@/assets/family_2.png';

const Membership = () => {
  return (
    <div className="w-full md:px-20 px-3 sm:px-5  ">
      <div className="flex flex-col md:flex-row items-center justify-evenly bg-gradient-to-r rounded-md from-blue-500 to-indigo-400 text-center md:text-left ">
        {/* Left Content */}
        <div className="flex-col mt-6 md:mt-0">
          <p className="text-white text-2xl">Become a member</p>
          <p className="text-gray-200">And enjoy extra bachat on every order</p>
          <div className="h-[2px] w-40 bg-gradient-to-r from-yellow-400 to-transparent mt-3 mb-5 mx-auto md:mx-0"></div>
        </div>

        {/* Middle Content */}
        <div className="flex-col text-white mt-6 md:mt-0 max-w-lg">
          <p>
            Save 5% on medicines, 50% on 1st lab test & get FREE delivery with PLUS membership Know
            more
          </p>
          <button className="mt-6 bg-primary text-white font-semibold px-6 py-3 rounded-md flex items-center gap-2 cursor-pointer transition mx-auto md:mx-0">
            Explore Now
          </button>
        </div>

        {/* Right Image */}
        <div className="mt-6 md:mt-0">
          <Image src={family_2} alt="Family" className="w-auto h-48  object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Membership;

'use client';
import { FaRegUser } from 'react-icons/fa';
import { IoLocation, IoCartOutline } from 'react-icons/io5';
import { MdOutlineMyLocation } from 'react-icons/md';
import { CiDiscount1 } from 'react-icons/ci';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import { FiSearch } from 'react-icons/fi';

const MainNavbar = () => {
  return (
    <div className="w-full border-b border-gray-200 bg-white text-black">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-5 px-4 sm:px-6 lg:px-8 py-3 relative">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Image src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />

          {/* Divider - hide on mobile */}
          <div className="hidden sm:block w-px h-8 bg-gray-300" />

          {/* Delivery Info - hide on mobile */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
            <IoLocation className="text-gray-600 cursor-pointer" />
            <input
              type="text"
              className="flex-1 min-w-[120px] outline-none bg-transparent text-sm placeholder-gray-500"
              placeholder="Enter location"
            />
            <MdOutlineMyLocation className="text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Search bar - center (hide on mobile) */}
        <div className="hidden sm:flex flex-1 items-center max-w-md gap-2 bg-gray-100 px-3 py-2 rounded-md">
          <input
            type="text"
            className="flex-1 outline-none bg-transparent text-sm placeholder-gray-500"
            placeholder="Search for Medicine"
          />
          <FiSearch className="cursor-pointer text-gray-600" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6 text-sm sm:text-base">
          {/* Profile */}
          <a href="#" className="flex items-center gap-1 hover:text-blue-600">
            <FaRegUser className="text-lg sm:text-xl text-gray-700" />
            <span className="hidden sm:inline">Hello, Log in</span>
            <span className="hidden sm:inline ml-1 w-2 h-2 rounded-full bg-pink-400"></span>
          </a>

          {/* Cart */}
          <a href="#" className="flex items-center gap-1 hover:text-blue-600">
            <IoCartOutline className="text-lg sm:text-xl" />
            <span className="hidden sm:inline">Cart</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;

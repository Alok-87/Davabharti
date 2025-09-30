'use client'
import React, { useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoLocation, IoCartOutline } from 'react-icons/io5';
import { MdOutlineMyLocation } from 'react-icons/md';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowDown, IoIosClose } from 'react-icons/io';
import Link from 'next/link';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Category data with dropdown items
  const categories = [
    {
      name: "Health Resource Center",
      items: ["All Diseases", "All Medicines", "Medicines by Therapeutic Class"]
    },
    {
      name: "Hair Care",
      items: ["Shampoos", "Hair Oils", "Hair Serums", "Dandruff Treatments"]
    },
    {
      name: "Fitness & Health",
      items: ["Protein Supplements", "Fitness Equipment", "Health Monitors"]
    },
    {
      name: "Sexual Wellness",
      items: ["Contraceptives", "Supplements", "Personal Care"]
    },
    {
      name: "Vitamins & Nutrition",
      items: ["Multivitamins", "Vitamin C", "Vitamin D", "Mineral Supplements"]
    },
    {
      name: "Supports & Braces",
      items: ["Knee Supports", "Back Braces", "Wrist Supports"]
    },
    {
      name: "Immunity Boosters",
      items: ["Ayurvedic Immunity", "Vitamin C Supplements", "Herbal Tonics"]
    },
    {
      name: "Homeopathy",
      items: ["Common Remedies", "Specialty Medicines", "Consultation"]
    },
  ];

  const serviceMenuItems = [
    "Medicine",
    "Healthcare",
    "Healthcare",
    "Doctor Consult",
    "Lab Test",
    "Health Insights",
    "Offers"
  ];

  return (
    <header>
      {/* Top Navbar - Always visible */}
      <div className="w-full bg-primary text-white">
        <div className="max-w-8xl mx-auto items-center justify-center px-3 sm:px-6 py-2 gap-2 sm:gap-0">
          <h3 className="text-center font-medium text-sm sm:text-base">
            * Cold Storage Products Will Be Deliverable All Over India*
          </h3>
        </div>
      </div>

      {/* Mobile Header - Always visible search bar */}
      <div className="w-full bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between p-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
            aria-label="Open menu"
          >
            {isMenuOpen ? (
              <IoIosClose className="w-6 h-6" />
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 17 14" xmlns="http://www.w3.org/2000/svg">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Image src={logo} alt="Logo" className="h-8 w-auto" />

          {/* Login and Cart */}
          <div className="flex items-center gap-4">
           <Link href="#" className="flex items-center gap-1 hover:text-blue-600">
              <FaRegUser className="text-xl text-gray-700" />
            </Link> 
            <a href="#" className="flex items-center gap-1 hover:text-blue-600">
              <IoCartOutline className="text-xl" />
            </a>
          </div>
        </div>

        {/* Mobile Search Bar - Always visible on mobile */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
            <FiSearch className="text-gray-600" />
            <input
              type="text"
              className="flex-1 outline-none bg-transparent text-sm placeholder-gray-500"
              placeholder="Search for Medicine"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slides in from side */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden mt-32 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Location Section */}
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-md">
              <IoLocation className="text-gray-600" />
              <input
                type="text"
                className="flex-1 outline-none bg-transparent text-sm placeholder-gray-500"
                placeholder="Enter location"
              />
              <MdOutlineMyLocation className="text-gray-600" />
            </div>

            {/* Service Menu Items */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
              <ul className="space-y-2">
                {serviceMenuItems.map((item, index) => (
                  <li key={index} className="py-2 px-3 text-gray-700 border-b border-gray-100">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories Section with Dropdowns */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index} className="text-gray-700 border-b border-gray-100">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="w-full py-2 px-3 flex justify-between items-center hover:bg-gray-50"
                    >
                      {category.name}
                      <IoIosArrowDown className={`h-4 w-4 text-gray-400 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === index && (
                      <ul className="ml-4 bg-gray-50 rounded-md mt-1">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="py-2 px-3 text-gray-600 border-b border-gray-100 last:border-b-0">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden md:block">
        {/* ServiceNavbar */}
        <div className="w-full bg-white border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-center mx-auto max-w-screen-xl p-4">
            <div className="items-center justify-center font-medium w-full md:flex md:w-auto md:order-1">
              <ul className="flex items-center gap-8 font-medium">
                {serviceMenuItems.map((item, index) => (
                  <li key={index} className="block py-2 px-3 cursor-pointer text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* MainNavbar*/}
        <div className="w-full border-b border-gray-200 bg-white text-black">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-5 px-4 sm:px-6 lg:px-8 py-3 relative">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Image src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
              <div className="hidden sm:block w-px h-8 bg-gray-300" />
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

            {/* Search bar */}
            <div className="flex flex-1 items-center max-w-md gap-2 bg-gray-100 px-3 py-2 rounded-md">
              <input
                type="text"
                className="flex-1 outline-none bg-transparent text-sm placeholder-gray-500"
                placeholder="Search for Medicine"
              />
              <FiSearch className="cursor-pointer text-gray-600" />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6 text-sm sm:text-base">
              <a href="#" className="flex items-center gap-1 hover:text-blue-600">
                <FaRegUser className="text-lg sm:text-xl text-gray-700" />
                <span className="hidden sm:inline">Hello, Log in</span>
                <span className="hidden sm:inline ml-1 w-2 h-2 rounded-full bg-pink-400"></span>
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-blue-600">
                <IoCartOutline className="text-lg sm:text-xl" />
                <span className="hidden sm:inline">Cart</span>
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Categories Navbar */}
        <div className="hidden md:block bg-white border-b shadow-sm ">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-start space-x-6">
              {categories.map((category, index) => (
                <div key={index} className="relative group py-4 flex-shrink-0">
                  {/* Category Name */}
                  <div className="flex items-center text-gray-800 font-medium text-sm gap-1 whitespace-nowrap cursor-pointer hover:text-blue-600">
                    {category.name} <IoIosArrowDown className="h-3 w-3" />
                  </div>

                  {/* Dropdown Content BELOW category */}
                  <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-56 py-2 z-50 border border-gray-200">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </header>
  );
}

export default Header;
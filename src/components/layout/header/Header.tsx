

'use client';
import React, { useState, useEffect } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import { IoIosClose } from 'react-icons/io';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hook/useAuth';
import AccountSidebar from './components/AccountSidebar';
import TopNavbar from './components/TopNavbar';
import BottomNavBarDesktop from './components/BottomNavBarDesktop';
import SearchBar from './components/SearchBar';
import { useAppSelector } from '@/store/hooks';
import { fetchCart } from '@/features/cart/cartThunks';
import { setToken, getToken } from '@/features/auth/utils/tokenManager';
import LocationBox from './components/LocationBox';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useDispatch } from 'react-redux';
import { useAuthModal } from '@/hooks/useAuthModal';
import { setShowSidebarOpen } from '@/features/user-profile/userProfileSlice';
import BottomNavBarMobile from './components/BottomNavBarMobile';
import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import ToolTip from '@/components/ui/ToolTip';
//import { usePathname } from 'next/navigation';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { carts } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const { user, restore } = useAuth();
  const { openLogin, openSignup } = useAuthModal();

  const showSidebarOpen = useAppSelector((state) => state.userProfile.showSidebarOpen);

  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      setToken(token);
      restore();
      dispatch(fetchCart());
    }
  }, [user, restore]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (index: any) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // ✅ Handle Order Now click with auth check
  const handleQuickOrderClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openLogin('/select-prescription'); // Pass the intended destination
    }
    // If user is logged in, the normal Link behavior will work
  };

  // ✅ Handle Cart click with auth check
  const handleCartClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openLogin('/cart'); // Pass the intended destination
    }
    // If user is logged in, the normal Link behavior will work
  };

  // Category data with dropdown items
  const categories = [
    {
      name: 'Health Resource Center',
      items: [
        { id: 1, name: 'All Diseases', href: '/comming-soon' },
        { id: 2, name: 'All Medicines', href: '/medicines' },
        { id: 3, name: 'Medicines by Therapeutic Class', href: '/medicines' },
      ],
    },
    // ... rest of your categories
  ];

  const serviceMenuItems = [
    {
      name: 'Medicines',
      href: '/',
    },
    {
      name: 'Diagnostics',
      href: '/diagnostics',
    },
    {
      name: 'Doctors',
      href: '/doctors',
    },
    {
      name: 'Health Insight ',
      href: '/healthInsight',
    },
    {
      name: 'Become a Partner',
      href: '/becomeapartner',
    },
  ];

  // current pathname to drive active styles
  const pathname = usePathname();

  return (
    <>
      {/* Top Navbar - Always visible */}
      <TopNavbar />

      {/* Mobile Header - Always visible search bar */}
      <div className="w-full bg-white border-b border-gray-200 xl:hidden  sticky top-0 z-30">
        <header>
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
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 17 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              )}
            </button>

            {/* Logo */}
            <Link href="/">
              <Image src={logo} alt="Logo" className="h-8 w-auto cursor-pointer" />
            </Link>

            {/* Login and Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => dispatch(setShowSidebarOpen(true))}
                  >
                    <AccountSidebar />
                  </div>
                ) : (
                  <button onClick={() => openLogin()}>
                    <div className="flex items-center gap-2">
                      <FaRegUser className="text-xl text-gray-700" />
                      <span className="text-sm text-gray-700">Login</span>
                    </div>
                  </button>
                )}
              </div>

              {/* ✅ Updated Cart with auth check */}
              {user ? (
                <Link href="/cart" className="flex items-center gap-1 hover:text-blue-600 relative">
                  <div className="relative">
                    <IoCartOutline className="text-xl" />
                    {carts.map((cart) => cart.items.length).reduce((a, b) => a + b, 0) > 0 ? (
                      <span className="absolute -top-3 -right-3 sm:-top-5 sm:right-0 bg-primary text-white text-[10px] sm:text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                        {carts.map((cart) => cart.items.length).reduce((a, b) => a + b, 0)}
                      </span>
                    ) : null}
                  </div>
                </Link>
              ) : (
                <button
                  onClick={handleCartClick}
                  className="flex items-center gap-1 hover:text-blue-600 relative"
                >
                  <div className="relative">
                    <IoCartOutline className="text-xl" />
                    {carts?.map((cart) => cart.items.length).reduce((a, b) => a + b, 0) > 0 ? (
                      <span className="absolute top-4 right-1 sm:-top-5 sm:right-0 bg-primary text-white text-[10px] sm:text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                        {carts.map((cart) => cart.items.length).reduce((a, b) => a + b, 0)}
                      </span>
                    ) : null}
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Bar - Always visible on mobile */}
          <div className="px-4 pb-4">
            <SearchBar />
          </div>
        </header>
      </div>

      {/* Mobile Menu - Slides in from side */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white xl:hidden  overflow-y-auto">
          {/* Logo */}
          <Link href="/" className="flex justify-center pt-5">
            <Image src={logo} alt="Logo" className="h-8 w-auto cursor-pointer" />
          </Link>
          <div className="flex justify-end p-4 absolute z-50 right-0 top-1 ">
            <IoIosClose
              className="w-8 h-8 text-gray-700  transition-transform hover:rotate-90"
              onClick={toggleMenu}
            />
          </div>
          <div className="p-4 space-y-6">
            {/* Location Section */}
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition">
              <LocationBox />
            </div>


            {/* Service Menu Items */}
            <div>
              <h3 className="font-semibold text-gray-900 ">Services</h3>
              <ul className="space-y-2">
                {serviceMenuItems.map((item, index) => (
                  <li
                    key={index}
                    className={`py-2 px-3 border-b border-gray-100 ${item.name === 'Medicines' && pathname === '/' ? 'text-primary font-semibold' : 'text-gray-700'}`}
                  >
                    <Link href={item.href} onClick={() => setIsMenuOpen(false)}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Now Button in Mobile Menu */}
            <div className="pt-4">
              {user ? (
                <Link
                  href="/select-prescription"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-4 py-3 rounded-md shadow-sm hover:shadow-md hover:opacity-95 transition w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⚡ Order Now
                </Link>
              ) : (
                <button
                  onClick={(e) => {
                    handleQuickOrderClick(e);
                    setIsMenuOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-4 py-3 rounded-md shadow-sm hover:shadow-md hover:opacity-95 transition w-full"
                >
                  ⚡ Order Now
                </button>
              )}
            </div>

            <BottomNavBarMobile />
          </div>
        </div>
      )}

      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden xl:block sticky top-0 z-30">
        <header>
          {/* Service Navbar */}
          <div className="w-full bg-white border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-10 mx-auto max-w-screen-xl px-4 py-3">
              {/* Left Section - Service Menu Items */}
              <div className="items-center justify-center font-medium w-full md:flex md:w-auto">
                <Link href="/">
                  <Home className="mr-8" />
                </Link>

                <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-medium">
                  {serviceMenuItems.map((item, index) => {
                    const tooltipId = `tooltip-${index}`;
                    const isActive =
                      pathname === item.href || pathname.startsWith(`${item.href}/`);

                    // 👇 Check if this is "Become a Partner"
                    if (item.name === "Become a Partner") {
                      return (
                        <li
                          key={index}
                          className="relative group text-sm sm:text-base px-2 sm:px-3 cursor-pointer"
                        >
                          {/* Main Heading */}
                          <span
                            className={`transition-colors ${isActive
                                ? "text-primary font-semibold"
                                : "text-gray-900 hover:text-primary"
                              }`}
                          >
                            {item.name}
                          </span>

                          {/* Dropdown */}
                          <ul className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <li>
                              <Link
                                href="/becomeapartner"
                                className="block px-4 py-2 hover:bg-gray-100"
                              >
                                Vendor
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/becomeapartner(doctor)"
                                className="block px-4 py-2 hover:bg-gray-100"
                              >
                                Doctor
                              </Link>
                            </li>
                          </ul>
                        </li>
                      );
                    }

                    // 👇 Normal items
                    return (
                      <li
                        key={index}
                        className={`block text-sm sm:text-base px-2 sm:px-3 cursor-pointer rounded-sm transition-colors ${isActive
                            ? "text-primary font-semibold"
                            : "text-gray-900 hover:text-primary"
                          }`}
                      >
                        <Link
                          href={item.href}
                          data-tooltip-id={tooltipId}
                          data-tooltip-content={`Go to ${item.name}`}
                        >
                          {item.name}
                        </Link>

                        <ToolTip id={tooltipId} content={`Go to ${item.name}`} />
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right Section - Order Now Button */}
              <div className="hidden xl:flex">
                {user ? (
                  <Link
                    href="/select-prescription"
                    className="inline-flex items-center gap-2 bg-primary text-white text-sm sm:text-base font-medium px-4 sm:px-3 py-2 rounded-md shadow-sm hover:shadow-md hover:opacity-95 transition"
                  >
                    ⚡ Order Now
                  </Link>
                ) : (
                  <button
                    onClick={handleQuickOrderClick}
                    className="inline-flex items-center gap-2 bg-primary text-white text-sm sm:text-base font-medium px-4 sm:px-3 py-2 rounded-md shadow-sm hover:shadow-md hover:opacity-95 transition"
                  >
                    ⚡ Order Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* MainNavbar*/}
          <div className="w-full border-b border-gray-200 bg-white text-black">
            <div className="max-w-8xl mx-auto flex items-center justify-between gap-5 px-4 sm:px-6 xl:px-20 py-3 relative">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Image src={logo} alt="Logo" className="h-16 sm:h-14 w-auto cursor-pointer" />
                </Link>
                <div className="hidden sm:block w-px h-8 bg-gray-300" />
                <div className="hidden sm:flex w-[240px] flex-shrink-0">
                  <LocationBox />
                </div>
              </div>

              {/* Search bar */}
              <div className="flex flex-1 items-center">
                <SearchBar />
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-6 text-sm sm:text-base">
                {/* 👤 User Section */}
                {user ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => dispatch(setShowSidebarOpen(true))}
                  >
                    <AccountSidebar />
                  </div>
                ) : (
                  <button onClick={() => openLogin()}>
                    <div className="flex items-center gap-2">
                      <FaRegUser className="text-xl text-gray-700" />
                      <span className="text-sm text-gray-700">Login</span>
                    </div>
                  </button>
                )}

                {/* 🛒 Cart Section */}
                {user ? (
                  <Link href="/cart" className="flex items-center gap-1 hover:text-blue-600 relative">
                    <div className="relative">
                      <IoCartOutline className="text-xl sm:text-3xl" />
                      {carts?.map((cart) => cart.items.length).reduce((a, b) => a + b, 0) > 0 ? (
                        <span className="absolute -top-1 -right-2 sm:-top-1.5 sm:-right-2.5 bg-primary text-white text-[10px] sm:text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                          {carts.map((cart) => cart.items.length).reduce((a, b) => a + b, 0)}
                        </span>
                      ) : null}
                    </div>
                    <span className="hidden sm:inline">Cart</span>
                  </Link>
                ) : (
                  <button
                    onClick={handleCartClick}
                    className="flex items-center gap-1 hover:text-blue-600 relative"
                  >
                    <div className="relative">
                      <IoCartOutline className="text-xl sm:text-3xl" />
                      {carts?.map((cart) => cart.items.length).reduce((a, b) => a + b, 0) > 0 ? (
                        <span className="absolute -top-1 -right-2 sm:-top-1.5 sm:-right-2.5 bg-primary text-white text-[10px] sm:text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                          {carts.map((cart) => cart.items.length).reduce((a, b) => a + b, 0)}
                        </span>
                      ) : null}
                    </div>
                    <span className="hidden sm:inline">Cart</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Desktop Categories Navbar */}
      <div className="hidden xl:block">
        <BottomNavBarDesktop />
      </div>
    </>
  );
}

export default Header;

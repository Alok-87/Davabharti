'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react'; // icon for close button

export default function TopNavbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  // Show only on homepage
  if (pathname !== '/' || !visible) return null;

  return (
    <div className="relative w-full bg-primary text-white overflow-hidden pr-10">
      <div className=" mx-auto  py-2 flex items-center justify-center">
        {/* Scrolling Text */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-center">
            <span className="mx-3 text-sm sm:text-base font-medium">
              {/* 🎉 Exclusive Online Offer: Get Upto 10% Off + Extra 15% Savings on Medicines &
              Healthcare Products 🎁 */}
              We’ve recently updated our website to a new version. You may experience some temporary issues or unexpected
               behavior while we finalize improvements. We sincerely apologize for any issues this may cause. — The Entire Davabharti Team
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition cursor-pointer"
          aria-label="Close offer banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

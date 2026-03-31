'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaUserCog,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import { FaClipboardList, FaUserGroup } from 'react-icons/fa6';
import { HiChevronRight } from 'react-icons/hi';
import { FaBars, FaTimes,FaWallet ,FaBusinessTime} from 'react-icons/fa';
import { useAuth } from '@/features/auth/hook/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { clearCart, refreshCart } from '@/features/cart/cartSlice';

export default function UserSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const menuItems = [
    { icon: <FaUserCog />, label: 'Manage Profiles', href: '/user' },
    { icon: <FaBoxOpen />, label: 'My Orders', href: '/user/orders' },
    { icon: <FaBusinessTime />, label: 'My Appointments', href: '/user/appointments' },
    { icon: <FaWallet />, label: 'My Wallet', href: '/user/wallet' },
    { icon: <FaUserGroup />, label: 'Patient', href: '/user/pacient' },
    { icon: <FaMapMarkerAlt />, label: 'Address Book', href: '/user/addresses' },
    { icon: <FaClipboardList />, label: 'Prescription', href: '/user/prescription' },
  ];

  const logOutHandler = async () => {
    await logout();
    dispatch(clearCart());
    router.replace('/');
    router.refresh();
  };


  return (
    <>
      {/* Header for mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b">
        <button onClick={() => setIsOpen(true)} className="text-2xl text-gray-700">
          <FaBars />
        </button>
        <h2 className="font-semibold text-base text-gray-800">My Account</h2>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-64 md:w-72 bg-white border-r shadow-md lg:shadow-none z-50 rounded-r-2xl rounded-l-2xl
        transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h3 className="font-semibold text-gray-800">Menu</h3>
          <button onClick={() => setIsOpen(false)} className="text-2xl text-gray-700">
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Items */}
        <div className="p-4 space-y-3">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition shadow-sm hover:shadow-md
                ${active
                    ? 'bg-[#E8F1FF] border-[#20539F] text-[#20539F]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#20539F]/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${active ? 'text-[#20539F]' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <HiChevronRight className={`${active ? 'text-[#20539F]' : 'text-gray-400'}`} />
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={logOutHandler}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-red-200 text-red-600 bg-white hover:bg-red-50 transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </div>
            <HiChevronRight />
          </button>
        </div>
      </aside>
    </>
  );
}

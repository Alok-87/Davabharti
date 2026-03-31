'use client';

import { useState, useRef, useEffect } from 'react';
import {
  FaRegUser,
  FaUserCircle,
  FaShoppingBag,
  FaMapMarkedAlt,
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserAlt,
  FaPills,
  FaWallet,
  FaBusinessTime,
} from 'react-icons/fa';
import { IoPersonAdd } from "react-icons/io5";
import { IoClose } from 'react-icons/io5';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hook/useAuth';
import { FaHospitalUser } from 'react-icons/fa6';
import { FaClipboardList } from 'react-icons/fa6';
import { clearToken } from '@/features/auth/utils/tokenManager';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { clearCart, refreshCart } from '@/features/cart/cartSlice';

export default function AccountSidebar() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch()

  // ✅ Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);
  const logOutHandler = async () => {
    await logout();
    dispatch(clearCart());
    router.replace('/');
    router.refresh();
  };

  const handleNameClick = () => {
    router.push('/user');
    setOpen(false);
  }

  return (
    <>
      {/* 🧍 Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center text-gray-700 hover:text-blue-600 transition cursor-pointer"
      >
        <FaRegUser className="text-xl sm:text-2xl" />
        <span>{user?.name?.split(' ')[0]}</span>
      </button>

      {/* 🩶 Overlay (behind sidebar, clickable to close) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 📱 Sidebar Drawer */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaUserCircle className="w-10 h-10 text-gray-700" onClick={() => handleNameClick()} />
            <div>
              <p className="font-semibold text-gray-800" onClick={() => handleNameClick()}>{user?.name ?? 'user'}</p>
              <p className="text-sm text-gray-500">{user?.email ?? 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Close sidebar"
          >
            <IoClose className="text-2xl text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex flex-col justify-between h-[calc(100%-4rem)] overflow-y-auto">
          {/* Links */}
          <div className="p-5 space-y-2">
            <Link
              href="/user"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <FaUserAlt className="text-gray-500" /> My Profile
            </Link>

            <Link
              href="/user/orders"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <FaShoppingBag className="text-gray-500" /> Orders
            </Link>

             <Link
              href="/user/appointments"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <FaBusinessTime className="text-gray-500" /> My Appointmets
            </Link>

             <Link
              href="/user/wallet"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <FaWallet className="text-gray-500" /> My Wallet
            </Link>

            <Link
              href="/refer"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <IoPersonAdd className="text-gray-500" /> Referral
            </Link>

            <Link
              href="/user/pacient"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <FaHospitalUser className="text-gray-500" /> Patient
            </Link>

            <Link
              href="/user/addresses"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <FaMapMarkedAlt className="text-gray-500" /> Addresses Book
            </Link>

            <Link
              href="/user/prescription"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <FaClipboardList className="text-gray-500" /> Prescription
            </Link>
            <Link
              href="/Inquiry/medicine-request/list"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <FaPills className="text-gray-500" /> Medicine Request

            </Link>
            <Link
              href="/Inquiry/query/list"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              <FaQuestionCircle className="text-gray-500" /> My Inquiry
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 p-5">
            <button
              type="button"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-md text-red-500 font-semibold hover:bg-red-50 transition"
              onClick={logOutHandler}
            >
              <FaSignOutAlt className="text-lg" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

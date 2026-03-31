"use client";
import React, { useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";

type InfoPopupProps = {
  title: string;
  description: string;
};

export default function InfoPopup({ title, description }: InfoPopupProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* INFO ICON */}
      <button
        type="button"
        onClick={() => setOpen(!open)}                 // ✅ Mobile / Tablet
        onMouseEnter={() => setOpen(true)}             // ✅ Laptop
        onMouseLeave={() => setOpen(false)}            // ✅ Laptop
        className="text-gray-500 hover:text-primary"
      >
        <IoInformationCircleOutline size={20} />
      </button>

      {/* POPUP */}
      {open && (
        <div
          className="
            absolute z-50 top-7 w-75
            bg-white border rounded-xl shadow-lg p-4 text-sm

            /* 📱 Mobile */
            left-1/2 -translate-x-1/2

            /* 📱 Tablet */
            sm:1/2 sm:translate-x-0 sm:right-0

            /* 💻 Laptop */
            lg:right-0"
        >
          <h4 className="font-semibold text-gray-800 mb-1">
            {title}
          </h4>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}

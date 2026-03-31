import React from "react";
import { HiChevronDown } from "react-icons/hi";
import { LuMessageSquareMore } from "react-icons/lu";

export default function NeedHelpCard() {
  return (
    <div className="w-full  rounded-[24px] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-[#edf1f7]">
      <h3 className="text-[18px] font-bold text-[#111827]">Need Help?</h3>

      <div className="mt-5 flex items-center justify-between rounded-[24px] border border-[#edf1f7] bg-[#fcfcfe] px-3 py-3 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-4">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#eef0ff]">
            <LuMessageSquareMore className="text-[28px] text-primary" />
          </div>

          <div>
            <h4 className="text-[16px] font-semibold leading-none text-[#111827]">
              Talk to Support
            </h4>
            <p className="mt-3 text-[14px] text-[#667085]">
              Mon - Sat (0AM - 8PM)
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f6fb] text-[#4f7cff] transition hover:bg-[#e9eefb]"
        >
          <HiChevronDown className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}
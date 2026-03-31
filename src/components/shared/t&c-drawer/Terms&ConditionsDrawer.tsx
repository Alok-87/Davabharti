'use client';

import { IoClose } from "react-icons/io5";
import DOMPurify from "dompurify";
import { setShowTermsAndConditions } from "@/features/user-profile/userProfileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function TermsAndConditionsDrawer() {
  const dispatch = useAppDispatch();
  const showTermsAndConditions = useAppSelector(
    (state) => state.userProfile.showTermsAndConditions
  );

  if (!showTermsAndConditions) return null;

  const cleanHTML = DOMPurify.sanitize(showTermsAndConditions, {
    ALLOWED_TAGS: ["p", "ul", "ol", "li", "strong", "em", "br"],
    ALLOWED_ATTR: []
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={() => dispatch(setShowTermsAndConditions(null))}
      />

      {/* Drawer */}
      <div className="w-full sm:w-[400px] md:w-[480px] bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Terms and Conditions
          </h3>
          <button
            onClick={() => dispatch(setShowTermsAndConditions(null))}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <IoClose className="text-2xl text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          <div
            className="
              text-sm text-gray-700 leading-relaxed
              [&_ul]:list-disc
              [&_ul]:pl-5
              [&_ul]:space-y-3
              [&_li]:leading-relaxed
              [&_p]:mb-3
            "
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
          />
        </div>
      </div>
    </div>
  );
}

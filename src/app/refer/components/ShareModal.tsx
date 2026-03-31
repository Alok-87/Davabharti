"use client";

import { FiX, FiCopy } from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function SocialShareModal({ open, onClose, shareUrl }) {
  if (!open) return null;

  const encoded = encodeURIComponent(shareUrl);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3">
      
      {/* MODAL BOX */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black cursor-pointer"
        >
          <FiX size={22} />
        </button>

        {/* HEADER */}
        <h2 className="text-xl font-semibold">Invite your friends</h2>
        <p className="text-gray-600 text-sm mt-1">Share the code with:</p>

        {/* ICON GRID */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-8 text-center">

          {/* WHATSAPP */}
          <div
            onClick={() => window.open(`https://wa.me/?text=${encoded}`, "_blank")}
            className="cursor-pointer flex flex-col items-center"
          >
            <FaWhatsapp size={40} className="text-green-500" />
            <p className="text-sm mt-2">WhatsApp</p>
          </div>

          {/* GMAIL */}
          <div
            onClick={() =>
              window.open(`mailto:?subject=Join me&body=${encoded}`)
            }
            className="cursor-pointer flex flex-col items-center"
          >
            <SiGmail size={40} className="text-red-500" />
            <p className="text-sm mt-2">Gmail</p>
          </div>

          {/* COPY LINK */}
          <div onClick={copyLink} className="cursor-pointer flex flex-col items-center">
            <FiCopy size={40} className="text-gray-700" />
            <p className="text-sm mt-2">Copy Link</p>
          </div>

          {/* X / TWITTER */}
          <div
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${encoded}`,
                "_blank"
              )
            }
            className="cursor-pointer flex flex-col items-center"
          >
            <FaTwitter size={40} className="text-blue-400" />
            <p className="text-sm mt-2">X</p>
          </div>

          {/* FACEBOOK */}
          <div
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
                "_blank"
              )
            }
            className="cursor-pointer flex flex-col items-center"
          >
            <FaFacebook size={40} className="text-blue-600" />
            <p className="text-sm mt-2">Facebook</p>
          </div>
        </div>
      </div>
    </div>
  );
}

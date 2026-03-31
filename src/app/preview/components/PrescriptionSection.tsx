'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import validate_rx from '@/assets/validate_rx.png';

interface PrescriptionPreviewProps {
  prescription: {
    id: number;
    imageUrl: string;
  };
}

export default function PrescriptionPreview({ prescription }: PrescriptionPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-gray-800 text-base sm:text-lg font-semibold mb-3">Prescription</h3>

        <div
          className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => setIsOpen(true)}
        >
          <Image src={validate_rx} alt="Prescription" fill className="object-contain" />
        </div>
      </div>

      {/* Full Screen Image Viewer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)} // background closes modal
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering background close
              setIsOpen(false);
            }}
            className="absolute top-5 right-5 z-50 text-white text-3xl hover:text-gray-300 transition cursor-pointer"
          >
            <IoClose />
          </button>

          {/* Image Container (stop background close on click inside) */}
          <div
            className="relative flex items-center justify-center w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-[90vw] h-[90vh] max-w-[1200px] max-h-[800px] flex items-center justify-center">
              <Image
                src={validate_rx}
                alt="Prescription Full View"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

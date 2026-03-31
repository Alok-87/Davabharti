'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { IoClose } from 'react-icons/io5';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setOrderSelectedPrescriptions } from '@/features/prescriptions/prescriptionSlice'; // ✅ we'll use this to remove one

export default function PrescriptionSection() {
  const saved = useAppSelector((state) => state.prescription.orderSelectedPrescription); // string[]
  const dispatch = useAppDispatch();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ✅ Remove prescription by filtering it out of the array
  const handleDelete = (url: string) => {
    const updated = saved.filter((item) => item !== url);
    dispatch(setOrderSelectedPrescriptions(updated));
  };

  if (!saved?.length)
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-gray-800 text-base sm:text-lg font-semibold mb-3">Prescription</h3>
        <p className="text-sm text-gray-600">No prescriptions uploaded yet.</p>
      </div>
    );

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-gray-800 text-base sm:text-lg font-semibold mb-3">
          Uploaded Prescriptions
        </h3>

        <div className="flex flex-wrap gap-4">
          {saved.map((url, index) => (
            <div
              key={index}
              className="relative w-40 h-44 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all"
            >
              {/* Thumbnail */}
              <div
                className="w-full h-full bg-gray-100 cursor-pointer flex items-center justify-center overflow-hidden"
                onClick={() => setPreviewUrl(url)}
              >
                <img
                  src={url}
                  alt={`Prescription ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(url)}
                className="absolute top-2 right-2 bg-gray-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setPreviewUrl(null)}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewUrl(null);
            }}
            className="absolute top-5 right-5 z-50 text-white text-3xl hover:text-gray-300 transition cursor-pointer"
          >
            <IoClose />
          </button>

          {/* Fullscreen Image */}
          <img
            src={previewUrl}
            alt="Prescription Full View"
            className="object-contain max-w-[70vw] max-h-[90vh] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking image
          />
        </div>
      )}
    </>
  );
}

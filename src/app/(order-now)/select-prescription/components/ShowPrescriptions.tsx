
'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  removeSavedPrescription,
  setOrderSelectedPrescriptions,
  setQuickOrderSelectedPrescriptions,
} from '@/features/prescriptions/prescriptionSlice';
import { FaTrash, FaFilePrescription } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/ui/toast';

export default function ShowPrescriptions({
  href,
  orderType,
}: {
  href: string;
  orderType: 'order' | 'quickOrder';
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const prescriptions = useAppSelector((state) => state.prescription.saved);
  const [selected, setSelected] = useState<string[]>([]);

  // Handle selected prescription from query parameters
  useEffect(() => {
    const selectedPrescription = searchParams.get('selectedPrescription');
    if (selectedPrescription) {
      // Create a temporary prescription object for display
      const decodedUrl = decodeURIComponent(selectedPrescription);

      // Check if this prescription is already in saved prescriptions
      const existingPrescription = prescriptions.find(p => p.url === decodedUrl);

      if (existingPrescription) {
        // If it exists, select it
        setSelected([existingPrescription.url]);
      } else {
        // If it doesn't exist, we'll display it as a selected item
        // For now, we'll just show it in the UI without adding to saved prescriptions
        // This would require updating the prescription slice to handle external prescriptions
      }
    }
  }, [searchParams, prescriptions]);

  const handleSelect = (url: string) => {
    setSelected((prev) => (prev.includes(url) ? prev.filter((x) => x !== url) : [...prev, url]));
  };

  const handleDelete = (url: string) => {
    dispatch(removeSavedPrescription({ url }))
    Toast('Prescription removed successfully');
    setSelected((prev) => prev.filter((x) => x !== url));
  };

  const handleContinue = () => {
    const selectedPrescription = searchParams.get('selectedPrescription');

    if (selected.length === 0 && !selectedPrescription) return;

    let selectedUrls: string[] = [];

    if (selectedPrescription) {
      // If we have a selected prescription from query params, use it
      selectedUrls = [decodeURIComponent(selectedPrescription)];
    } else {
      // Otherwise use the selected prescriptions from the saved list
      selectedUrls = prescriptions.filter((p) => selected.includes(p.url)).map((p) => p.url);
    }

    if (orderType === 'quickOrder') dispatch(setQuickOrderSelectedPrescriptions(selectedUrls));
    if (orderType === 'order') dispatch(setOrderSelectedPrescriptions(selectedUrls));

    router.push(href);
  };

  const selectedPrescription = searchParams.get('selectedPrescription');

  return (
    <div>
      <div className="flex  overflow-y-auto items-center gap-4 py-4">
        {/* Show selected prescription from query params */}
        {selectedPrescription && (
          <div className="relative w-32 h-32 border-2 border-blue-500 rounded-lg overflow-hidden shadow flex-shrink-0">
            <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <img
              src={decodeURIComponent(selectedPrescription)}
              alt="Selected prescription"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 🧩 Empty state when no prescriptions and no selected prescription */}
        {prescriptions.length <= 0 && !selectedPrescription && (
          <div className="w-32 h-32 bg-gray-100 flex justify-center items-center rounded-lg shadow">
            <FaFilePrescription className="text-5xl text-gray-400" />
          </div>
        )}

        {/* 🩺 Show uploaded prescriptions */}
        {prescriptions.map((p) => (
          <div
            key={p.url}
            className="relative w-32 h-32 border rounded-lg overflow-hidden shadow flex-shrink-0"
          >
            <input
              type="checkbox"
              checked={selected.includes(p.url)}
              onChange={() => handleSelect(p.url)}
              className="absolute top-2 left-2 w-4 h-4 accent-primary cursor-pointer z-10"
            />

            <button
              onClick={() => handleDelete(p.url)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 z-10"
            >
              <FaTrash />
            </button>

            <img src={p.url} alt="Prescription" className="w-full h-full object-cover" />
          </div>
        ))}

      </div>

      {/* ✅ Continue button */}
      {(selected.length > 0 || selectedPrescription) && (
        <div className="w-full flex justify-end mt-4">
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-primary text-white rounded hover:opacity-80 font-medium"
          >
            {selectedPrescription
              ? 'Continue with Selected Prescription'
              : `Continue (${selected.length} selected)`
            }
          </button>
        </div>
      )}

      {/* ⚠️ Message when no selection but files exist */}
      {prescriptions.length > 0 && selected.length === 0 && !selectedPrescription && (
        <div className="flex flex-col items-center justify-center py-6 w-full">
          <p className="text-gray-500 text-sm mb-4">Select at least one prescription to continue</p>
        </div>
      )}
    </div>
  );
}

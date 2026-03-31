'use client';

import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  removeSavedPrescription,
  setQuickOrderSelectedPrescriptions,
} from '@/features/prescriptions/prescriptionSlice';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import { Toast } from '@/components/ui/toast';

export default function SelectedPrescription() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false); // ✅ prevent double initialization

  const selectedUrls = useAppSelector(
    (state) => state.prescription.quickOrderSelectedPrescription
  );

  const savedPrescriptions = useAppSelector(
    (state) => state.prescription.saved
  );

  // ✅ Initialize from URL only once (even in Strict Mode)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const single = searchParams.get('selectedPrescription');
    const multiple = searchParams.get('selectedPrescriptions');

    let urls: string[] = [];

    if (single) {
      urls.push(decodeURIComponent(single));
    }

    if (multiple) {
      urls.push(
        ...multiple.split(',').map((u) => decodeURIComponent(u))
      );
    }

    if (urls.length > 0) {
      dispatch(
        setQuickOrderSelectedPrescriptions([...new Set(urls)])
      );
    }
  }, [dispatch, searchParams]);

  // ✅ Update URL safely
  const updateUrl = (urls: string[]) => {
    const currentUrl = new URL(window.location.href);

    currentUrl.searchParams.delete('selectedPrescription');
    currentUrl.searchParams.delete('selectedPrescriptions');

    if (urls.length === 1) {
      currentUrl.searchParams.set(
        'selectedPrescription',
        encodeURIComponent(urls[0])
      );
    } else if (urls.length > 1) {
      currentUrl.searchParams.set(
        'selectedPrescriptions',
        urls.map((u) => encodeURIComponent(u)).join(',')
      );
    }
     Toast('Prescription removed successfully');
    window.history.replaceState({}, '', currentUrl.toString());
  };

  // ✅ Delete handler (works for both URL + saved)
  const handleDelete = (url: string) => {
    try {
      // Remove from saved list if exists
      if (savedPrescriptions.some((p) => p.url === url)) {
        dispatch(removeSavedPrescription({ url }));
      }

      const updated = selectedUrls.filter((u) => u !== url);

      dispatch(setQuickOrderSelectedPrescriptions(updated));
      updateUrl(updated);
    } catch (error) {
      Toast('Error in Prescription removed');
    }
  };

  // ✅ Empty state
  if (!selectedUrls || selectedUrls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full">
        <p className="text-gray-500 text-sm mb-4">
          No prescription selected.
        </p>
        <Link
          href="/select-prescription"
          className="px-4 py-2 bg-primary text-white rounded hover:opacity-80"
        >
          Add Prescription
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          {selectedUrls.length} prescription(s) selected
        </p>
      </div>

      <div className="flex flex-wrap gap-4 py-4">
        {selectedUrls.map((url) => (
          <div
            key={url} // ✅ stable key
            className="relative w-32 h-32 border rounded-lg overflow-hidden shadow"
          >
            <button
              onClick={() => handleDelete(url)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 z-10"
            >
              <FaTrash />
            </button>

            <img
              src={url}
              alt="Prescription"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

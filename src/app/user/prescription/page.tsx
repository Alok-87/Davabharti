'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PrescriptionCard from '@/components/shared/card/PrescriptionCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deletePrescriptionById, fetchPrescriptions } from '@/features/user-profile/userProfileThunks';
import { HiOutlineClipboardList } from 'react-icons/hi';

export default function PrescriptionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSelectionMode = searchParams.get('from') === 'select-prescription';
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>([]);

  const handleDelete = async (id: string | number) => {

    await dispatch(deletePrescriptionById(id.toString()));
  };

  const handleSelect = (id: string | number, image: string) => {
    if (isSelectionMode) {
      setSelectedPrescriptions(prev => {
        if (prev.includes(image)) {
          // If already selected, remove it
          return prev.filter(url => url !== image);
        } else {
          // If not selected, add it
          return [...prev, image];
        }
      });
    }
  };

  const handleConfirmSelection = () => {
    if (selectedPrescriptions.length > 0 && isSelectionMode) {
      // Navigate back with multiple selected prescriptions
      const selectedUrls = selectedPrescriptions.join(',');
      router.push(
        `/order-by-prescription?selectedPrescriptions=${selectedUrls}`
      );
    }
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, []);

  const { prescriptions: rawPrescriptions, loading } = useAppSelector((state) => state.userProfile);

  // Remove duplicate prescriptions based on imageUrl
  const prescriptions = rawPrescriptions ? rawPrescriptions.filter((prescription, index, self) =>
    index === self.findIndex(p => p.imageUrl === prescription.imageUrl)
  ) : [];

  if (loading)
    return (
      <div className="flex items-center justify-center lg:ml-100 lg:mt-50">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );

  if (!prescriptions || prescriptions.length === 0)
    return (
      <div className="flex justify-center items-center p-10 lg:ml-70 lg:mt-20 ">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <HiOutlineClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No prescription found</h3>
          <p className="text-gray-600">We couldn't find the prescriptions you're looking for.</p>
        </div>
      </div>
    );

  return (
    <div className=" bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {isSelectionMode ? 'Select Prescriptions' : 'My Prescriptions'}
          </h2>
          {isSelectionMode && (
            <p className="text-sm text-gray-600 mt-1">
              {selectedPrescriptions.length} prescription{selectedPrescriptions.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
        {isSelectionMode && (
          <div className="flex gap-2">
            {selectedPrescriptions.length > 0 && (
              <>
                <button
                  onClick={() => setSelectedPrescriptions([])}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={handleConfirmSelection}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Use Selected ({selectedPrescriptions.length})
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {prescriptions.map((p, index) => (
          <PrescriptionCard
            key={`prescription-${index}-${p.imageUrl}`}
            id={p.id}
            image={p.imageUrl}
            onDelete={handleDelete}
            selectionMode={isSelectionMode}
            onSelect={handleSelect}
            isSelected={selectedPrescriptions.includes(p.imageUrl)}
          />
        ))}
      </div>
    </div>
  );
}

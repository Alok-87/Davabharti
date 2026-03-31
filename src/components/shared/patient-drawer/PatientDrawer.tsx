'use client';

import { IoClose } from 'react-icons/io5';
import PatientForm from '@/app/user/pacient/components/PacientForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setShowPatientForm, clearEditingPatient } from '@/features/user-profile/userProfileSlice';

interface PatientDrawerProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
  title?: string;
}

export default function PatientDrawer({
  onSubmit,
  initialData,
  isEditing = false,
  title,
}: PatientDrawerProps) {
  const dispatch = useAppDispatch();
  const showPatientForm = useAppSelector((state) => state.userProfile.showPatientForm);

  const handleCloseDrawer = () => {
    dispatch(setShowPatientForm(false));
    dispatch(clearEditingPatient());
  };

  if (!showPatientForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end transition">
      {/* Overlay */}
      <div
        className={`flex-1 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          showPatientForm ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCloseDrawer}
      ></div>

      {/* Drawer Panel */}
      <div
        className={`w-full sm:w-[400px] md:w-[480px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-800 ${
          showPatientForm ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {title || (isEditing ? 'Edit Patient' : 'Add New Patient')}
          </h3>
          <button
            onClick={handleCloseDrawer}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <IoClose className="text-2xl text-gray-600 cursor-pointer" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5">
          <PatientForm
            onSubmit={onSubmit}
            initialData={initialData}
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
}

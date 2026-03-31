'use client';

import { useEffect, useState } from 'react';
import PatientCard from '@/components/shared/card/PacientCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteFamilyMember, fetchFamilyMembers } from '@/features/user-profile/userProfileThunks';
import { setSelectedFamilyMemberForOrder } from '@/features/user-profile/userProfileSlice';
import { setShowPatientForm } from '@/features/user-profile/userProfileSlice';
import { setIsEditing, setEditingPatient } from '@/features/user-profile/userProfileSlice';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  contact?: string;
  address?: string;
  relationship: 'SELF' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER';
  dob: string;
}
interface SelectPatientProps {
  onEditPatient?: (patient: any) => void;
}

export default function SelectPatient({ onEditPatient }: SelectPatientProps) {
  const dispatch = useAppDispatch();
  const { familyMembers, selectedFamilyMemberForOrder } = useAppSelector(
    (state) => state.userProfile
  );

  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  // Fetch once (only if empty)
  useEffect(() => {
    if (!familyMembers || familyMembers.length === 0) {
      dispatch(fetchFamilyMembers());
    }
  }, [familyMembers?.length, dispatch]);

  // Sync Redux → local
  useEffect(() => {
    if (Array.isArray(selectedFamilyMemberForOrder)) {
      setSelectedPatients(selectedFamilyMemberForOrder);
    }
  }, [selectedFamilyMemberForOrder]);


  // ✅ Handle selection toggle properly
  const handleSelect = (id: string) => {
    setSelectedPatients((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id];

      // Dispatch updated selection after local state computed
      dispatch(setSelectedFamilyMemberForOrder(newSelection));
      return newSelection;
    });
  };


  const editingPatient = useAppSelector((state) => state.userProfile.editingPatient);
  const isEditing = useAppSelector((state) => state.userProfile.isEditing);

  const handleEditPatient = (id: string) => {
    const patientToEdit = familyMembers.find((p) => p.id === id);
    if (patientToEdit) {
      if (onEditPatient) {
        onEditPatient(patientToEdit); // ✅ Pass full patient to parent
      } else {
        // fallback if used standalone (like in profile)
        dispatch(setEditingPatient(patientToEdit));
        dispatch(setIsEditing(true));
        dispatch(setShowPatientForm(true));
      }
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      await dispatch(deleteFamilyMember(id)).unwrap();
    }
  };

  const handleAddPatient = () => {
    dispatch(setEditingPatient(null));
    dispatch(setIsEditing(false));
    dispatch(setShowPatientForm(true));
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-7">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Select Patients</h2>

      <button
        onClick={() => handleAddPatient()}
        type="button"
        className="flex items-center gap-2 text-sm my-6 font-medium text-blue-600 border border-blue-200 bg-blue-50 px-4 py-2 rounded-md hover:bg-blue-100 transition cursor-pointer"
      >
        + Add New Patient
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            selected={selectedPatients.includes(patient.id!)}
            onSelect={() => handleSelect(patient.id!)}
            showRadio={false}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
          />
        ))}
      </div>

      {selectedPatients.length > 0 && (
        <div className="mt-5 bg-primary/5 border border-primary text-primary text-sm rounded-md px-4 py-3">
          ✅ <span className="font-medium text-primary">Selected Patients:</span>{' '}
          {selectedPatients
            .map((id) => familyMembers.find((p) => p.id === id)?.name)
            .filter(Boolean)
            .join(', ')}
        </div>
      )}
    </section>
  );
}

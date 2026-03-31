// "use client";

// import { useEffect, useState } from "react";
// import { HiPlus } from "react-icons/hi";
// import { IoClose } from "react-icons/io5";
// import PatientCard from "@/components/shared/card/PacientCard";
// import PatientForm from "./components/PacientForm";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { fetchFamilyMembers } from "@/features/user-profile/userProfileThunks";

// export default function PatientsPage() {
//     const [showDrawer, setShowDrawer] = useState(false);

//     const handleAddPatient = (data) => {
//         const newPatient: Patient = { id: Date.now().toString(), ...data };
//         setPatients((prev) => [...prev, newPatient]);
//         setShowDrawer(false);
//     };

//     const dispatch = useAppDispatch();
//     useEffect(() => {
//         dispatch(fetchFamilyMembers());
//     }, [])

//     const { familyMembers } = useAppSelector((state) => state.userProfile);

//     return (
//         <div className="bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-5xl mx-auto space-y-4">
//                 {/* Header */}
//                 <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
//                     Manage Patients
//                 </h2>

//                 {/* Add New Button */}
//                 <button
//                     onClick={() => setShowDrawer(true)}
//                     className="flex items-center gap-2 text-blue-600 font-medium text-sm border border-gray-200 rounded-md px-4 py-3 bg-white hover:bg-blue-50 transition cursor-pointer"
//                 >
//                     <HiPlus className="w-5 h-5" />
//                     ADD A NEW PATIENT
//                 </button>

//                 {/* Patient List */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//                     {familyMembers.map((p) => (
//                         <PatientCard key={p.id} patient={p} />
//                     ))}
//                 </div>
//             </div>

//             {/* Slide Drawer */}
//             <div
//                 className={`fixed inset-0 z-50 flex justify-end transition-transform duration-300 ${showDrawer ? "translate-x-0" : "translate-x-full"
//                     }`}
//             >
//                 {/* Overlay */}
//                 <div
//                     className={`flex-1 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${showDrawer
//                             ? "opacity-100"
//                             : "opacity-0 pointer-events-none"
//                         }`}
//                     onClick={() => setShowDrawer(false)}
//                 ></div>

//                 {/* Drawer Panel */}
//                 <div className="w-full sm:w-[400px] md:w-[480px] bg-white h-full shadow-2xl flex flex-col">
//                     {/* Header */}
//                     <div className="flex items-center justify-between border-b px-5 py-4">
//                         <h3 className="text-lg font-semibold text-gray-800">
//                             Add New Patient
//                         </h3>
//                         <button
//                             onClick={() => setShowDrawer(false)}
//                             className="p-2 rounded-full hover:bg-gray-100 transition"
//                         >
//                             <IoClose className="text-2xl text-gray-600 cursor-pointer" />
//                         </button>
//                     </div>

//                     {/* Form */}
//                     <div className="flex-1 overflow-y-auto p-5">
//                         <PatientForm onSubmit={handleAddPatient} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import { HiPlus } from 'react-icons/hi';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import {
//   fetchFamilyMembers,
//   createFamilyMember,
//   updateFamilyMember,
//   deleteFamilyMember,
// } from '@/features/user-profile/userProfileThunks';
// import {
//   setSelectedFamilyMemberForOrder,
//   setShowPatientForm,
// } from '@/features/user-profile/userProfileSlice';
// import PatientCard from '@/components/shared/card/PacientCard';
// import PatientDrawer from '@/components/shared/patient-drawer/PatientDrawer';
// import { setEditingPatient, setIsEditing } from "@/features/user-profile/userProfileSlice";

// export default function PatientsPage() {
//   const dispatch = useAppDispatch();
//   const { familyMembers, loading } = useAppSelector((state) => state.userProfile);

//   const editingPatient = useAppSelector((state) => state.userProfile.editingPatient);
//   const isEditing = useAppSelector((state) => state.userProfile.isEditing);

//   useEffect(() => {
//     dispatch(fetchFamilyMembers());
//   }, [dispatch]);

//   const handleAddPatient = () => {
//     dispatch(setEditingPatient(null));
//     dispatch(setIsEditing(false));
//     dispatch(setShowPatientForm(true));
//   };

//   const handleEditPatient = (id: string) => {
//     const patientToEdit = familyMembers.find((p) => p.id === id);
//     if (patientToEdit) {
//       dispatch(setEditingPatient(patientToEdit));
//       dispatch(setIsEditing(true));
//       dispatch(setShowPatientForm(true));
//     }
//   };

//   const handleDeletePatient = async (id: string) => {
//     if (confirm('Are you sure you want to delete this patient?')) {
//       await dispatch(deleteFamilyMember(id)).unwrap();
//     }
//   };

//   const handleFormSubmit = async (data: any) => {
//     try {
//       if (isEditing && editingPatient) {
//         await dispatch(updateFamilyMember({ id: editingPatient.id, payload: data })).unwrap();
//       } else {
//         await dispatch(createFamilyMember(data)).unwrap();
//       }
//       dispatch(setShowPatientForm(false));
//       setEditingPatient(null);
//       setIsEditing(false);
//     } catch (error) { }
//   };

//   return (
//     <div className="w-full bg-gray-50 p-4 sm:p-6">
//       <div className="space-y-4">
//         {' '}
//         {/* removed max-w-7xl mx-auto */}
//         <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Manage Patients</h2>
//         <button
//           onClick={handleAddPatient}
//           className="flex items-center gap-2 text-blue-600 font-medium text-sm border border-gray-200 rounded-md px-4 py-3 bg-white hover:bg-blue-50 transition"
//         >
//           <HiPlus className="w-5 h-5" />
//           ADD A NEW PATIENT
//         </button>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//           {familyMembers.map((p) => (
//             <PatientCard
//               key={p.id}
//               patient={p}
//               onEdit={handleEditPatient}
//               onDelete={handleDeletePatient}
//             />
//           ))}
//         </div>
//       </div>

//       <PatientDrawer
//         onSubmit={handleFormSubmit}
//         initialData={editingPatient}
//         isEditing={isEditing}
//       />
//     </div>
//   );
// }

'use client';

import { useEffect } from 'react';
import { HiPlus } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchFamilyMembers,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from '@/features/user-profile/userProfileThunks';
import {
  setShowPatientForm,
  setEditingPatient,
  clearEditingPatient,
} from '@/features/user-profile/userProfileSlice';
import PatientCard from '@/components/shared/card/PacientCard';
import PatientDrawer from '@/components/shared/patient-drawer/PatientDrawer';

export default function PatientsPage() {
  const dispatch = useAppDispatch();
  const { familyMembers, loading, editingPatient } = useAppSelector((state) => state.userProfile);

  useEffect(() => {
    dispatch(fetchFamilyMembers());
  }, [dispatch]);

  const handleAddPatient = () => {
    dispatch(clearEditingPatient());
    dispatch(setShowPatientForm(true));
  };

  const handleEditPatient = (id: string) => {
    const patientToEdit = familyMembers.find((p) => p.id === id);
    if (patientToEdit) {
      dispatch(setEditingPatient(patientToEdit));
      dispatch(setShowPatientForm(true));
    }
  };

  const handleDeletePatient = async (id: string) => {
   
      try {
        await dispatch(deleteFamilyMember(id)).unwrap();
        // Success message is handled in the slice
      } catch (error) {
        // Error is handled in the slice
        console.error('Failed to delete patient:', error);
      }
    
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingPatient) {
        await dispatch(
          updateFamilyMember({
            id: editingPatient.id,
            payload: data,
          })
        ).unwrap();
      } else {
        await dispatch(createFamilyMember(data)).unwrap();
      }
      dispatch(setShowPatientForm(false));
      dispatch(clearEditingPatient());
    } catch (error) {
      console.error('Failed to save patient:', error);
    }
  };

  return (
    <div className="w-full bg-gray-50 p-4 sm:p-6">
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Manage Patients</h2>
        <button
          onClick={handleAddPatient}
          className="flex items-center gap-2 text-blue-600 font-medium text-sm border border-gray-200 rounded-md px-4 py-3 bg-white hover:bg-blue-50 transition"
        >
          <HiPlus className="w-5 h-5" />
          ADD A NEW PATIENT
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {familyMembers.map((p) => (
            <PatientCard
              key={p.id}
              patient={p}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
            />
          ))}
        </div>
      </div>

      <PatientDrawer
        onSubmit={handleFormSubmit}
        initialData={editingPatient}
        isEditing={!!editingPatient}
      />
    </div>
  );
}
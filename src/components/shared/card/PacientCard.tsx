// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { HiOutlineDotsVertical } from 'react-icons/hi';
// import { UserCircleIcon } from '@heroicons/react/24/outline';
// import { useAppDispatch } from '@/store/hooks';
// import { setShowPatientForm } from '@/features/user-profile/userProfileSlice';
// import { useRouter } from 'next/navigation';

// // ✅ Updated to match FamilyMember type
// interface Patient {
//   id?: string;
//   userId?: string;
//   name: string;
//   relationship: 'Self' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER';
//   dob: string;
//   gender: 'MALE' | 'FEMALE' | 'OTHER';
//   isDeleted?: boolean;
//   age?: number;
// }

// interface PatientCardProps {
//   patient: Patient;
//   selected?: boolean;
//   onSelect?: (id: string) => void;
//   showRadio?: boolean;
//   onEdit?: (id: string) => void;
//   onDelete?: (id: string) => void;
// }

// export default function PatientCard({
//   patient,
//   selected,
//   onSelect,
//   showRadio = false,
//   onEdit,
//   onDelete,
// }: PatientCardProps) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const dispatch = useAppDispatch();
// const router=useRouter()
//   // 📅 Calculate Age
//   const getAge = (dob: string) => {
//     if (!dob) return '';
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   // 🧠 Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // 🧍 Gender-based color
//   const genderColor =
//     patient.gender === 'MALE'
//       ? 'bg-blue-100 text-blue-600'
//       : patient.gender === 'FEMALE'
//         ? 'bg-pink-100 text-pink-600'
//         : 'bg-gray-100 text-gray-600';

//   // 🧩 Gender-based avatar
//   const initials = patient.name
//     .split(' ')
//     .map((n) => n[0]?.toUpperCase())
//     .slice(0, 2)
//     .join('');

//   // Handle card click for selection (only if not clicking menu)
//   const handleCardClick = (e: React.MouseEvent) => {
//     // Don't trigger selection if clicking the menu or its buttons
//     const target = e.target as HTMLElement;
//     if (target.closest('.menu-container') || target.closest('.menu-button')) {
//       return;
//     }
//     if (patient.id && onSelect) {
//       onSelect(patient.id);
//     }
//   };

//   // Handle edit with proper event stopping
//   const handleEditClick = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent card click
//     console.log("hii",patient)
//      if (patient.relationship === "Self") {

//       // ✅ Redirect to /user if SELF
//       router.push('/user');
//       return;
//     }
//     if (patient.id && onEdit) {
//       onEdit(patient.id);
//     }
//     setMenuOpen(false);
//   };

//   // Handle delete with proper event stopping
//   const handleDeleteClick = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent card click
//     if (patient.relationship === 'Self') {
    
//       return;
//     }
//     if (patient.id && onDelete) {
//       onDelete(patient.id);
//     }
//     setMenuOpen(false);
//   };

//   // ✅ Updated relationship mapping to handle both old and new values
//   const formatRelationship = (relationship: string) => {
//     const relationshipMap: { [key: string]: string } = {
//       // New values
//       'SELF': 'Self',
//       'SPOUSE': 'Spouse',
//       'CHILD': 'Child',
//       'PARENT': 'Parent',
//       'SIBLING': 'Sibling',
//       'OTHER': 'Other',
//       // Old values (for backward compatibility)
//       'FATHER': 'Father',
//       'MOTHER': 'Mother',
//     };

//     return relationshipMap[relationship] || relationship;
//   };

//   // ✅ Format gender display
//   const formatGender = (gender: string) => {
//     const genderMap: { [key: string]: string } = {
//       'MALE': 'Male',
//       'FEMALE': 'Female', 
//       'OTHER': 'Other'
//     };
//     return genderMap[gender] || gender;
//   };

//   return (
//     <div
//       className={`relative border rounded-xl p-4 sm:p-5 transition-all bg-white shadow-sm hover:shadow-md cursor-pointer ${
//         selected
//           ? 'border-primary ring-2 ring-primary/30'
//           : 'border-gray-200 hover:border-primary/40'
//       }`}
//       onClick={handleCardClick}
//     >
//       {/* Main Section */}
//       <div className="flex items-start justify-between">
//         {/* Left Section: Avatar + Details */}
//         <div className="flex items-start gap-4">
//           {/* Avatar */}
//           {/* <div
//             className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold shadow-inner ${genderColor}`}
//           >
//             {initials || <UserCircleIcon className="w-8 h-8 text-gray-400" />}
//           </div> */}

//           {/* Patient Details */}
//           <div className="text-sm text-gray-700 space-y-1">
//             <p className="font-semibold text-gray-900 text-base capitalize truncate sm:whitespace-normal sm:break-words max-w-[200px]">
//               {patient.name}
//             </p>

//             <p>
//               <span className="font-medium text-gray-600">Relationship:</span>{' '}
//               {formatRelationship(patient.relationship)}
//             </p>

//             <p>
//               <span className="font-medium text-gray-600">Gender:</span> {formatGender(patient.gender)}
//             </p>
//             <p>
//               <span className="font-medium text-gray-600">Date of Birth:</span>{' '}
//               {new Date(patient.dob).toLocaleDateString('en-IN')}
//             </p>
//             <p>
//               <span className="font-medium text-gray-600">Age:</span>{' '}
//               {patient.age ?? getAge(patient.dob)} yrs
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ⋮ Menu Button + Dropdown */}
//       <div className="absolute top-3 right-1 menu-container" ref={menuRef}>
//         <button
//           onClick={(e) => {
//             e.stopPropagation(); // Prevent card click
//             setMenuOpen((prev) => !prev);
//           }}
//           className="p-1.5 rounded-full hover:bg-gray-100 transition menu-button"
//         >
//           <HiOutlineDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
//         </button>

//         {menuOpen && (
//           <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden">
//             <button
//               onClick={handleEditClick}
//               className="block w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 cursor-pointer menu-button"
//             >
//               ✏️ Edit
//             </button>
//            {patient.relationship !== 'Self' &&
//              <button
//               onClick={handleDeleteClick}
//               className="block w-full text-left text-sm text-red-600 hover:bg-red-50 px-4 py-2 cursor-pointer menu-button"
//             >
//               🗑️ Delete
//             </button>
//            }
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { HiOutlineDotsVertical } from 'react-icons/hi';
// import { useRouter } from 'next/navigation'; // ✅ Import router for navigation
// import { useAppDispatch } from '@/store/hooks';
// import { setShowPatientForm } from '@/features/user-profile/userProfileSlice';

// interface Patient {
//   id?: string;
//   userId?: string;
//   name: string;
//   relationship: 'SELF' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER';
//   dob: string;
//   gender: 'MALE' | 'FEMALE' | 'OTHER';
//   isDeleted?: boolean;
//   age?: number;
// }

// interface PatientCardProps {
//   patient: Patient;
//   selected?: boolean;
//   onSelect?: (id: string) => void;
//   showRadio?: boolean;
//   onEdit?: (id: string) => void;
//   onDelete?: (id: string) => void;
// }

// export default function PatientCard({
//   patient,
//   selected,
//   onSelect,
//   showRadio = false,
//   onEdit,
//   onDelete,
// }: PatientCardProps) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const dispatch = useAppDispatch();
//   const router = useRouter(); // ✅ Initialize router

//   // 🧠 Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleEditClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setMenuOpen(false);

//     if (patient.relationship === 'SELF') {
//       // ✅ Redirect to /user if SELF
//       router.push('/user');
//       return;
//     }

//     if (patient.id && onEdit) {
//       onEdit(patient.id);
//     }
//   };

//   const handleDeleteClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setMenuOpen(false);

//     // ✅ Disable delete for SELF
//     if (patient.relationship === 'SELF') return;

//     if (patient.id && onDelete) {
//       onDelete(patient.id);
//     }
//   };

//   return (
//     <div
//       className={`relative border rounded-xl p-4 sm:p-5 transition-all bg-white shadow-sm hover:shadow-md cursor-pointer ${
//         selected
//           ? 'border-primary ring-2 ring-primary/30'
//           : 'border-gray-200 hover:border-primary/40'
//       }`}
//       onClick={() => patient.id && onSelect?.(patient.id)}
//     >
//       {/* ... patient details code ... */}

//       {/* ⋮ Menu Button + Dropdown */}
//       <div className="absolute top-3 right-1 menu-container" ref={menuRef}>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setMenuOpen((prev) => !prev);
//           }}
//           className="p-1.5 rounded-full hover:bg-gray-100 transition menu-button"
//         >
//           <HiOutlineDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
//         </button>

//         {menuOpen && (
//           <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden">
//             <button
//               onClick={handleEditClick}
//               className="block w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 cursor-pointer menu-button"
//             >
//               ✏️ Edit
//             </button>
//             <button
//               onClick={handleDeleteClick}
//               disabled={patient.relationship === 'SELF'} // ✅ Disable delete for self
//               className={`block w-full text-left text-sm px-4 py-2 menu-button ${
//                 patient.relationship === 'SELF'
//                   ? 'text-gray-400 cursor-not-allowed bg-gray-50'
//                   : 'text-red-600 hover:bg-red-50 cursor-pointer'
//               }`}
//             >
//               🗑️ Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Patient {
  id?: string;
  userId?: string;
  name: string;
  relationship: 'Self' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER';
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  isDeleted?: boolean;
  age?: number;
}

interface PatientCardProps {
  patient: Patient;
  selected?: boolean;
  onSelect?: (id: string) => void;
  showRadio?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function PatientCard({
  patient,
  selected,
  onSelect,
  showRadio = false,
  onEdit,
  onDelete,
}: PatientCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Calculate age from DOB
  const getAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Edit handler
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (patient.relationship === 'Self') {
      router.push('/user');
      return;
    }
    if (patient.id && onEdit) onEdit(patient.id);
  };

  // Confirm delete handler
  const confirmDelete = () => {
    if (patient.id && onDelete) onDelete(patient.id);
    setShowDeleteDialog(false);
    setMenuOpen(false);
  };

  const formatRelationship = (relationship: string) => {
    const map: Record<string, string> = {
      SELF: 'Self',
      SPOUSE: 'Spouse',
      CHILD: 'Child',
      PARENT: 'Parent',
      SIBLING: 'Sibling',
      OTHER: 'Other',
      FATHER: 'Father',
      MOTHER: 'Mother',
    };
    return map[relationship] || relationship;
  };

  const formatGender = (gender: string) => {
    const map: Record<string, string> = {
      MALE: 'Male',
      FEMALE: 'Female',
      OTHER: 'Other',
    };
    return map[gender] || gender;
  };

  return (
    <>
      <div
        className={`relative border rounded-xl p-4 sm:p-5 transition-all bg-white shadow-sm hover:shadow-md cursor-pointer ${
          selected ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-primary/40'
        }`}
        onClick={() => patient.id && onSelect?.(patient.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Patient Details */}
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900 text-base capitalize truncate sm:whitespace-normal sm:break-words max-w-[200px]">
                {patient.name}
              </p>
              <p>
                <span className="font-medium text-gray-600">Relationship:</span> {formatRelationship(patient.relationship)}
              </p>
              <p>
                <span className="font-medium text-gray-600">Gender:</span> {formatGender(patient.gender)}
              </p>
              <p>
                <span className="font-medium text-gray-600">Date of Birth:</span>{' '}
                {new Date(patient.dob).toLocaleDateString('en-IN')}
              </p>
              <p>
                <span className="font-medium text-gray-600">Age:</span> {patient.age ?? getAge(patient.dob)} yrs
              </p>
            </div>
          </div>
        </div>

        {/* ⋮ Menu */}
        <div className="absolute top-3 right-1 menu-container" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 transition menu-button"
          >
            <HiOutlineDotsVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden">
              <button
                onClick={handleEditClick}
                className="block w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 cursor-pointer menu-button"
              >
                ✏️ Edit
              </button>

              {patient.relationship !== 'Self' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setShowDeleteDialog(true); // Open shadcn dialog
                  }}
                  className="block w-full text-left text-sm text-red-600 hover:bg-red-50 px-4 py-2 cursor-pointer menu-button"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{patient.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

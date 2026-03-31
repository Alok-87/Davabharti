

// 'use client';

// import { useForm } from 'react-hook-form';
// import { useAppDispatch } from '@/store/hooks';
// import { createFamilyMember, updateFamilyMember } from '@/features/user-profile/userProfileThunks';
// import { useEffect } from 'react';
// import { frontendToBackendRelationship } from '@/utility/relationshipMapper';
// import { setShowPatientForm } from '@/features/user-profile/userProfileSlice';

// // Use frontend relationship values in the form
// export interface PatientFormValues {
//   name: string;
//   relationship: 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD' | 'OTHER';
//   dob: string;
//   gender: 'MALE' | 'FEMALE' | 'OTHER';
// }

// interface PatientFormProps {
//   onSubmit?: (data: PatientFormValues) => void;
//   initialData?: any;
//   isEditing?: boolean;
// }

// export default function PatientForm({
//   onSubmit,
//   initialData,
//   isEditing = false,
// }: PatientFormProps) {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<PatientFormValues>();

//   const dispatch = useAppDispatch();

//   // Reset form when initialData changes
//   useEffect(() => {
//     if (initialData) {
//       reset({
//         name: initialData.name,
//         relationship: initialData.relationship,
//         dob: initialData.dob.split('T')[0],
//         gender: initialData.gender,
//       });
//     } else {
//       reset({
//         name: '',
//         relationship: 'OTHER',
//         dob: '',
//         gender: 'OTHER',
//       });
//     }
//   }, [initialData, reset]);

//   const handleFormSubmit = async (data: PatientFormValues) => {
//     try {
//       // Transform relationship for backend API
//       const backendPayload = {
//         ...data,
//         relationship: frontendToBackendRelationship(data.relationship) as any,
//       };

//       // if (isEditing && initialData) {
//       //   await dispatch(
//       //     updateFamilyMember({
//       //       id: initialData.id,
//       //       payload: backendPayload,
//       //     })
//       //   ).unwrap();
//       // } else {
//       //   // await dispatch(createFamilyMember(backendPayload)).unwrap();
//       // }

//       if (onSubmit) {
//         onSubmit(data);
//         reset();
//       }
//     } catch (error) {}
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
//       {/* 👤 Full Name */}
//       <div>
//         <label className="text-sm text-gray-700">Full Name *</label>
//         <input
//           {...register('name', { required: 'Full name is required' })}
//           className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
//           placeholder="Enter full name"
//         />
//         {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
//       </div>

//       {/* 🔗 Relationship */}
//       <div>
//         <label className="text-sm text-gray-700">Relationship *</label>
//         <select
//           {...register('relationship', { required: 'Relationship is required' })}
//           className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-primary focus:border-primary outline-none"
//         >
//           <option value="">Select relationship</option>
//           <option value="PARENT">Parent</option>
//           <option value="SELF">Self</option>
//           <option value="SPOUSE">Spouse</option>
//           <option value="CHILD">Child</option>
//           <option value="SIBLING">Sibling</option>
//           <option value="OTHER">Other</option>
//         </select>
//         {errors.relationship && (
//           <p className="text-xs text-red-500 mt-1">{errors.relationship.message}</p>
//         )}
//       </div>

//       {/* 📅 Date of Birth */}
//       <div>
//         <label className="text-sm text-gray-700">Date of Birth *</label>
//         <input
//           type="date"
//           {...register('dob', { required: 'Date of birth is required' })}
//           className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
//         />
//         {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob.message}</p>}
//       </div>

//       {/* 🚻 Gender */}
//       <div>
//         <label className="text-sm text-gray-700">Gender *</label>
//         <select
//           {...register('gender', { required: 'Gender is required' })}
//           className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-primary focus:border-primary outline-none"
//         >
//           <option value="">Select gender</option>
//           <option value="MALE">Male</option>
//           <option value="FEMALE">Female</option>
//           <option value="OTHER">Other</option>
//         </select>
//         {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
//       </div>

//       {/* 💾 Submit Button */}
//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full mt-4 bg-primary text-white font-medium text-sm py-2.5 rounded-md hover:bg-primary/90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {isSubmitting ? 'Saving...' : isEditing ? 'Update Patient' : 'Save Patient'}
//       </button>
//     </form>
//   );
// }

'use client';

import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { setShowPatientForm, clearEditingPatient } from '@/features/user-profile/userProfileSlice';

// Use the same relationship values as backend
export interface PatientFormValues {
  name: string;
  relationship: 'SELF' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER';
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

interface PatientFormProps {
  onSubmit?: (data: PatientFormValues) => void;
  initialData?: any;
  isEditing?: boolean;
}

export default function PatientForm({
  onSubmit,
  initialData,
  isEditing = false,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>();

  const dispatch = useAppDispatch();

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        relationship: initialData.relationship,
        dob: initialData.dob.split('T')[0],
        gender: initialData.gender,
      });
    } else {
      reset({
        name: '',
        relationship: 'OTHER',
        dob: '',
        gender: 'OTHER',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: PatientFormValues) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      // Error handling is done in the parent component
      throw error; // Re-throw to let parent handle it
    }
  };

  const handleClose = () => {
    dispatch(setShowPatientForm(false));
    dispatch(clearEditingPatient());
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 👤 Full Name */}
      <div>
        <label className="text-sm text-gray-700">Full Name *</label>
        <input
          {...register('name', { required: 'Full name is required' })}
          className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
          placeholder="Enter full name"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* 🔗 Relationship */}
      <div>
        <label className="text-sm text-gray-700">Relationship *</label>
        <select
          {...register('relationship', { required: 'Relationship is required' })}
          className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-primary focus:border-primary outline-none"
        >
          <option value="">Select relationship</option>
          {/* <option value="SELF">Self</option> */}
          <option value="SPOUSE">Spouse</option>
          <option value="CHILD">Child</option>
          <option value="PARENT">Parent</option>
          <option value="SIBLING">Sibling</option>
          <option value="OTHER">Other</option>
        </select>
        {errors.relationship && (
          <p className="text-xs text-red-500 mt-1">{errors.relationship.message}</p>
        )}
      </div>

      {/* 📅 Date of Birth */}
      <div>
        <label className="text-sm text-gray-700">Date of Birth *</label>
        <input
          type="date"
          {...register('dob', { required: 'Date of birth is required' })}
          className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
        />
        {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob.message}</p>}
      </div>

      {/* 🚻 Gender */}
      <div>
        <label className="text-sm text-gray-700">Gender *</label>
        <select
          {...register('gender', { required: 'Gender is required' })}
          className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-primary focus:border-primary outline-none"
        >
          <option value="">Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
      </div>

      {/* 💾 Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-4 bg-primary text-white font-medium text-sm py-2.5 rounded-md hover:bg-primary/90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Patient' : 'Save Patient'}
      </button>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={handleClose}
        className="w-full mt-2 bg-gray-300 text-gray-700 font-medium text-sm py-2.5 rounded-md hover:bg-gray-400 transition cursor-pointer"
      >
        Cancel
      </button>
    </form>
  );
}
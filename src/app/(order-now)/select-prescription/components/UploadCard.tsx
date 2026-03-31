// 'use client';
// import React, { useRef } from 'react';
// import Card from './Card';
// import { ImFolderUpload } from 'react-icons/im';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { uploadPrescription } from '@/features/prescriptions/prescriptionThunks';
// import { selectIsUploading, selectUploadError } from '@/features/prescriptions/prescriptionSelectors';

// export default function UploadCard() {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const dispatch = useAppDispatch();
//   const uploading = useAppSelector(selectIsUploading);
//   const error = useAppSelector(selectUploadError);

//   const handleClick = () => {
//     if (!uploading) fileInputRef.current?.click();
//   };

//  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   dispatch(uploadPrescription({ file })); // <-- pass the real File

//   e.target.value = ''; // reset input
// };

//   return (
//     <div onClick={handleClick} className="cursor-pointer">
//       <Card label={uploading ? 'Uploading...' : 'Upload'}>
//         <ImFolderUpload
//           className={`text-4xl ${uploading ? 'text-gray-400 animate-pulse' : 'text-primary'}`}
//         />
//       </Card>
//       <input
//         type="file"
//         accept="image/jpeg,image/jpg,image/png,application/pdf"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         className="hidden"
//       />
//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// }

'use client';
import React, { useRef } from 'react';
import Card from './Card';
import { ImFolderUpload } from 'react-icons/im';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { uploadPrescription, uploadPrescription_ } from '@/features/prescriptions/prescriptionThunks';
import {
  selectIsUploading,
  selectUploadError,
} from '@/features/prescriptions/prescriptionSelectors';

export default function UploadCard() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const uploading = useAppSelector(selectIsUploading);
  const error = useAppSelector(selectUploadError);

  const handleClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = {
      folder: 'prescriptions',
      file: file,
    }
    dispatch(uploadPrescription_(data));
    // dispatch(uploadPrescription(file)); // ✅ Fixed: pass file directly, not as object
     e.target.value = '';
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card label={uploading ? 'Uploading...' : 'Upload'}>
        <ImFolderUpload
          className={`text-4xl ${uploading ? 'text-gray-400 animate-pulse' : 'text-primary'}`}
        />
      </Card>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

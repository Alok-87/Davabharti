// 'use client';

// import { useState } from 'react';
// import { HiPlus } from 'react-icons/hi';
// import { IoAddCircleOutline, IoClose } from 'react-icons/io5';
// import AddressForm, { AddressFormValues } from '@/app/user/addresses/components/AddressForm';

// interface AddressDrawerProps {
//   onAdd: (data: AddressFormValues) => void;
//   buttonLabel?: string;
//   showGrayButton?: boolean;
// }

// export default function AddressDrawer({
//   onAdd,
//   buttonLabel = 'Add New Address',
//   showGrayButton = false,
// }: AddressDrawerProps) {
//   const [showDrawer, setShowDrawer] = useState(false);

//   const handleSubmit = (data: AddressFormValues) => {
//     onAdd(data);
//     setShowDrawer(false);
//   };
//   return (
//     <>
//       {/* Trigger Button */}
//       {showGrayButton && (
//         <button
//           type="button"
//           onClick={() => setShowDrawer(true)}
//           className="flex min-h-[140px] bg-gray-50 items-center justify-center flex-col border-2 border-dashed border-gray-200 rounded-md p-4 text-sm text-gray-600 hover:border-primary hover:text-primary transition"
//           aria-label="Add new address"
//         >
//           <IoAddCircleOutline className="w-7 h-7 mb-2" />
//           <span className="font-medium">Add New Address</span>
//         </button>
//       )}
//       {!showGrayButton && (
//         <button
//           type="button"
//           onClick={() => setShowDrawer(true)}
//           className="flex items-center gap-2 text-blue-600 font-medium text-sm border border-gray-200 rounded-md px-4 py-3 bg-white hover:bg-blue-50 transition cursor-pointer"
//         >
//           <HiPlus className="w-5 h-5" />
//           {buttonLabel}
//         </button>
//       )}

//       {/* Drawer */}
//       <div
//         className={`fixed inset-0 z-50 flex justify-end transition-transform duration-300 ${
//           showDrawer ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         {/* Overlay */}
//         <div
//           className={`flex-1 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
//             showDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
//           }`}
//           onClick={() => setShowDrawer(false)}
//         ></div>

//         {/* Panel */}
//         <div className="w-full sm:w-[400px] md:w-[480px] bg-white h-full shadow-2xl flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between border-b px-5 py-4">
//             <h3 className="text-lg font-semibold text-gray-800">{buttonLabel}</h3>
//             <button
//               onClick={() => setShowDrawer(false)}
//               className="p-2 rounded-full hover:bg-gray-100 transition"
//             >
//               <IoClose className="text-2xl text-gray-600 cursor-pointer" />
//             </button>
//           </div>

//           {/* Scrollable Form */}
//           <div className="flex-1 overflow-y-auto p-5">
//             <AddressForm onSubmit={handleSubmit} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// after bug fixed 22-10-25
'use client';

import { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import AddressForm, { AddressFormValues } from '@/app/user/addresses/components/AddressForm';
import { Address } from '@/features/user-profile/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ProfileAlertDialog from '../alert/ProfileAlert';
import { setSelectedAddressForOrder } from '@/features/user-profile/userProfileSlice';

interface AddressDrawerProps {
  onAdd?: (data: AddressFormValues) => void;
  onEdit?: (data: AddressFormValues) => void;
  onClose?: () => void;
  buttonLabel?: string;
  showGrayButton?: boolean;
  editData?: Address;
  open?: boolean; // ✅ Added for Edit control
  onOpenChange?: (v: boolean) => void;
}

export default function AddressDrawer({
  onAdd,
  onEdit,
  onClose,
  buttonLabel = 'Add New Address',
  showGrayButton = false,
  editData,
  open,
  onOpenChange,
}: AddressDrawerProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const showDrawer = isControlled ? open! : internalOpen;
  const isEditing = !!editData;
  const { user } = useAppSelector((state) => state.userProfile);
     const [showProfileDialog, setShowProfileDialog] = useState(false);

  const setOpen = (value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
    if (!value) onClose?.();
  };
  const handleAddNewAddress =()=>{
      if (!user?.is_profile_complete) {
      setShowProfileDialog(true);
      return;
    }
    setOpen(true)
  }
  const handleSubmit = (data: AddressFormValues) => {
    
    if (isEditing && onEdit) {
      onEdit(data);
    } else if (onAdd) {
      onAdd(data);
    }
    setOpen(false);
  };

  const dispatch = useAppDispatch();
  const closeHandler = () => {
    setOpen(false);
    dispatch(setSelectedAddressForOrder(null));
  }

  return (
    <>
    <ProfileAlertDialog
    isAddress={true}
        open={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
      />
      {/* ✅ Trigger button ONLY when not in Edit Mode */}
      {!isControlled && !showGrayButton && (
        <button
          type="button"
          onClick={handleAddNewAddress}
          className="flex items-center gap-2 text-blue-600 font-medium text-sm border border-gray-200 rounded-md px-4 py-3 bg-white hover:bg-blue-50 transition cursor-pointer"
        >
          <HiPlus className="w-5 h-5" />
          {buttonLabel}
        </button>
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-transform duration-300 ${
          showDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Overlay */}
        <div
          className={`flex-1 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            showDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setOpen(false)}
        ></div>

        {/* Panel */}
        <div className="w-full sm:w-[400px] md:w-[480px] bg-white h-full shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isEditing ? 'Edit Address' : buttonLabel}
            </h3>
            <button onClick={closeHandler} className="p-2 rounded-full hover:bg-gray-100 transition">
              <IoClose className="text-2xl text-gray-600 cursor-pointer" />
            </button>
          </div>

          {/* Scrollable Form */}
          <div className="flex-1 overflow-y-auto p-5">
            <AddressForm onSubmit={handleSubmit} initialData={editData} isEditing={isEditing} />
          </div>
        </div>
      </div>
    </>
  );
}

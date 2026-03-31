// "use client";
// import { Address } from "@/features/user-profile/types";
// import { useState, useRef, useEffect } from "react";
// import { HiDotsVertical } from "react-icons/hi";

// interface Props {
//   data: Address;
//   onEdit?: (address: Address) => void;
//   onDelete?: (id: number) => void;
// }

// export default function AddressCard({ data, onEdit, onDelete }: Props) {
//   const [openMenu, setOpenMenu] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // ✅ Close menu on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpenMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div
//       className="relative flex justify-between items-start border border-gray-200 bg-white rounded-md p-4 hover:shadow-sm transition"
//       ref={menuRef}
//     >
//       <div>
//         <span className="inline-block text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded mb-2 uppercase">
//           {data.tag}
//         </span>

//         <div className="text-gray-900 font-semibold text-sm sm:text-base">
//           {data.name}{" "}
//           <span className="font-bold text-gray-700">{data.phone_number}</span>
//         </div>

//         <div className="text-gray-700 text-sm mt-1 leading-relaxed">
//           {data.address_line_1}, {data.city_district}, {data.state} –{" "}
//           <span className="font-semibold">{data.pincode}</span>
//         </div>
//       </div>

//       {/* Options menu (3 dots) */}
//       <div className="relative">
//         <button
//           className="text-gray-500 hover:text-gray-700 p-2"
//           onClick={() => setOpenMenu((prev) => !prev)}
//         >
//           <HiDotsVertical className="w-5 h-5" />
//         </button>

//         {/* Dropdown menu */}
//         {openMenu && (
//           <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-md z-20 animate-fadeIn">
//             <button
//               onClick={() => {
//                 setOpenMenu(false);
//                 onEdit(data);
//               }}
//               className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//             >
//                Edit
//             </button>
//             <button
//               onClick={() => {
//                 setOpenMenu(false);
//                 onDelete(Number(data.id));
//               }}
//               className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer "
//             >
//               Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/shared/select-address/AddressCard.tsx
// 'use client';

// import React, { useCallback, useEffect, useRef } from 'react';
// import { Address } from '@/features/user-profile/types';
// import { HiDotsVertical } from 'react-icons/hi';
// import { useAppDispatch } from '@/store/hooks';
// import { deleteAddress } from '@/features/user-profile/userProfileThunks';

// interface Props {
//   data: Address;
//   selected?: boolean;
//   onSelect?: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
// }

// function formatLine(addr: Address) {
//   return `${addr.address_line_1}, ${addr.city_district}, ${addr.state} — ${addr.pincode}`;
// }

// /**
//  * AddressCard is keyboard accessible and announces role="radio" + aria-checked
//  * The selection indicator is a small circular "radio" in the top-left that turns blue when selected.
//  */
// function AddressCardInner({ data, selected = false, onSelect, onEdit, onDelete }: Props) {
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const [openMenu, setOpenMenu] = React.useState(false);

//   // keyboard select on Enter/Space
//   const handleKeyDown = useCallback(
//     (e: React.KeyboardEvent) => {
//       if (e.key === 'Enter' || e.key === ' ') {
//         e.preventDefault();
//         onSelect?.();
//       }
//     },
//     [onSelect]
//   );

//   // close menu if clicked outside
//   useEffect(() => {
//     const handler = (ev: MouseEvent) => {
//       if (openMenu && menuRef.current && !menuRef.current.contains(ev.target as Node)) {
//         setOpenMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [openMenu]);

//   const dispatch = useAppDispatch();
//   const deleteHandler = (id: string) =>
//   {
//     dispatch(deleteAddress(id))
//   }
//   return (
//     <div
//       role="radio"
//       aria-checked={selected}
//       tabIndex={0}
//       onKeyDown={handleKeyDown}
//       onClick={() => onSelect?.()}
//       className={[
//         'relative flex flex-col justify-between rounded-md p-4 border transition cursor-pointer min-h-[140px] bg-white',
//         selected ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:shadow',
//       ].join(' ')}
//     >
//       {/* top-left radio indicator */}
//       <span
//         className={[
//           'absolute -left-2 -top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-sm',
//           selected ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300',
//         ].join(' ')}
//         aria-hidden
//       >
//         {/* small inner dot when selected */}
//         {selected ? <span className="w-2 h-2 rounded-full bg-white inline-block" /> : null}
//       </span>

//       <div className="flex items-start justify-between">
//         <div className="pr-8">
//           {data.tag && (
//             <div className="inline-block text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded mb-2 uppercase">
//               {data.tag}
//             </div>
//           )}

//           <div className="text-sm sm:text-base font-semibold text-gray-900">
//             {data.name} <span className="font-normal text-gray-700 ml-2">{data.phone_number}</span>
//           </div>

//           <div className="text-sm text-gray-700 mt-1 leading-relaxed">{formatLine(data)}</div>
//         </div>

//         {/* options */}
//         <div ref={menuRef} className="relative">
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               setOpenMenu((s) => !s);
//             }}
//             className="p-1 text-gray-500 hover:text-gray-700"
//             aria-label="Open address options"
//           >
//             <HiDotsVertical className="w-5 h-5 cursor-pointer" />
//           </button>

//           {openMenu &&(
//             <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-md z-30">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setOpenMenu(false);
//                   onEdit?.();
//                 }}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => deleteHandler(data?.id)}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* subtle footer (optional) */}
//       <div className="mt-3 text-xs text-gray-500">
//         {selected ? (
//           <span className="font-medium text-primary">Selected for delivery</span>
//         ) : (
//           <span>Click to select</span>
//         )}
//       </div>
//     </div>
//   );
// }

// export default React.memo(AddressCardInner);

//before bug fixed 22-10-25
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Address } from '@/features/user-profile/types';
import { HiDotsVertical } from 'react-icons/hi';
import { useAppDispatch } from '@/store/hooks';
import { deleteAddress } from '@/features/user-profile/userProfileThunks';
import AddressDrawer from '@/components/shared/address-drawer/AddressDrawer';
import { setSelectedAddressForOrder } from '@/features/user-profile/userProfileSlice';

interface Props {
  data: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function formatLine(addr: Address) {
  return `${addr.address_line_1}, ${addr.city_district}, ${addr.state} — ${addr.pincode}`;
}

function AddressCardInner({ data, selected = false, onSelect, onEdit, onDelete }: Props) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);

  const dispatch = useAppDispatch();

  // keyboard select on Enter/Space
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.();
      }
    },
    [onSelect]
  );

  // close menu if clicked outside
  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      if (openMenu && menuRef.current && !menuRef.current.contains(ev.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  // Delete handler
  const deleteHandler = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenMenu(false);

      if (onDelete) {
        onDelete();
      } else if (data.id) {
        dispatch(deleteAddress(data.id));
      }
    },
    [data.id, onDelete, dispatch]
  );

  // Edit handler - opens the edit drawer directly
  const editHandler = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenMenu(false);
      setShowEditDrawer(true);

      if (onEdit) {
        onEdit();
      }
    },
    [onEdit]
  );

  const handleEditSubmit = () => {
    setShowEditDrawer(false);
    // The actual update is handled by the AddressForm component via Redux
  };

  const handleEditClose = () => {
    setShowEditDrawer(false);
  };

  return (
    <>
      <div
        role="radio"
        aria-checked={selected}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => onSelect?.()}
        className={[
          'relative flex flex-col justify-between rounded-md p-4 border transition cursor-pointer min-h-[140px] bg-white',
          selected ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:shadow',
        ].join(' ')}
      >
        {/* top-left radio indicator */}
        <span
          className={[
            'absolute -left-2 -top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-sm',
            selected ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300',
          ].join(' ')}
          aria-hidden
        >
          {selected ? <span className="w-2 h-2 rounded-full bg-white inline-block" /> : null}
        </span>

        <div className="flex items-start justify-between">
          <div className="pr-8">
            {data.tag && (
              <div className="inline-block text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded mb-2 uppercase">
                {data.tag}
              </div>
            )}

            <div className="text-sm sm:text-base font-semibold text-gray-900">
              {data.name}{' '}
              <span className="font-normal text-gray-700 ml-2">{data.phone_number}</span>
            </div>

            <div className="text-sm text-gray-700 mt-1 leading-relaxed">{formatLine(data)}</div>
            {data.address_line_2 && (
              <div className="text-sm text-gray-600 mt-1">{data.address_line_2}</div>
            )}
          </div>

          {/* options */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu((s) => !s);
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
              aria-label="Open address options"
            >
              <HiDotsVertical className="w-5 h-5 cursor-pointer" />
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-md z-30">
                <button
                  onClick={editHandler}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={deleteHandler}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* subtle footer */}
        <div className="mt-3 text-xs text-gray-500">
          {selected ? (
            <span className="font-medium text-primary">Selected for delivery</span>
          ) : (
            <span>Click to select</span>
          )}
        </div>
      </div>

      {/* Edit Address Drawer - Only render when showEditDrawer is true */}
      {showEditDrawer && (
        <AddressDrawer
          open={showEditDrawer}
          onOpenChange={setShowEditDrawer}
          editData={data}
          onEdit={handleEditSubmit}
        />

      )}
    </>
  );
}

export default React.memo(AddressCardInner);

//before bug fixed 22-10-25 by ck
// 'use client';

// import React, { useMemo, useState, useCallback, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import AddressCard from '@/app/user/addresses/components/AddressCard';
// import { Address } from '@/features/user-profile/types';
// import { AddressFormValues } from '@/app/user/addresses/components/AddressForm';
// import AddressDrawer from '@/components/shared/address-drawer/AddressDrawer';
// import { setSelectedAddressForOrder } from '@/features/user-profile/userProfileSlice';

// interface Props {
//   onEdit?: (address: Address) => void;
//   onDelete?: (id: string) => void;
//   showGrayButton?: boolean;
// }

// export default function SelectAddress({ onEdit, onDelete, showGrayButton }: Props) {
//   const dispatch = useDispatch();

//   // Get addresses and selected address from Redux store
//   const { user, selectedAddressForOrder, loading } = useSelector((state: any) => state.userProfile);

//   const addresses = user?.addresses || [];

//   // Find the default selected address ID
//   const defaultSelectedId = useMemo(() => {
//     // First priority: already selected address in Redux
//     if (selectedAddressForOrder?.id) {
//       return selectedAddressForOrder.id;
//     }
//     // Second priority: default address from user profile
//     const defaultAddress = addresses.find((a: Address) => a.is_default);
//     // Third priority: first address in the list
//     return defaultAddress?.id ?? addresses[0]?.id ?? null;
//   }, [addresses, selectedAddressForOrder]);

//   const [selectedId, setSelectedId] = useState<string | null>(defaultSelectedId);
//   const [localAddresses, setLocalAddresses] = useState<Address[]>(addresses);

//   // Sync local addresses with Redux addresses
//   useEffect(() => {
//     setLocalAddresses(addresses);
//   }, [addresses]);

//   // Sync local selectedId with Redux when addresses or default selection changes
//   useEffect(() => {
//     setSelectedId(defaultSelectedId);
//   }, [defaultSelectedId]);

//   const handleSelect = useCallback(
//     (id: string) => {
//       const selectedAddress = localAddresses.find((addr: Address) => addr.id === id);
//       if (selectedAddress) {
//         setSelectedId(id);
//         // Update selected address in Redux store
//         dispatch(setSelectedAddressForOrder(selectedAddress));
//       }
//     },
//     [localAddresses, dispatch]
//   );

//   const handleAddAddress = (data: AddressFormValues) => {
//     // Generate a guaranteed string ID
//     const newAddressId = Date.now().toString();

//     // Create new address with guaranteed string ID
//     const newAddress: Address = {
//       id: newAddressId,
//       name: data.name,
//       phone_number: data.phone_number,
//       address_line_1: data.address_line_1,
//       address_line_2: data.address_line_2,
//       city_district: data.city_district,
//       pincode: data.pincode,
//       state: data.state,
//       is_default: false,
//       tag: data.tag,
//     };

//     setLocalAddresses((prev) => [...prev, newAddress]);

//     // Auto-select the newly added address using the guaranteed string ID
//     setSelectedId(newAddressId);
//     dispatch(setSelectedAddressForOrder(newAddress));
//   };

//   // Show loading state
//   if (loading && localAddresses.length === 0) {
//     return (
//       <div className="w-full">
//         <h2 className="text-lg md:text-xl font-semibold mb-4">Select Delivery Address</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
//           <div className="animate-pulse bg-gray-200 rounded-md p-4 min-h-[140px]"></div>
//           <div className="animate-pulse bg-gray-200 rounded-md p-4 min-h-[140px]"></div>
//         </div>
//       </div>
//     );
//   }

//   // Show empty state if no addresses
//   if (localAddresses.length === 0) {
//     return (
//       <div className="w-full ">
//         <h2 className="text-lg md:text-xl font-semibold mb-4">Select Delivery Address</h2>
//         <div className="text-center py-8 flex item-center justify-center">
//           <AddressDrawer
//             onAdd={handleAddAddress}
//             buttonLabel="Add Your First Address"
//             showGrayButton={showGrayButton}
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <h2 className="text-lg md:text-xl font-semibold mb-4">Select Delivery Address</h2>

//       <div
//         role="radiogroup"
//         aria-label="Saved delivery addresses"
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8"
//       >
//         {/* Add New Address Drawer */}
//         <AddressDrawer
//           onAdd={handleAddAddress}
//           buttonLabel="Add New Address"
//           showGrayButton={showGrayButton}
//         />

//         {/* Address Cards */}
//         {localAddresses.map((addr: Address) => (
//           <AddressCard
//             key={addr.id || 'temp-id'}
//             data={addr}
//             selected={selectedId === addr.id}
//             onSelect={() => addr.id && handleSelect(addr.id)}
//             onEdit={() => onEdit?.(addr)}
//             onDelete={() => addr.id && onDelete?.(addr.id)}
//           />
//         ))}
//       </div>

//       {/* Display currently selected address info */}
//       {selectedAddressForOrder && (
//         <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
//           <p className="text-sm text-green-800">
//             <strong>Selected for delivery:</strong> {selectedAddressForOrder.name} -{' '}
//             {selectedAddressForOrder.address_line_1}, {selectedAddressForOrder.city_district}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

//after bug fixed 22-10-25 by ck
'use client';

import React, { useMemo, useCallback } from 'react';

import AddressCard from '@/app/user/addresses/components/AddressCard';
import { Address } from '@/features/user-profile/types';
import AddressDrawer from '@/components/shared/address-drawer/AddressDrawer';
import {
  setSelectedAddressForOrder,
  clearSelectedAddressForOrder,
} from '@/features/user-profile/userProfileSlice';
import { deleteAddress } from '@/features/user-profile/userProfileThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface Props {
  showGrayButton?: boolean;
}

export default function SelectAddress({ showGrayButton }: Props) {
  const dispatch = useAppDispatch();

  // Get addresses and selected address from Redux store
  const { user, selectedAddressForOrder, loading } = useAppSelector((state) => state.userProfile);
  const addresses = user?.addresses || [];

  // Find the default selected address ID
  const selectedId = useMemo(() => {
    return selectedAddressForOrder?.id || null;
  }, [selectedAddressForOrder]);

  const handleSelect = useCallback(
    (id: string) => {
      const selectedAddress = addresses.find((addr: Address) => addr.id === id);
      if (selectedAddress) {
        // Update selected address in Redux store
        dispatch(setSelectedAddressForOrder(selectedAddress));
      }
    },
    [addresses, dispatch]
  );

  // Handle edit address
  const handleEdit = useCallback((address: Address) => {
    // The actual edit is handled by the AddressDrawer and AddressForm components
    // This is just for any additional logic you might need
  }, []);

  // Handle delete address
  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteAddress(id))
        .unwrap()
        .then(() => {
          // After successful deletion, check if we need to update selected address
          if (selectedAddressForOrder?.id === id) {
            // If the deleted address was the selected one, select another address
            const remainingAddresses = addresses.filter((addr) => addr.id !== id);
            if (remainingAddresses.length > 0) {
              // Select the first available address
              dispatch(setSelectedAddressForOrder(remainingAddresses[0]));
            } else {
              // No addresses left, clear selection
              dispatch(clearSelectedAddressForOrder());
            }
          }
        })
        .catch((error) => {});
    },
    [addresses, selectedAddressForOrder, dispatch]
  );

  // Show loading state
  if (loading && addresses.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Select Delivery Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
          <div className="animate-pulse bg-gray-200 rounded-md p-4 min-h-[140px]"></div>
          <div className="animate-pulse bg-gray-200 rounded-md p-4 min-h-[140px]"></div>
        </div>
      </div>
    );
  }

  // Show empty state if no addresses
  if (addresses.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Select Delivery Address</h2>
        <div className="text-center py-8 flex item-center justify-center">
          <AddressDrawer buttonLabel="Add Your First Address" showGrayButton={showGrayButton} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Select Delivery Address</h2>

      <div
        role="radiogroup"
        aria-label="Saved delivery addresses"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8"
      >
        {/* Add New Address Drawer */}
        <AddressDrawer buttonLabel="Add New Address" showGrayButton={showGrayButton} />

        {/* Address Cards */}
        {addresses.map((addr: Address) => (
          <AddressCard
            key={addr.id}
            data={addr}
            selected={selectedId === addr.id}
            onSelect={() => addr.id && handleSelect(addr.id)}
            onEdit={() => handleEdit(addr)}
            onDelete={() => addr.id && handleDelete(addr.id)}
          />
        ))}
      </div>

      {/* Display currently selected address info */}
      {selectedAddressForOrder && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            <strong>Selected for delivery:</strong> {selectedAddressForOrder.name} -{' '}
            {selectedAddressForOrder.address_line_1}, {selectedAddressForOrder.city_district}
          </p>
        </div>
      )}
    </div>
  );
}

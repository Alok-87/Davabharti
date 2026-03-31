// "use client";
// import { useEffect, useState } from "react";
// import { HiPlus } from "react-icons/hi";
// import { IoClose } from "react-icons/io5";
// import AddressCard, { Address } from "./components/AddressCard";
// import AddressForm, { AddressFormValues } from "./components/AddressForm";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { fetchUserProfile } from "@/features/user-profile/userProfileThunks";

// const initialAddresses: Address[] = [
//   {
//     id: 1,
//     name: "Alok Kumar",
//     phone: "8709483371",
//     address: "Flat No. 203, Shanti Residency, Boring Road",
//     city: "Patna",
//     state: "Bihar",
//     pincode: "800001",
//     tag: "Home",
//   },
//   {
//     id: 2,
//     name: "Rohit Sharma",
//     phone: "9521348750",
//     address: "Block 4, Technopark Tower, Sector 62",
//     city: "Noida",
//     state: "Uttar Pradesh",
//     pincode: "201309",
//     tag: "Office",
//   },
// ];

// export default function Addresses() {
//   const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
//   const [showDrawer, setShowDrawer] = useState(false);

//   const handleAddAddress = (data: AddressFormValues) => {
//     const newAddress: Address = { id: Date.now(), ...data };
//     setAddresses((prev) => [...prev, newAddress]);
//     setShowDrawer(false);
//   };

//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     dispatch(fetchUserProfile());
//   }, [])

//   const { user } = useAppSelector((state) => state.userProfile);
//   ;

//   return (
//     <div className="bg-gray-50 p-4 sm:p-6">
//       <div className="max-w-5xl mx-auto space-y-4">
//         {/* Header */}
//         <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
//           Manage Addresses
//         </h2>

//         {/* Add New Button */}
//         <button
//           onClick={() => setShowDrawer(true)}
//           className="flex items-center gap-2 text-blue-600 font-medium text-sm border border-gray-200 rounded-md px-4 py-3 bg-white hover:bg-blue-50 transition cursor-pointer"
//         >
//           <HiPlus className="w-5 h-5" />
//           ADD A NEW ADDRESS
//         </button>

//         {/* Address List */}
//         <div className="space-y-3">
//           {user?.addresses.map((addr) => (
//             <AddressCard key={addr.id} data={addr} />
//           ))}
//         </div>
//       </div>

//       {/* Slide Drawer */}
//       <div
//         className={`fixed inset-0 z-50 flex justify-end transition-transform duration-300 ${showDrawer ? "translate-x-0" : "translate-x-full"
//           }`}
//       >
//         {/* Transparent Overlay (click to close) */}
//         <div
//           className={`flex-1 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${showDrawer ? "opacity-100" : "opacity-0 pointer-events-none"
//             }`}
//           onClick={() => setShowDrawer(false)}
//         ></div>

//         {/* Drawer Panel */}
//         <div className="w-full sm:w-[400px] md:w-[480px] bg-white h-full shadow-2xl flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between border-b px-5 py-4">
//             <h3 className="text-lg font-semibold text-gray-800">Add New Address</h3>
//             <button
//               onClick={() => setShowDrawer(false)}
//               className="p-2 rounded-full hover:bg-gray-100 transition"
//             >
//               <IoClose className="text-2xl text-gray-600 cursor-pointer" />
//             </button>
//           </div>

//           {/* Scrollable Form Area */}
//           <div className="flex-1 overflow-y-auto p-5">
//             <AddressForm onSubmit={handleAddAddress} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';
import { useEffect } from 'react';
import AddressCard from './components/AddressCard';
import AddressDrawer from '@/components/shared/address-drawer/AddressDrawer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile } from '@/features/user-profile/userProfileThunks';
import { IoLocationOutline } from 'react-icons/io5';
import { getToken } from '@/features/auth/utils/tokenManager';
import LocationBar from './components/LocationBar';

export default function Addresses() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.userProfile);

  useEffect(() => {
    const token = getToken(); // ✅ use getToken here
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  // Remove this local state update - let Redux handle it
  // const handleAddAddress = (data: any) => {
  //   setAddresses((prev) => [...prev, { id: Date.now().toString(), ...data }]);
  // };

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

  const addresses = user?.addresses || [];

  return (
    <div className="bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Manage Addresses</h2>

        {/* Remove onAdd prop since Redux handles it */}
        <AddressDrawer buttonLabel="Add a New Address" />

        {!addresses || addresses.length === 0 ? (
          <div className="flex justify-center items-center p-10 lg:ml-70 lg:mt-20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <IoLocationOutline className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Address found</h3>
              <p className="text-gray-600">We couldn't find the Address you're looking for.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {addresses.map((addr) => (
              <AddressCard key={addr.id} data={addr} />
            ))}
          </div>
        )}
      </div>
     
    </div>
  );
}

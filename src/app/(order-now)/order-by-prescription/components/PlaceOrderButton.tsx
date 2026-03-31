'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createPrescriptionOrder, fetchOrders } from '@/features/order/orderThunks';
import { useRouter } from 'next/navigation';
import ProfileAlertDialog from '@/components/shared/alert/ProfileAlert';

function PlaceOrderButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.userProfile);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [followUpAction, setFollowUpAction] = useState<'fullOrder' | 'callMe'>('fullOrder');


  const selectedPrescriptionUrls = useAppSelector(
    (state) => state.prescription.quickOrderSelectedPrescription
  );
  const selectedAddress = useAppSelector((state) => state.userProfile.selectedAddressForOrder);
  const { loading } = useAppSelector((state) => state.order);

  const [localError, setLocalError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    if (!selectedAddress || !selectedPrescriptionUrls?.length) return;
    if (!user?.email || !user?.phone_number) {
      setShowProfileDialog(true);
      return;
    }


    const { name, phone_number, address_line_1, address_line_2, city_district, pincode, state, lat, lng } =
      selectedAddress;

    const payload = {
      deliveryAddress: {
        name,
        phone_number,
        address_line_1,
        address_line_2,
        city_district,
        pincode,
        state,
        lat,
        lng,
      },
      followUpAction: followUpAction,
      prescription: selectedPrescriptionUrls,
    };

    setLocalError(null);

    try {
      const result = await dispatch(createPrescriptionOrder(payload));

      if (createPrescriptionOrder.fulfilled.match(result)) {
        // ✅ Refresh the user's orders
        await dispatch(fetchOrders());
        // ✅ Then navigate
        router.push('/user/orders');
      } else {
        throw new Error(
          typeof result.payload === 'string'
            ? result.payload
            : (result.payload as any)?.message || 'Order placement failed'
        );
      }
    } catch (err: any) {
      setLocalError(err?.message || 'Something went wrong while placing your order.');
    }
  }

  const isDisabled = !selectedPrescriptionUrls?.length || !selectedAddress || loading;

  return (
    <>
      {/* Alert */}
      <ProfileAlertDialog
        open={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
      />
      <div className="w-full flex flex-col items-center md:items-end gap-2">
        <FollowUpAction value={followUpAction} onChange={setFollowUpAction} />

        <button
          onClick={handlePlaceOrder}
          disabled={isDisabled}
          className={`w-full md:w-[50%]  flex items-center justify-center gap-2 px-4 py-2 rounded text-white transition ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:opacity-80'
            }`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          )}
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>

        {localError && <p className="text-red-500 text-sm">{localError}</p>}
      </div>
    </>
  );
}


interface FollowUpActionProps {
  value: 'fullOrder' | 'callMe';
  onChange: (val: 'fullOrder' | 'callMe') => void;
}

const FollowUpAction = ({ value, onChange }: FollowUpActionProps) => {
  return (
    <div className="w-full flex items-center justify-center gap-4 py-6">

      {/* FULL ORDER OPTION */}
      <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
        <input
          type="radio"
          value="fullOrder"
          checked={value === "fullOrder"}
          onChange={() => onChange("fullOrder")}
          className="mt-1 text-primary focus:ring-primary"
        />
        <div className="flex-1">
          <span className="text-gray-900 font-semibold">Order as per prescription</span>
          <p className="text-sm text-gray-600 mt-1">
            Upload prescription & get full quotation from our support team.
          </p>
        </div>
      </label>

      {/* CALL ME OPTION */}
      <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
        <input
          type="radio"
          value="callMe"
          checked={value === "callMe"}
          onChange={() => onChange("callMe")}
          className="mt-1 text-primary focus:ring-primary"
        />
        <div className="flex-1">
          <span className="text-gray-900 font-semibold">Call me</span>
          <p className="text-sm text-gray-600 mt-1">
            Our pharmacist will call you & confirm the medicines.
          </p>
        </div>
      </label>
    </div>
  );
};


export default PlaceOrderButton;

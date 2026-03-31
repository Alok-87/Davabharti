
'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setShowReturnDrawer } from '@/features/user-profile/userProfileSlice';
import { fetchOrderDetail, returnOrder } from '@/features/order/orderThunks';
import ReturnUploadCard from './ReturnUploadCard';
import type { ReturnOrderPayload } from '@/features/order/types';

interface ReturnFormProps {
  orderId: string;
}

type ReturnFormData = {
  reasonOfReturn: string;
  refundDestination: 'WALLET' | 'BANK_ACCOUNT';
  upiIdForCODRefund?: string;
};

export default function ReturnForm({ orderId }: ReturnFormProps) {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, watch, reset } = useForm<ReturnFormData>();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // WATCH SELECTED REFUND MODE
  const refundDestination = watch('refundDestination');

  const onSubmit = (data: ReturnFormData) => {
    const payload: ReturnOrderPayload = {
      orderId,
      reasonOfReturn: data.reasonOfReturn,
      images: uploadedImages,
      refundDestination: data.refundDestination,
      upiIdForCODRefund: data.refundDestination === 'BANK_ACCOUNT' ? data.upiIdForCODRefund || '' : '',
    };

    dispatch(returnOrder(payload))
      .unwrap()
      .then(() => {
        reset();
        setUploadedImages([]);
        dispatch(setShowReturnDrawer(false));
        dispatch(fetchOrderDetail(orderId));
      })
      .catch((err) => {
        console.error('❌ Return submission failed:', err);
      });
  };

  const { selectedOrder } = useAppSelector((s) => s.order);
  const order = selectedOrder.order;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Upload Proof */}
      <label className="block text-sm font-medium mb-1">Upload (optional)</label>
      <ReturnUploadCard onUploadComplete={setUploadedImages} />

      {/* REFUND MODE */}
      <div>
        <label className="block text-sm font-medium mb-1">Where do you want your refund? *</label>

        <select
          {...register('refundDestination', { required: true })}
          className="border border-gray-300 rounded-md w-full px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          defaultValue=""
        >
          <option value="" disabled>Select an option</option>
          <option value="WALLET_CASH">Add to Wallet (Cash Wallet)</option>
          <option value="BANK_ACCOUNT">Refund to Bank Account (UPI)</option>
        </select>
      </div>

      {/* UPI INPUT — only visible when ACCOUNT is selected */}
      {refundDestination === 'BANK_ACCOUNT' && order.payment?.paymentMethod === 'COD' && (
          <div>
            <label className="block text-sm font-medium mb-1">UPI ID *</label>
            <input
              {...register('upiIdForCODRefund', { required: true })}
              className="border border-gray-300 rounded-md w-full px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Write your UPI ID..."
            />
          </div>
        )}


      {/* Reason */}
      <div>
        <label className="block text-sm font-medium mb-1">Reason *</label>
        <textarea
          {...register('reasonOfReturn', { required: true })}
          className="border border-gray-300 rounded-md w-full px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          placeholder="Write return reason..."
          rows={3}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary/90 transition cursor-pointer"
      >
        Submit Return
      </button>

      {/* Cancel */}
      <button
        type="button"
        onClick={() => dispatch(setShowReturnDrawer(false))}
        className="w-full bg-gray-200 py-2.5 rounded-md hover:bg-gray-300 transition cursor-pointer"
      >
        Cancel
      </button>
    </form>
  );
}

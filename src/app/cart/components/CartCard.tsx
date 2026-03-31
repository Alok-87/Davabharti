

'use client';

import { FiTrash2 } from 'react-icons/fi';
import { useAppDispatch } from '@/store/hooks';
import {
  deleteCartItem,
  updateCart,
} from '@/features/cart/cartThunks';
import { useState } from 'react';

interface CartCardProps {
  item: {
    id: string;
    quantity: number;
    priceAtTime: number;
    medicine: {
      id: string;
      productName: string;
      productCode: string;
      prescriptionRequired: boolean;
      packagingSize: string;
      images: string[];
    };
  };
  onCartUpdate?: () => void; // ✅ Add this prop for refresh callback
}

export default function CartCard({ item, onCartUpdate }: CartCardProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);



  const prescriptionLabel = item.medicine.prescriptionRequired
    ? 'Item requires prescription'
    : 'Prescription not required';

  // ✅ Improved quantity change handler
  const handleQuantityChange = async (newQty: number) => {

    if (newQty === quantity) return; // No change needed

    setQuantity(newQty);
    setUpdating(true);

    try {
      await dispatch(
        updateCart({
          id: item.id,
          payload: { quantity: newQty },
        })
      ).unwrap();

      // ✅ Success - trigger parent refresh instead of reload
      onCartUpdate?.();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // ✅ Revert local state on error
      setQuantity(item.quantity);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Improved delete handler
  const handleDelete = async (e: React.MouseEvent) => {
    setDeleting(true);

    try {
      await dispatch(deleteCartItem(item.id)).unwrap();
      // ✅ Success - trigger parent refresh instead of reload
      onCartUpdate?.();
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setDeleting(false);
    }
  };
  const placeholderImage = "/no-image.png";
  const imageSrc =
    item.medicine.images && item.medicine.images.length > 0
      ? item.medicine.images[0]
      : placeholderImage; // Use a proper placeholder

  const handleMinus = () => {
    const newQty = Math.max(quantity - 1, 1);
    handleQuantityChange(newQty);
  };

  const handlePlus = () => {
    const newQty = quantity + 1;
    handleQuantityChange(newQty);
  };


  return (
    <div className="border border-gray-200 rounded-md bg-white shadow-sm my-4">
      {/* 💊 Prescription Info */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-md">
        <h3 className="text-gray-700 text-xs sm:text-sm font-medium">{prescriptionLabel}</h3>
        <div className=" flex items-center justify-end">
              {/* <p className="text-xs sm:text-sm text-gray-600">Delivery in 5 days</p> */}

              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`flex items-center gap-1 text-primary text-xs sm:text-sm ${deleting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                  }`}
              >
                <FiTrash2 className="w-4 h-4" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
      </div>

      {/* 🩺 Medicine Content */}
      <div className="flex items-start justify-between px-5 py-4 sm:py-5">
        {/* Medicine Image */}
        <div className="w-24 h-20 sm:w-35 sm:h-28 shrink-0">
          <img
            src={imageSrc}
            alt={item?.medicine?.productName || "Product image"}
            className="w-full h-full p-2 object-contain rounded-md cursor-pointer"
            onError={(e) => {
              e.currentTarget.src = placeholderImage;
            }}
          />
        </div>

        {/* Medicine Details */}
        <div className="flex-1 ml-4 sm:ml-6">
          {/* Name + Quantity */}
            <div className="flex-col justify-between items-start">
              <h3 className="text-gray-900 font-medium text-sm sm:text-base cursor-pointer">
                {item?.medicine?.productName}
              </h3>
              <p className="text-gray-500 text-xs mt-1">{item.medicine.packagingSize}</p>

              <p className="mt-1 font-semibold text-gray-900">₹{item.priceAtTime.toFixed(2)}</p>


            </div>

           
          



          <div className="mt-3 ">
            <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-300 bg-white w-auto max-w-[160px]">
              <button
                className="h-9 w-10 flex items-center justify-center text-gray-600 text-base hover:bg-gray-100 active:bg-gray-200"
                onClick={handleMinus}
                type="button"
              >
                −
              </button>

              <div className="h-9 w-10 flex items-center justify-center border-x border-gray-300 text-sm font-semibold text-gray-900">
                {quantity}
              </div>

              <button
                className="h-9 w-10 flex items-center justify-center text-gray-600 text-base hover:bg-gray-100 active:bg-gray-200"
                onClick={handlePlus}
                type="button"
              >
                +
              </button>
            </div>
          </div>

          {/* Delivery Info + Delete */}
            
        </div>
         
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCustomerOffers } from '@/features/offers/offerThunks';
import { applyOffer, removeOffer, setReferral } from '@/features/offers/offerSlice';
import { setShowTermsAndConditions } from '@/features/user-profile/userProfileSlice';
import { Toast } from '@/components/ui/toast';
import api from '@/lib/axios';
import { RootState } from '@/store';
import { FiGift } from 'react-icons/fi';

function getOfferIneligibilityReasonForPrescriptionOrder(
  offer: any,
  order: any,
  baseAmount: number
): string | null {
  const lineItems: any[] = order?.lineItems ?? [];

  const hasPrescriptionItem = lineItems.some(
    (li) => li.prescriptionRequired === true || li.medicine?.prescriptionRequired === true
  );

  const hasNonPrescriptionItem = lineItems.some(
    (li) => li.prescriptionRequired === false || li.medicine?.prescriptionRequired === false
  );

  const minValue = Number(offer.minimumOrderValue || 0);
  if (baseAmount < minValue) {
    return `This coupon requires a minimum order value of ₹${minValue.toFixed(2)}.`;
  }

  switch (offer.appliesTo) {
    case 'ANY':
      return null;

    case 'OTC':
      return hasNonPrescriptionItem ? null : 'This coupon is only valid on OTC items.';

    case 'PRESCRIPTION':
      return hasPrescriptionItem ? null : 'This coupon is only valid on prescription items.';

    case 'SPECIFIC_CATEGORY': {
      const targetCategoryId = offer.medicineCategoryId;
      if (!targetCategoryId) return 'This coupon is valid only for specific categories.';

      const allItemsInCategory = lineItems.every((li) =>
        li.categories?.some((cat: any) => cat.id === targetCategoryId) ||
        li.medicine?.categories?.some((cat: any) => cat.id === targetCategoryId)
      );

      return allItemsInCategory ? null : 'This coupon requires all items to be from a specific category.';
    }

    default:
      return null;
  }
}

export default function PrescriptionCouponsModal({
  isOpen,
  onClose,
  order,
  baseAmount,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  baseAmount: number;
}) {
  const dispatch = useAppDispatch();
  const { offers, appliedOffer } = useAppSelector((s: RootState) => s.offers);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    dispatch(fetchCustomerOffers());
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const lineItems: any[] = order?.lineItems ?? [];
  const hasPrescriptionItem = lineItems.some((li) => li.prescriptionRequired === true || li.medicine?.prescriptionRequired === true);

  const visibleOffers = offers.filter((o: any) => {
    if (o.isDefault && o.appliesTo === 'PRESCRIPTION') return false;
    if (o.isDefault && o.category === 'CASHBACK' && hasPrescriptionItem) return false;
    return ['PRESCRIPTION', 'OTC', 'ANY', 'SPECIFIC_CATEGORY'].includes(o.appliesTo);
  });

  const handleApply = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const matchingOffer = offers.find((o: any) => o.code?.toUpperCase() === trimmed);
      if (matchingOffer) {
        const reason = getOfferIneligibilityReasonForPrescriptionOrder(matchingOffer, order, baseAmount);
        if (reason) {
          setError(reason);
          Toast(reason);
          setLoading(false);
          return;
        }
      }

      const { data: validateRes } = await api.post(`/offer/validate`, {
        offerCode: trimmed,
        orderType: 'PRESCRIPTION',
        items: lineItems.map((li: any) => ({
          medicineId: li.medicineId || li.medicine?.id,
          quantity: li.quantity,
        })),
      });

      if (!validateRes || validateRes.status !== 'success') {
        const msg = validateRes?.message || 'Failed to validate coupon.';
        setError(msg);
        Toast(msg);
        return;
      }

      if (!validateRes.data.isValid) {
        const msg = validateRes.data?.reason || 'This coupon is not applicable.';
        setError(msg);
        Toast(msg);
        return;
      }

      if (validateRes.data.isReferral) dispatch(setReferral(validateRes.data));
      await dispatch(applyOffer(trimmed));
      setSuccess('Coupon applied successfully.');
      setInput(trimmed);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to apply coupon.';
      setError(msg);
      Toast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    await dispatch(removeOffer());
    setInput('');
    setError(null);
    setSuccess(null);
    Toast('Offer removed');
  };

  const clickHandler = (terms: string | null) => {
    dispatch(setShowTermsAndConditions(terms));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Coupons & Offers</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer text-xl">×</button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="flex items-center gap-2 p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:outline-none"
            />
            <button
              disabled={!input.trim() || loading}
              onClick={() => handleApply(input)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                input.trim() && !loading ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Applying…' : 'Apply'}
            </button>
          </div>

          {success && <p className="text-green-600 text-sm px-4 py-2">{success}</p>}
          {error && <p className="text-red-600 text-sm px-4 py-2">{error}</p>}

          <div className="p-4">
            {visibleOffers.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                <FiGift className="text-4xl mb-3 text-gray-400" />
                <p className="text-sm font-medium">No coupons available</p>
              </div>
            ) : (
              visibleOffers.map((c: any) => (
                <div key={c.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-primary font-semibold text-base sm:text-lg">{c.code}</h3>
                        <span className="bg-primary text-white rounded-full text-[8px] px-2 py-0.5">{c.category}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{c.description || c.title}</p>

                      {c.termsAndConditions && (
                        <p
                          onClick={() => clickHandler(c.termsAndConditions)}
                          className="text-xs text-primary underline mt-2 inline-block hover:text-primary/80 cursor-pointer"
                        >
                          Terms & conditions
                        </p>
                      )}
                    </div>

                    {appliedOffer?.code?.toUpperCase() === c.code?.toUpperCase() ? (
                      <button
                        onClick={handleRemove}
                        className="border border-red-500 text-red-500 text-xs sm:text-sm font-medium px-3 py-2 rounded-md hover:bg-red-500 hover:text-white"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(c.code)}
                        className="border border-primary text-primary hover:bg-primary hover:text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-md"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
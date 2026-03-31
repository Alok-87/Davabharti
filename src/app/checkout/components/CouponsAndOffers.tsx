'use client';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { fetchCustomerOffers } from '@/features/offers/offerThunks';
import CouponCard from './CouponCard';
import { applyOffer, removeOffer, setReferral } from '@/features/offers/offerSlice';
import api from '@/lib/axios';
import { Toast } from '@/components/ui/toast';
import { FiGift } from 'react-icons/fi';


export default function CouponsAndOffers({
  onClose,
  total,
  orderType = "PRODUCT",
  orderItems = []
}: {
  onClose: () => void;
  total: number;
  orderType: "PRODUCT" | "PRESCRIPTION";
  orderItems?: any[];
}) {

  const dispatch = useAppDispatch();

  const { offers, appliedOffer } = useAppSelector((state) => state.offers);
  const { carts } = useAppSelector((state) => state.cart);

  // -------------------------------------------------------------------
  // FLAG: UI state
  // -------------------------------------------------------------------
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // -------------------------------------------------------------------
  // FLAG: Extract items from cart early
  // -------------------------------------------------------------------
  const rawCartItems = carts[0]?.items || [];
  const items = orderType === "PRESCRIPTION" ? orderItems : rawCartItems;

  // ===============================
  // 1️⃣ Calculate subtotals before coupn apply
  // ===============================
  let prescriptionSubtotal = 0;
  let otcSubtotal = 0;

  rawCartItems?.forEach((item: any) => {
    const price = Number(item.priceAtTime || 0);
    const quantity = Number(item.quantity || 1); // default 1

    const totalPrice = price * quantity;

    if (item.medicine?.prescriptionRequired) {
      prescriptionSubtotal += totalPrice;
    } else {
      otcSubtotal += totalPrice;
    }
  });

  console.log('prescriptionSubtotal', prescriptionSubtotal);
  console.log('otcSubtotal', otcSubtotal);

  const subtotalBeforDiscount = prescriptionSubtotal + otcSubtotal;

  // Prescription helpers
  const hasPrescriptionItem = items.some((i: any) => i.medicine.prescriptionRequired);
  const hasNonPrescriptionItem = items.some((i: any) => !i.medicine.prescriptionRequired);

  const defaultOffer = offers.find((o) => o.isDefault === true);
  const defaultOfferApplied = defaultOffer && hasPrescriptionItem && !hasNonPrescriptionItem;

  // -------------------------------------------------------------------
  // FLAG: SPECIFIC_CATEGORY rule → ALL items must belong
  // -------------------------------------------------------------------
  const allItemsBelongToCategory = (categoryId: string) => {
    return items.every((i: any) =>
      i.medicine.categories?.some((c: any) => c.id === categoryId)
    );
  };

  // -------------------------------------------------------------------
  // FLAG: Determines if an offer is applicable to the cart
  // -------------------------------------------------------------------

  const defaultOfferEligible = defaultOffer && hasPrescriptionItem && prescriptionSubtotal >= defaultOffer.minimumOrderValue;


  const isEligibleBasedOnAppliesTo = (offer: any) => {
    // ❌ Block other cashback offers if default cashback is already applied
    if (defaultOfferEligible && offer.category === 'CASHBACK') {
      return false;
    }
    if (offer.appliesTo === 'ANY') return true;

    if (offer.appliesTo === 'OTC' && hasNonPrescriptionItem && otcSubtotal >= offer.minimumOrderValue) return true;

    if (offer.appliesTo === 'PRESCRIPTION' && hasPrescriptionItem && prescriptionSubtotal >= offer.minimumOrderValue) {
      return true;
    }

    if (offer.appliesTo === 'SPECIFIC_CATEGORY') {
      return allItemsBelongToCategory(offer.medicineCategoryId);
    }

    return false;
  };


  // -------------------------------------------------------------------
  // FLAG: Human-friendly message explaining why coupon is blocked
  // -------------------------------------------------------------------
  const reasonsForIneligibility = (offer: any) => {
    if (offer.appliesTo === 'OTC' && hasNonPrescriptionItem)
      return null;

    if (offer.appliesTo === 'PRESCRIPTION' && hasPrescriptionItem)
      return null;

    if (offer.appliesTo === "SPECIFIC_CATEGORY" && !allItemsBelongToCategory(offer.medicineCategoryId))
      return "This coupon applies only to a specific product category, and all items in your cart must belong to that category.";

    return "This coupon is not applicable to your cart items.";
  };

  // -------------------------------------------------------------------
  // FLAG: Fetch offers on modal open
  // -------------------------------------------------------------------
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    dispatch(fetchCustomerOffers());

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // -------------------------------------------------------------------
  // FLAG: Apply coupon handler (validation + apply)
  // -------------------------------------------------------------------
  const handleApply = async (code: string) => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);


    // 🔍 Pre-check eligibility before calling API
    const offerObj = offers.find((o: any) => o.code === code);

    if (offerObj && !isEligibleBasedOnAppliesTo(offerObj)) {
      const msg = reasonsForIneligibility(offerObj);
      setError(msg);
      Toast(msg);
      setLoading(false);
      return;
    }

    try {
      const { data: validateRes } = await api.post(`/offer/validate`, {
        offerCode: code,
        orderType,
        items: items.map((m: any) => ({
          medicineId: m.medicine.id,
          quantity: m.quantity
        }))
      });

      if (!validateRes || validateRes.status !== "success") {
        const msg = validateRes?.message || "Something went wrong.";
        setError(msg);
        Toast(msg);
        setLoading(false);
        return;
      }

      if (!validateRes.data.isValid) {
        const msg = validateRes.data?.reason || "Offer is invalid.";
        setError(msg);
        Toast(msg);
        setLoading(false);
        return;
      }

      if (validateRes.data.isReferral) {
        console.log('console', validateRes.data);
        dispatch(setReferral(validateRes.data));
      }
      if (validateRes.data.isCashback) {
        Toast(`You got Coin Cashback on order`);
      }
      else {
        Toast(`You got INR ${validateRes.data.discount} discount on order`);
      }

      await dispatch(applyOffer(code));
      setSuccess("Coupon applied successfully");
      setInput(code);

    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to apply coupon";
      setError(msg);
      Toast(msg);
    } finally {
      setLoading(false);
    }
  };



  // -------------------------------------------------------------------
  // FLAG: Remove coupon
  // -------------------------------------------------------------------
  const handleRemove = async () => {
    await dispatch(removeOffer());
    setInput('');
    setError(null);
    setSuccess(null);
    Toast('Offer removed');
  };

  // Click → auto apply
  const autoApply = async (code: string) => {
    setInput(code);
    await handleApply(code);
    onClose();
  };

  // -------------------------------------------------------------------
  // FLAG: RENDER
  // -------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Coupons & Offers</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <IoClose className="text-2xl cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">

          {/* Input */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:outline-none"
            />

            <button
              disabled={!input.trim()}
              onClick={() => handleApply(input)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${input.trim()
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
            >
              {loading ? "Applying…" : "Apply"}
            </button>
          </div>

          {/* Success / Error */}
          {success && <p className="text-green-600 text-sm px-4 py-2">✓ {success}</p>}
          {error && <p className="text-red-600 text-sm px-4 py-2">{error}</p>}

          {/* Remove coupon */}
          {/* {appliedOffer && (
            <div className="px-4 pb-2">
              <button onClick={handleRemove} className="text-red-600 text-sm underline">
                Remove Applied Coupon
              </button>
            </div>
          )} */}

          {/* Coupon List */}
          <div className="p-4">
            {
              offers.length > 1 && (
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                  Available coupons
                </h3>
              )
            }


            {(() => {
              const visibleOffers =
                offers?.filter(
                  (o: any) => !(o.appliesTo === "PRESCRIPTION" && o.isDefault)
                ) || [];


              if (visibleOffers.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                    <FiGift className="text-4xl mb-3 text-gray-400" />
                    <p className="text-sm font-medium">No coupons available</p>
                    <p className="text-xs text-gray-400">
                      Please check again later
                    </p>
                  </div>
                );
              }

              return visibleOffers.map((c: any) => (
                <CouponCard
                  key={c.id}
                  code={c.code}
                  description={c.description}
                  terms={c.termsAndConditions}
                  category={c.category}
                  disabled={
                    !isEligibleBasedOnAppliesTo(c) ||
                    total < c.minimumOrderValue ||
                    (c.category === "CASHBACK" && defaultOfferApplied === true)
                  }
                  onApply={() => autoApply(c.code)}
                  handleRemove={handleRemove}
                  minimumOrderValue={c.minimumOrderValue} // "199"
                  appliesTo={c.appliesTo} // "ANY"
                  discountType={c.discountType} // "FLAT"
                  discountValue={c.discountValue}
                />
              ));
            })()}
          </div>

        </div>
      </div>
    </div>
  );
}

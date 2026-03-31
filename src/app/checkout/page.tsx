'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import SelectAddress from '@/components/shared/select-address/SelectAddress';
import CouponsAndOffers from './components/CouponsAndOffers';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { fetchCart } from '@/features/cart/cartThunks';
import RequiresPrescription from './components/RequiresPrescription';
import SelectPatient from '@/components/shared/select-pacient/SelectPacient';
import PrescriptionSection from '@/components/shared/prescription-section/PrescriptionSection';
import Loader from '@/components/ui/loader';
import { GoArrowLeft } from 'react-icons/go';
import PatientDrawer from '@/components/shared/patient-drawer/PatientDrawer';
import { setShowPatientForm } from '@/features/user-profile/userProfileSlice';
import {
  createFamilyMember, fetchFamilyMembers,
  updateFamilyMember
} from '@/features/user-profile/userProfileThunks';
import { useRouter } from 'next/navigation';
import { setEditingPatient, setIsEditing } from "@/features/user-profile/userProfileSlice";

import {
  AlertDialog,
  AlertDialogAction, AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { getToken } from '@/features/auth/utils/tokenManager';
import { selectIsAuthenticated } from '@/features/auth/authSelectors';
import { fetchDeliveryCharge } from '@/features/order/orderThunks';
import { FaPercentage } from 'react-icons/fa';
import { HiChevronRight } from 'react-icons/hi';
import { removeOffer } from '@/features/offers/offerSlice';
import { fetchCustomerOffers } from '@/features/offers/offerThunks';
import { GiTwoCoins } from 'react-icons/gi';
import { Sparkles } from 'lucide-react';
import TermsAndConditionsDrawer from '@/components/shared/t&c-drawer/Terms&ConditionsDrawer';

export default function Checkout() {
  const [showCoupon, setShowCoupon] = useState(false);
  const [showAddressAlert, setShowAddressAlert] = useState(false);
  const [showCartAlert, setShowCartAlert] = useState(false);

  const [authChecked, setAuthChecked] = useState(false);
  const { user, selectedAddressForOrder } = useAppSelector((state) => state.userProfile);
  const { appliedOffer, offers } = useAppSelector((state) => state.offers);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchFamilyMembers());
  }, []);

  // Authentication checking
  useEffect(() => {
    const token = getToken();
    if (!token || !selectIsAuthenticated) {
      router.push('/cart');
      return;
    }
    setAuthChecked(true);
  }, [selectIsAuthenticated, router]);

  const { carts, loading } = useAppSelector((state) => state.cart);
  const currentCart = carts[0];

  useEffect(() => {
    if (!carts.length) dispatch(fetchCart());
    dispatch(fetchCustomerOffers())
  }, [carts.length, dispatch]);

  const saved = useAppSelector((state) => state.prescription.orderSelectedPrescription);
  const editingPatient = useAppSelector((state) => state.userProfile.editingPatient);
  const isEditing = useAppSelector((state) => state.userProfile.isEditing);

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditing && editingPatient) {
        await dispatch(updateFamilyMember({ id: editingPatient.id, payload: data })).unwrap();
      } else {
        await dispatch(createFamilyMember(data)).unwrap();
      }
      dispatch(setShowPatientForm(false));
      dispatch(setEditingPatient(null));
      dispatch(setIsEditing(false));
    } catch (error) { }
  };

  const handlePreview = () => {
    if (!currentCart?.items?.length) return setShowCartAlert(true);
    if (!selectedAddressForOrder) return setShowAddressAlert(true);
    router.push("/preview");
  };

  useEffect(() => {
    if (authChecked) {
      dispatch(fetchCart());
      dispatch(fetchDeliveryCharge());
    }
  }, [authChecked]);

  const { deliveryCharges } = useAppSelector((state) => state.order);
  const subTotal = Number(currentCart?.sub_total || 0);
  let remainingAfterDiscount = subTotal;

  const shipping = subTotal < (deliveryCharges?.min_purchase_amount)
    ? Number(deliveryCharges?.amount)
    : 0;




  // ===============================
  // 1️⃣ Calculate subtotals before coupn apply
  // ===============================
  let prescriptionSubtotal = 0;
  let otcSubtotal = 0;

  currentCart?.items?.forEach((item: any) => {
    const price = Number(item.priceAtTime || 0);
    const quantity = Number(item.quantity || 1); // default 1

    const totalPrice = price * quantity;

    if (item.medicine?.prescriptionRequired) {
      prescriptionSubtotal += totalPrice;
    } else {
      otcSubtotal += totalPrice;
    }
  });

  // console.log('prescriptionSubtotal', prescriptionSubtotal);
  // console.log('otcSubtotal', otcSubtotal)


  // ===============================
  // 2️⃣ Total subtotal
  // ===============================

  let subtotalBeforDiscount = prescriptionSubtotal + otcSubtotal;
  // console.log('subtotalBeforDiscount', subtotalBeforDiscount)

  // ===============================
  // 3 calculate the discount amount
  // ===============================


  let couponDiscount = 0;

  if (appliedOffer && appliedOffer.category !== 'CASHBACK') {
    const minValue = Number(appliedOffer.minimumOrderValue || 0);

    if (appliedOffer.appliesTo === 'ANY') {
      if (appliedOffer.discountType === 'PERCENTAGE') {
        couponDiscount = (subtotalBeforDiscount * Number(appliedOffer.discountValue)) / 100;
      } else {
        couponDiscount = Number(appliedOffer.discountValue);
      }
    }

    if (appliedOffer.appliesTo === 'OTC') {
      if (appliedOffer.discountType === 'PERCENTAGE') {
        couponDiscount = (otcSubtotal * Number(appliedOffer.discountValue)) / 100;
      } else {
        couponDiscount = Number(appliedOffer.discountValue);
      }
    }

    if (appliedOffer.appliesTo === 'PRESCRIPTION') {
      if (appliedOffer.discountType === 'PERCENTAGE') {
        couponDiscount = (prescriptionSubtotal * Number(appliedOffer.discountValue)) / 100;
      } else {
        couponDiscount = Number(appliedOffer.discountValue);
      }
    }
  }
  // console.log('coponDiscount', couponDiscount);

  // ===============================
  // 4 Apply normal coupon discount on prescriptio and otc accoring to the ratio
  // ===============================
  let prescriptionDiscount = 0;
  let otcDiscount = 0;

  if (couponDiscount > 0 && appliedOffer) {
    // ===============================
    // ANY → ratio / parts based split
    // ===============================
    if (appliedOffer.appliesTo === 'ANY') {
      const prescriptionAmount = prescriptionSubtotal;
      const otcAmount = otcSubtotal;

      const totalAmount = prescriptionAmount + otcAmount;

      if (totalAmount > 0) {
        // 1️⃣ Parts (price itself becomes ratio)
        const prescriptionParts = prescriptionAmount;
        const otcParts = otcAmount;

        // 2️⃣ Total parts
        const totalParts = prescriptionParts + otcParts;

        // 3️⃣ Value per part
        const valuePerPart = couponDiscount / totalParts;

        // 4️⃣ Discount allocation
        prescriptionDiscount = prescriptionParts * valuePerPart;
        otcDiscount = otcParts * valuePerPart;
      }
    }


    // ===============================
    // OTC → apply only on non-prescription
    // ===============================
    else if (appliedOffer.appliesTo === 'OTC') {
      otcDiscount = couponDiscount;
    }

    else if (appliedOffer.appliesTo === 'PRESCRIPTION') {
      prescriptionDiscount = couponDiscount;
    }

    // ===============================
    // SPECIFIC_CATEGORY → treated as OTC
    // ===============================
    // else if (appliedOffer.appliesTo === 'SPECIFIC_CATEGORY') {
    //   otcDiscount = Math.min(couponDiscount, otcSubtotal);
    // }

    // ===============================
    // rounding safety (keep precision)
    // ===============================
    prescriptionDiscount = Number(prescriptionDiscount.toFixed(3));
    otcDiscount = Number(otcDiscount.toFixed(3));
  }

  // console.log('prescriptionDiscount', prescriptionDiscount);
  // console.log('otcDiscount', otcDiscount)




  const subtotalAfterDiscount = (prescriptionSubtotal - prescriptionDiscount) + (otcSubtotal - otcDiscount);
  const prescriptionSubtotalAfterDiscount = prescriptionSubtotal - prescriptionDiscount;
  // console.log('prescriptionSubtotalAfterDiscount', prescriptionSubtotalAfterDiscount)
  const otcSubtotalAfterDiscount = otcSubtotal - otcDiscount;
  // console.log('otcSubtotalAfterDiscount', otcSubtotalAfterDiscount);

  // =========================================================
  // NEW DEFAULT OFFER LOGIC AFTER COUPON APPLY
  // =========================================================


  const defaultOffer = offers.find((o) => o.isDefault === true);

  const hasPrescriptionItem =
    currentCart?.items?.some((i) => i.medicine?.prescriptionRequired) ?? false;

  const defaultOfferEligible = defaultOffer && hasPrescriptionItem && prescriptionSubtotal >= defaultOffer.minimumOrderValue;

  let defaultOfferCashback = 0;

  if (defaultOfferEligible) {
    const minValue = Number(defaultOffer.minimumOrderValue || 0);
    if (prescriptionSubtotal >= minValue) {
      if (defaultOffer.discountType === 'PERCENTAGE') {
        defaultOfferCashback = (prescriptionSubtotalAfterDiscount * Number(defaultOffer.discountValue)) / 100;
      } else {
        defaultOfferCashback = Number(defaultOffer.discountValue);
      }
      // if (defaultOfferCashback > prescriptionSubtotalAfterDiscount) defaultOfferCashback = prescriptionSubtotalAfterDiscount;
    }
  }

  const finalTotal = subtotalAfterDiscount + shipping;

  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Loader />
      </div>
    );
  }
  // console.log('-----------------------------')

  return (
    <>
      <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-6">
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-800">Checkout</h1>

        <div className="flex items-center mb-5">
          <Link href="/cart">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md shadow-sm">
              <GoArrowLeft /> Back
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">

            {hasPrescriptionItem &&
              (saved.length > 0 ? <PrescriptionSection /> : <RequiresPrescription />)}

            <SelectPatient
              onEditPatient={(p) => {
                dispatch(setEditingPatient(p));
                dispatch(setIsEditing(true));
                dispatch(setShowPatientForm(true));
              }}
            />

            <section className="bg-white border rounded-lg p-5">
              <SelectAddress />
            </section>
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-6">

            {/* APPLY COUPON SECTION */}
            <section className="bg-white border rounded-lg p-3">
              <button
                type="button"
                onClick={() => setShowCoupon(true)}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <FaPercentage className="text-gray-600" />
                  <span className="font-medium">Apply coupon</span>
                </div>
                <HiChevronRight />
              </button>

              {/* =========================================================
                  WARNING + INFO BOX — Always show if prescription item exists
                 ========================================================= */}
              {/* {hasPrescriptionItem && (
                <div className="mt-3 p-3 rounded-md bg-blue-50 border border-blue-300">
                  <p className="text-blue-800 text-sm font-semibold">
                    Prescription-based Cashback available.
                  </p>

                  {hasNonPrescriptionItem ? (
                    <p className="text-blue-700 text-xs mt-1">
                      ⚠ Default prescription Cashback will NOT apply because your cart
                      contains non-prescription medicines.
                    </p>
                  ) : (
                    <>
                      <p className="text-blue-700 text-sm mt-1">
                        Eligible default Cashback:{" "}
                        {defaultOffer?.discountType === "PERCENTAGE"
                          ? `${defaultOffer?.discountValue}%`
                          : `₹${defaultOffer?.discountValue}`}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        ⚠ This may change based on subtotal.
                      </p>
                    </>
                  )}
                </div>
              )} */}

              {defaultOfferEligible && defaultOfferCashback > 0 && (
                <div className="mt-3 flex items-start gap-3 
                  bg-blue-50 border border-blue-200 
                  rounded-xl px-4 py-3">

                  {/* Sparkle Icon */}
                  <div className="flex-shrink-0 text-blue-600 mt-0.5">
                    {/* replace icon freely */}
                    <Sparkles className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      You are eligible for prescription cashback
                    </p>

                    <p className="text-sm text-gray-700">
                      Eligible cashback:&nbsp;
                      <span className="font-semibold text-gray-900">
                        {defaultOffer?.discountType === "PERCENTAGE"
                          ? `${defaultOffer?.discountValue}%`
                          : `₹${defaultOffer?.discountValue}`}
                      </span>
                    </p>
                  </div>
                </div>
              )}

            </section>

            {/* SHOPPING SUMMARY */}
            <section className="bg-white border rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-3">Shopping Cart</h2>

              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd>₹{subTotal.toFixed(2)}</dd>
                </div>

                {/* first Order OFFER DEDUCTION */}
                {/* {firstOfferEligible && firstOfferDiscount > 0 && (
                  <div className="flex justify-between text-blue-700 border-t pt-2">
                    <dt className="font-medium">First Order Offer Discount</dt>
                    <dd>-₹{firstOfferDiscount.toFixed(2)}</dd>
                  </div>
                )}  */}

                {/* USER APPLIED COUPON */}
                {(appliedOffer?.discountValue > 0 && appliedOffer?.category === 'COUPON') && (
                  <div className="flex justify-between text-green-700 border-t pt-2">
                    <dt className="font-medium">
                      Coupon Applied ({appliedOffer?.code})
                    </dt>
                    <dd>-₹{couponDiscount.toFixed(2)}</dd>
                  </div>
                )}

                <div className="flex justify-between border-t pt-2">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd>₹{shipping.toFixed(2)}</dd>
                </div>

                <div className="flex justify-between text-base font-semibold border-t pt-3">
                  <dt>Total Amount</dt>
                  <dd>₹{finalTotal.toFixed(2)}</dd>
                </div>
              </dl>

              <button
                onClick={handlePreview}
                className="mt-5 w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90"
              >
                Preview Order
              </button>

              {/* DEFAULT CASHBACK UI */}
              {defaultOfferEligible && defaultOfferCashback > 0 && (
                <div className="flex items-center gap-4
                  bg-blue-50 border border-blue-200 
                  rounded-2xl px-4 py-3 mt-3 
                  max-w-full">

                  {/* Icon (3-layer like earlier) */}
                  <div className="flex-shrink-0 relative flex items-center justify-center
                    w-11 h-11 rounded-full bg-blue-100">
                    <div className="flex items-center justify-center
                      w-8 h-8 rounded-full bg-blue-400">
                      {/* replace icon if needed */}
                      <span className="text-white text-sm font-bold"><GiTwoCoins /></span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold">
                      Cashback reward
                    </span>
                    <span className="text-sm font-semibold text-blue-700">
                      You&apos;ll earn {defaultOffer?.discountType === "PERCENTAGE"
                        ? `${defaultOffer?.discountValue}%`
                        : `₹${defaultOffer?.discountValue}`} Cashback
                    </span>
                  </div>
                </div>
              )}

              {/* APPLIED OFFER BOX */}
              {appliedOffer && (
                <div className="mt-4 bg-green-50 border border-green-300 p-4 rounded-md flex justify-between">
                  <div>
                    <p className="font-semibold text-green-800 text-xs">
                      {appliedOffer.title}
                    </p>
                    <p className="font-semibold text-green-800 text-sm">
                      {appliedOffer.code}
                    </p>
                  </div>

                  <button
                    onClick={() => dispatch(removeOffer())}
                    className="text-red-600 font-semibold text-sm cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </section>

          </div>
        </div>
      </div>

      {showCoupon && (
        <CouponsAndOffers orderType='PRODUCT' onClose={() => setShowCoupon(false)} total={subTotal} />
      )}

      {/* Address Alert */}
      <AlertDialog open={showAddressAlert} onOpenChange={setShowAddressAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Address Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please add a delivery address to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty Cart Alert */}
      <AlertDialog open={showCartAlert} onOpenChange={setShowCartAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cart Empty</AlertDialogTitle>
            <AlertDialogDescription>
              Please add items before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PatientDrawer
        onSubmit={handleFormSubmit}
        initialData={editingPatient}
        isEditing={isEditing}
      />
      <TermsAndConditionsDrawer />
    </>
  );
}

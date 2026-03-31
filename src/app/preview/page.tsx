'use client';

import PrescriptionSection from '@/components/shared/prescription-section/PrescriptionSection';
import Loader from '@/components/ui/loader';
import { clearCart } from '@/features/cart/cartSlice';
import { fetchCart } from '@/features/cart/cartThunks';
import { CartItem } from '@/features/cart/types';
import { createProductOrder, fetchDeliveryCharge } from '@/features/order/orderThunks';
import type { CreateProductOrderPayload, DeliveryAddress } from '@/features/order/types';
import { clearSelectedFamilyMemberForOrder } from '@/features/user-profile/userProfileSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { GoArrowLeft } from 'react-icons/go';
import PreviewCard from './components/PreviewCard';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { removeOffer } from '@/features/offers/offerSlice';
import { fetchCustomerWallet, fetchWalletSetting } from '@/features/user-profile/userProfileThunks';
import { WalletSetting } from '@/features/user-profile/types';
import { GiTwoCoins } from 'react-icons/gi';

interface BillingSummaryForm {
  paymentOption: 'Online' | 'COD';
  useWalletCash: boolean;    // flag: whether user wants to use DVB Cash
  cashAmount: string;        // text input: requested DVB Cash amount
  useWalletCoins: boolean;   // flag: whether user wants to use DVB Coins
}

// Helper: compute wallet usage (cash + coins) based on flags and limits
function computeWalletUsage(
  amountBeforeWallet: number,
  form: { useWalletCash: boolean; cashAmount: string; useWalletCoins: boolean },
  wallet: { cashBalance?: any; coinBalance?: any } | null | undefined,
  walletSetting: WalletSetting | null | undefined
) {
  const availableCash = Number(wallet?.cashBalance ?? 0);     // available DVB Cash
  const availableCoins = Number(wallet?.coinBalance ?? 0);    // available DVB Coins
  const redemptionPercent = Number(walletSetting?.redemptionPercent ?? 0); // % of order allowed in coins

  // DVB Coins usage (1 coin = ₹1)
  let coinsToUse = 0;
  if (form.useWalletCoins && amountBeforeWallet > 0 && redemptionPercent > 0) {
    const baseForPercent = amountBeforeWallet;
    const maxCoinsByPercent = Math.floor((baseForPercent * redemptionPercent) / 100);
    const maxUsableCoinsThisOrder = Math.min(availableCoins, maxCoinsByPercent);
    coinsToUse = Math.min(maxUsableCoinsThisOrder, baseForPercent);
  }

  const amountAfterCoins = Math.max(amountBeforeWallet - coinsToUse, 0);


  // DVB Cash usage
  let walletCashToUse = 0;
  if (form.useWalletCash && amountAfterCoins > 0) {
    const requested = Number(form.cashAmount || 0);
    const safeRequested = isNaN(requested) ? 0 : Math.max(requested, 0);
    walletCashToUse = Math.min(safeRequested, availableCash, amountAfterCoins);
  }
  console.log('walletcash-1', walletCashToUse);
  console.log('walletcoin-1', coinsToUse);
  return { walletCashToUse, coinsToUse };
}

export default function PreviewPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    setValue
  } = useForm<BillingSummaryForm>({
    defaultValues: {
      paymentOption: 'Online',
      useWalletCash: false,
      cashAmount: '',
      useWalletCoins: false
    }
  });

  const selectedPayment = watch('paymentOption');
  const useWalletCash = watch('useWalletCash');
  const cashAmountInput = watch('cashAmount');
  const useWalletCoins = watch('useWalletCoins');

  const { carts, loading } = useAppSelector((state) => state.cart);
  const { selectedAddressForOrder, selectedFamilyMemberForOrder } = useAppSelector(
    (state) => state.userProfile
  );
  const { orderSelectedPrescription } = useAppSelector((state) => state.prescription);

  const { appliedOffer, offers } = useSelector((state: RootState) => state.offers); // offer state
  const { walletSetting, wallet } = useSelector((state: RootState) => state.userProfile); // wallet state

  const currentCart = carts?.[0];
  const address = selectedAddressForOrder;

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchDeliveryCharge());
    dispatch(fetchWalletSetting());
    dispatch(fetchCustomerWallet())
  }, [dispatch]);

  const { deliveryCharges } = useAppSelector((state) => state.order);



  /* ---------------------------------------------------
     CONFIRM ORDER HANDLER
  --------------------------------------------------- */
  const confirmOrderHandler = async (data: BillingSummaryForm) => {
    if (!currentCart || !address) {
      console.error('Missing cart or address');
      return;
    }



    let payWindow: Window | null = null;
    if (data.paymentOption !== 'COD') {
      payWindow = window.open('', '_blank');
    }

    const sanitizedAddress: DeliveryAddress = {
      name: address.name,
      phone_number: address.phone_number,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      city_district: address.city_district,
      pincode: address.pincode,
      state: address.state,
      lat: address.lat,
      lng: address.lng,
    };

    // Basic cart math for server payload (same as UI)
    const subTotal = Number(currentCart?.sub_total || 0);
    const shipping =
      subTotal < (deliveryCharges?.min_purchase_amount ?? 0)
        ? Number(deliveryCharges?.amount ?? 0)
        : 0;

    // Flags: prescription items & non-prescription items
    const hasPrescriptionItem = currentCart.items.some(
      (item) => item.medicine.prescriptionRequired
    );
    const hasNonPrescriptionItem = currentCart.items.some(
      (item) => !item.medicine.prescriptionRequired
    );

    // Default prescription offer (isDefault + appliesTo PRESCRIPTION)
    const defaultOffer = offers.find(
      (o) => o.isDefault && o.appliesTo === 'PRESCRIPTION' && o.isActive
    );

    let defaultOfferDiscount = 0;

    if (defaultOffer && hasPrescriptionItem) {
      const minValue = Number(defaultOffer.minimumOrderValue || 0);

      if (subTotal >= minValue && !hasNonPrescriptionItem) {
        if (defaultOffer.discountType === 'PERCENTAGE') {
          defaultOfferDiscount =
            (subTotal * Number(defaultOffer.discountValue)) / 100;
        } else {
          defaultOfferDiscount = Number(defaultOffer.discountValue);
        }
        if (defaultOfferDiscount > subTotal) {
          defaultOfferDiscount = subTotal;
        }
      }
    }

    // Manual coupon stacking on remaining after default
    let appliedOfferDiscount = 0;
    const amountAfterDefault = subTotal - defaultOfferDiscount;

    if (appliedOffer && appliedOffer.category !== 'CASHBACK') {
      const minValue = Number(appliedOffer.minimumOrderValue || 0);
      const meetsMinimum =
        !appliedOffer.minimumOrderValue ||
        amountAfterDefault >= minValue;

      if (meetsMinimum) {
        if (appliedOffer.discountType === 'PERCENTAGE') {
          appliedOfferDiscount =
            (amountAfterDefault * Number(appliedOffer.discountValue)) / 100;
        } else {
          appliedOfferDiscount = Number(appliedOffer.discountValue);
        }
      }
    }

    // // Amount before wallet usage
    // const amountBeforeWallet = subTotal + shipping - defaultOfferDiscount - appliedOfferDiscount;

    // // Compute wallet usage for payload
    // const { walletCashToUse, coinsToUse } = computeWalletUsage(
    //   amountBeforeWallet,
    //   {
    //     useWalletCash: data.useWalletCash,
    //     cashAmount: data.cashAmount,
    //     useWalletCoins: data.useWalletCoins,
    //   },
    //   wallet,
    //   walletSetting
    // );



    const payload: CreateProductOrderPayload = {
      deliveryDate: null,
      deliveryAddress: sanitizedAddress,

      // Required by backend
      paymentMethod: data.paymentOption,

      // Offer mapping
      offerCode: appliedOffer?.code,
      // Wallet usage mapping (backend expects these names)
      cashUsed: walletCashToUse,
      isCoinsUsed: Boolean(coinsToUse),

      // Required fields
      items: currentCart.items.map((item) => ({
        medicineId: item.medicine.id,
        quantity: item.quantity,
      })),

      familyMemberIds: selectedFamilyMemberForOrder || [],

      prescription:
        orderSelectedPrescription?.length > 0
          ? orderSelectedPrescription
          : undefined,

    };


    try {
      const order = await dispatch(createProductOrder(payload)).unwrap();
      dispatch(clearCart());
      dispatch(removeOffer());
      dispatch(clearSelectedFamilyMemberForOrder());

      if (data.paymentOption === 'COD') {
        router.push('/user/orders');
        return;
      }

      // STEP 2️⃣ – Redirect the already-opened popup to payment URL
      const paymentUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/initiate?orderId=${order.orderId}`;
      if (payWindow) payWindow.location.href = paymentUrl;
      console.log('payload', payload);
    } catch (error) {
      if (payWindow) payWindow.close();
      router.push('/payment/failed');
    }

    console.log('payload', payload);
  };

  /* ---------------------------------------------------
     LOADING + EMPTY CART HANDLERS
  --------------------------------------------------- */
  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Loader />
      </div>
    );

  if (!carts || carts.length === 0) {
    return <div className="text-center py-10">Your cart is empty.</div>;
  }

  /* ---------------------------------------------------
     BASIC CART CALCULATIONS (FOR UI)
  --------------------------------------------------- */
  const subTotal = Number(currentCart?.sub_total || 0);
  const shipping =
    subTotal < (deliveryCharges?.min_purchase_amount ?? 0)
      ? Number(deliveryCharges?.amount ?? 0)
      : 0;

  /* ---------------------------------------------------
      OFFER (STACKING)
  --------------------------------------------------- */
  const hasPrescriptionItem = currentCart.items.some(
    (item) => item.medicine.prescriptionRequired
  );
  const hasNonPrescriptionItem = currentCart.items.some(
    (item) => !item.medicine.prescriptionRequired
  );

  const defaultOffer = offers.find(
    (o) => o.isDefault && o.appliesTo === 'PRESCRIPTION' && o.isActive
  );


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
  console.log('currentCart', currentCart);

  console.log('pre', prescriptionSubtotal);
  console.log('otc', otcSubtotal);

  // ===============================
  // 2️⃣ Total subtotal
  // ===============================

  let subtotalBeforDiscount = prescriptionSubtotal + otcSubtotal;
  console.log('subtotalBeforDiscount', subtotalBeforDiscount);

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



  // ===============================
  // 4 Apply normal coupon discount on prescriptio and otc accoring to the ratio
  // ===============================
  let prescriptionDiscount = 0;
  let otcDiscount = 0;

  console.log('couponDiscount', couponDiscount)
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


  console.log('prescriptionDiscount', prescriptionDiscount);
  console.log('otcDiscount', otcDiscount)


  const subtotalAfterDiscount = (prescriptionSubtotal - prescriptionDiscount) + (otcSubtotal - otcDiscount);
  const prescriptionSubtotalAfterDiscount = prescriptionSubtotal - prescriptionDiscount;
  console.log('prescriptionSubtotalAfterDiscount', prescriptionSubtotalAfterDiscount);
  const otcSubtotalAfterDiscount = otcSubtotal - otcDiscount;
  console.log('otcSubtotalAfterDiscount', otcSubtotalAfterDiscount);
  console.log('subtotalAfterDiscount', subtotalAfterDiscount);

  // =========================================================
  // NEW DEFAULT OFFER LOGIC AFTER COUPON APPLY
  // =========================================================

  const defaultOfferEligible = defaultOffer && hasPrescriptionItem && prescriptionSubtotal >= (defaultOffer.minimumOrderValue ?? 0);

  let defaultOfferCashback = 0;

  if (defaultOfferEligible) {
    const minValue = Number(defaultOffer.minimumOrderValue || 0);
    if (prescriptionSubtotal >= minValue) {
      if (defaultOffer.discountType === 'PERCENTAGE') {
        defaultOfferCashback = (prescriptionSubtotalAfterDiscount * Number(defaultOffer.discountValue)) / 100;
      } else {
        defaultOfferCashback = Number(defaultOffer.discountValue);
      }
      if (defaultOfferCashback > prescriptionSubtotalAfterDiscount) defaultOfferCashback = prescriptionSubtotalAfterDiscount;
    }
  }

  console.log('-------------------------')

  /* ---------------------------------------------------
     WALLET USAGE (CASH + COINS)
  --------------------------------------------------- */
  const amountBeforeWallet = subtotalAfterDiscount;

  const { walletCashToUse, coinsToUse } = computeWalletUsage(
    amountBeforeWallet,
    { useWalletCash, cashAmount: cashAmountInput, useWalletCoins },
    wallet,
    walletSetting
  );

  console.log('walletcash-2', walletCashToUse);
  console.log('walletcoin-2', coinsToUse);

  const availableCash = Number(wallet?.cashBalance ?? 0);
  const availableCoins = Number(wallet?.coinBalance ?? 0);
  const redemptionPercent = Number(walletSetting?.redemptionPercent ?? 0);

  const payableSubtotal = subtotalAfterDiscount - walletCashToUse - coinsToUse;
  const finalTotal = payableSubtotal + shipping;
  /* ---------------------------------------------------
     UI RETURN — COMPLETE PAGE
  --------------------------------------------------- */
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl sm:px-6 sm:py-5 lg:max-w-6xl lg:px-8">
        {/* BACK BUTTON */}
        <div className="flex items-center pt-5">
          <Link href="/checkout">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <GoArrowLeft className="text-lg" />
              <span className="font-medium">Back</span>
            </button>
          </Link>
        </div>

        {/* PRODUCTS LIST */}
        <div className="mt-6">
          <div className="space-y-4">
            {currentCart.items.map((item: CartItem) => (
              <PreviewCard
                key={item.id}
                item={{
                  ...item,
                  medicine: {
                    ...item.medicine,
                    images: item.medicine.images ?? []
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* PRESCRIPTION SECTION */}
        <div className="my-5">
          <PrescriptionSection />
        </div>

        {/* ---------------------------------------------------
            BILLING SECTION
        --------------------------------------------------- */}
        <div className="mt-6">
          <form
            onSubmit={handleSubmit(confirmOrderHandler)}
            className="bg-white px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-4"
          >
            {/* ---------------- LEFT SIDE ---------------- */}
            <dl className="grid grid-cols-2 gap-6 text-sm md:gap-x-8 lg:col-span-7">
              {/* DELIVERY ADDRESS */}
              <div>
                <dt className="font-medium text-gray-900">Delivery address</dt>
                <dd className="mt-3 text-gray-500 leading-relaxed">
                  <span className="block font-semibold text-gray-800">
                    {address?.name}
                  </span>
                  {address?.address_line_1 && (
                    <span className="block">{address.address_line_1}</span>
                  )}
                  {address?.address_line_2 && (
                    <span className="block">{address.address_line_2}</span>
                  )}
                  <span className="block">
                    {address?.city_district} - {address?.pincode}
                  </span>
                  <span className="block">{address?.state}</span>
                  <span className="block text-gray-600 text-xs mt-1">
                    +91 {address?.phone_number}
                  </span>
                </dd>
              </div>

              {/* PAYMENT OPTION + WALLET */}
              <div>
                <dt className="font-medium text-gray-900 mb-3">Payment Option</dt>
                <dd className="flex flex-col gap-2">
                  <Controller
                    name="paymentOption"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Online"
                            checked={field.value === 'Online'}
                            onChange={() => field.onChange('Online')}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-gray-700 text-sm">
                            Online Payment
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="COD"
                            checked={field.value === 'COD'}
                            onChange={() => field.onChange('COD')}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-gray-700 text-sm">
                            Cash on Delivery (COD)
                          </span>
                        </label>
                      </div>
                    )}
                  />
                </dd>

                {/* ---------------- WALLET OPTIONS ---------------- */}
                <div className="mt-6 col-span-2">
                  <dt className="font-medium text-gray-900 mb-3">Use Wallet</dt>
                  <dd className="flex flex-col gap-3">
                    {/* DVB CASH */}
                    <Controller
                      name="useWalletCash"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="text-primary focus:ring-primary"
                              disabled={availableCash === 0}
                            />
                            <span className="text-gray-700 text-sm">
                              Use Wallet Cash (Available: ₹{availableCash.toFixed(2)})
                            </span>
                          </label>
                          {field.value && (
                            <input
                              type="number"
                              min={0}
                              onWheel={(e) => (e.target as HTMLInputElement).blur()} // prevent scroll change
                              value={cashAmountInput}
                              onChange={(e) =>
                                setValue('cashAmount', e.target.value, {
                                  shouldValidate: false,
                                  shouldDirty: true
                                })
                              }
                              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-primary focus:outline-none"
                              placeholder="Enter cash amount to use"
                            />
                          )}
                        </div>
                      )}
                    />

                    {/* DVB COINS */}
                    <Controller
                      name="useWalletCoins"
                      control={control}
                      render={({ field }) => {
                        // For small helper text about max usable coins
                        const baseForPercent =
                          amountBeforeWallet > 0 ? amountBeforeWallet : subTotal + shipping;
                        const maxCoinsByPercent = Math.floor(
                          (baseForPercent * redemptionPercent) / 100
                        );
                        const maxUsableCoinsThisOrder = Math.min(
                          availableCoins,
                          maxCoinsByPercent
                        );

                        return (
                          <div className="space-y-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="text-primary focus:ring-primary"
                                disabled={availableCoins === 0}
                              />
                              <span className="text-gray-700 text-sm">
                                Use D Bharti Coins (1 coin = ₹1)
                              </span>
                            </label>
                            <p className="text-xs text-gray-500">
                              Available: {availableCoins} coins · Max usable this order (by
                              {` ${redemptionPercent}%`}) approx: {coinsToUse}
                            </p>
                          </div>
                        );
                      }}
                    />
                  </dd>
                </div>
              </div>
            </dl>

            {/* ---------------- RIGHT SIDE — SUMMARY ---------------- */}
            <dl className="mt-8 text-sm lg:col-span-5 lg:mt-0 space-y-3">

              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <dt className="text-gray-700">Subtotal</dt>
                <dd className="font-medium text-gray-900">₹{subTotal.toFixed(2)}</dd>
              </div>


              {/* Manual Coupon Discount */}
              {(appliedOffer?.discountValue ?? 0) > 0 && appliedOffer?.category === 'COUPON' && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-700">
                    Coupon ({appliedOffer.code})
                  </dt>
                  <dd className="font-medium text-gray-900">- ₹{couponDiscount.toFixed(2)}</dd>
                </div>
              )}


              {/* Wallet Cash Used */}
              {walletCashToUse > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-700">Wallet Cash Used</dt>
                  <dd className="font-medium text-gray-900">- ₹{walletCashToUse.toFixed(2)}</dd>
                </div>
              )}

              {/* Wallet Coins Used */}
              {coinsToUse > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-700">D Bharti Coins Used</dt>
                  <dd className="font-medium text-gray-900">- ₹{coinsToUse.toFixed(2)}</dd>
                </div>
              )}

              {/* Shipping */}
              <div className="flex items-center justify-between">
                <dt className="text-gray-700">Shipping</dt>
                <dd className="font-medium text-gray-900">₹{shipping.toFixed(2)}</dd>
              </div>

              {/* Final Total */}
              <div className="flex items-center justify-between pt-3 border-t">
                <dt className="font-semibold text-gray-900">Order Total</dt>
                <dd className="font-semibold text-primary text-lg">
                  ₹{finalTotal.toFixed(2)}
                </dd>
              </div>

              {/* Info Message */}
              {/* {(defaultOfferCashback || defaultOfferInfoOnly) && defaultOfferMessage && (
                <p className="text-xs text-gray-600 leading-relaxed pt-2">
                  {defaultOfferMessage}
                </p>
              )} */}

              {/* CONFIRM BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary text-white text-sm font-medium py-3 rounded-lg cursor-pointer transition-all"
                >
                  Confirm Order
                </button>
              </div>

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
                      You&apos;ll earn 10% Cashback
                    </span>
                  </div>
                </div>
              )}

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
            </dl>

          </form>
        </div>
      </div>
    </div>
  );
}

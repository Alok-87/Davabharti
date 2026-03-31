'use client';

import { useForm, Controller } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { updatePrescriptionOrderPaymentApi, updateQuotationPaymentApi } from '@/features/order/orderApi';
import { setIsRemarkOpen } from '@/features/user-profile/userProfileSlice';
import { removeOffer } from '@/features/offers/offerSlice';

import Loader from '@/components/ui/loader';
import { Toast } from '@/components/ui/toast';
import type { RootState } from '@/store';

import { computeWalletUsage } from './wallet.utils';
import PrescriptionCouponsModal from './PrescriptionCouponsModal';

interface PaymentForm {
  paymentOption: 'Online' | 'COD';
  useWalletCash: boolean;
  cashAmount: string;
  useWalletCoins: boolean;
}

export default function PaymentSection({
  order,
  deliveryCharge,
  onPaymentDone,
}: {
  order: any;
  deliveryCharge: number;
  onPaymentDone: () => void;
}) {
  const dispatch = useAppDispatch();
  const { appliedOffer, offers } = useAppSelector((s: RootState) => s.offers);
  const { walletSetting, wallet } = useAppSelector((s: RootState) => s.userProfile);

  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<PaymentForm>({
    defaultValues: {
      paymentOption: 'Online',
      useWalletCash: false,
      cashAmount: '',
      useWalletCoins: false,
    },
  });

  const selectedPayment = watch('paymentOption');
  const useWalletCash = watch('useWalletCash');
  const cashAmountInput = watch('cashAmount');
  const useWalletCoins = watch('useWalletCoins');

  const lineItems = order?.lineItems || [];

  const itemsSubTotal = useMemo(() => {
    return lineItems.reduce((sum: number, li: any) => {
      const lineSubtotal = li.subtotal != null ? Number(li.subtotal) : Number(li.quantity || 0) * Number(li.salePriceAtOrder || 0);
      return sum + (isNaN(lineSubtotal) ? 0 : lineSubtotal);
    }, 0);
  }, [lineItems]);

  // Paid amount (for partial payment)
  const totalPaid = useMemo(() => {
    return (order?.payment || [])
      .filter((p: any) => p.status === 'PAID')
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  }, [order]);

  // Coupon discount (your existing logic simplified)
  const couponDiscount = useMemo(() => {
    if (!appliedOffer || String(appliedOffer.category) === 'CASHBACK') return 0;

    let prescriptionSubtotal = 0;
    let otcSubtotal = 0;

    lineItems.forEach((item: any) => {
      const totalPrice = Number(item.subtotal ?? 0);
      if (item?.prescriptionRequired) prescriptionSubtotal += totalPrice;
      else otcSubtotal += totalPrice;
    });

    const subtotal = prescriptionSubtotal + otcSubtotal;

    const percent = (base: number) => (base * Number(appliedOffer.discountValue)) / 100;
    const flat = () => Number(appliedOffer.discountValue);

    if (appliedOffer.appliesTo === 'ANY') return appliedOffer.discountType === 'PERCENTAGE' ? percent(subtotal) : flat();
    if (appliedOffer.appliesTo === 'OTC') return appliedOffer.discountType === 'PERCENTAGE' ? percent(otcSubtotal) : flat();
    if (appliedOffer.appliesTo === 'PRESCRIPTION') return appliedOffer.discountType === 'PERCENTAGE' ? percent(prescriptionSubtotal) : flat();

    return 0;
  }, [appliedOffer, lineItems]);

  const subtotalAfterDiscount = Math.max(itemsSubTotal - couponDiscount, 0);

  const { walletCashToUse, coinsToUse, availableCash, availableCoins, redemptionPercent } = useMemo(() => {
    return computeWalletUsage(
      subtotalAfterDiscount,
      { useWalletCash, cashAmount: cashAmountInput, useWalletCoins },
      wallet,
      walletSetting
    );
  }, [subtotalAfterDiscount, useWalletCash, cashAmountInput, useWalletCoins, wallet, walletSetting]);

  const finalTotal = subtotalAfterDiscount - walletCashToUse - coinsToUse + Number(deliveryCharge || 0);

  // Simplest toPay logic: Just the difference between finalTotal and what was already paid
  const toPay = Math.max(Math.round((finalTotal - totalPaid) * 100) / 100, 0);

  const confirmPaymentHandler = async (data: PaymentForm) => {
    setIsProcessing(true);

    try {
      const isRxModified = order?.isModifiedByRx === true && order?.quotationStatus === 'RX_QUOTE_ACCEPTED';

      if (isRxModified) {
        await updateQuotationPaymentApi(order.id, {
          paymentMethod: data.paymentOption,
          cashUsed: walletCashToUse,
          offerCode: appliedOffer?.code,
          isCoinsUsed: useWalletCoins,
        });
      } else {
        await updatePrescriptionOrderPaymentApi(order.id, {
          paymentMethod: data.paymentOption,
          cashUsed: walletCashToUse,
          offerCode: appliedOffer?.code,
          isCoinsUsed: useWalletCoins,
        });
      }

      if (data.paymentOption === 'COD') {
        Toast('Order Confirmed');
        onPaymentDone();
        return;
      }

      const paymentUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/initiate?orderId=${order.id}`;
      const newWindow = window.open(paymentUrl, '_blank');

      if (!newWindow) {
        window.location.href = paymentUrl;
        return;
      }

      Toast('Payment window opened');
      onPaymentDone();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Payment failed';
      Toast(msg);
    } finally {
      setIsProcessing(false);
    }
  };


  const isCodDisable = order.payment[0]?.paymentMethod == 'Online';

  return (
    <section className="bg-white border shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
        <div className="my-4 h-px bg-gray-100" />

        <form onSubmit={handleSubmit(confirmPaymentHandler)}>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Payment Method</h3>

          <Controller
            name="paymentOption"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" value="Online" checked={field.value === 'Online'} onChange={() => field.onChange('Online')} />
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium">Online Payment</span>
                    <p className="text-sm text-gray-600 mt-1">UPI / Card / Netbanking</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" value="COD" checked={field.value === 'COD'} onChange={() => field.onChange('COD')} disabled={isCodDisable} />
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-600 mt-1">Pay at delivery</p>
                  </div>
                </label>
              </div>
            )}
          />

          <div className="bg-blue-50 p-3 mt-6 flex items-center justify-between rounded-md">
            <h3 className="text-sm font-medium text-gray-900">Coupons & Offers</h3>
            <button type="button" onClick={() => setShowCouponsModal(true)} className="text-sm font-medium text-primary cursor-pointer">
              Apply coupon
            </button>
          </div>

          <div className="mt-6">
            <div className="font-medium text-gray-900 mb-3">Use Wallet</div>

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
                      disabled={availableCash === 0}
                    />
                    <span className="text-gray-700 text-sm">Use Wallet Cash (Available ₹{availableCash.toFixed(2)})</span>
                  </label>

                  {field.value && (
                    <input
                      type="number"
                      min={0}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      value={cashAmountInput}
                      onChange={(e) => setValue('cashAmount', e.target.value, { shouldDirty: true })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Enter cash amount"
                    />
                  )}
                </div>
              )}
            />

            <div className="mt-3">
              <Controller
                name="useWalletCoins"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} disabled={availableCoins === 0} />
                      <span className="text-gray-700 text-sm">Use Coins (1 coin = ₹1)</span>
                    </label>
                    <p className="text-xs text-gray-500">
                      Available: {availableCoins} coins · Max usable by {redemptionPercent}%: {coinsToUse}
                    </p>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Summary</h3>

            <div className="text-sm space-y-2">
              <Row label="Items Total" value={`₹${itemsSubTotal.toFixed(2)}`} />
              {couponDiscount > 0 && appliedOffer?.code && (
                <Row label={`Coupon Discount (${appliedOffer.code})`} value={`- ₹${couponDiscount.toFixed(2)}`} />
              )}
              {walletCashToUse > 0 && <Row label="Wallet Cash Used" value={`- ₹${walletCashToUse.toFixed(2)}`} />}
              {coinsToUse > 0 && <Row label="Coins Used" value={`- ₹${coinsToUse.toFixed(2)}`} />}
              <Row label="Delivery Charge" value={`₹${Number(deliveryCharge || 0).toFixed(2)}`} />
              {order?.isModifiedByRx && totalPaid > 0 && <Row label="Already Paid" value={`- ₹${totalPaid.toFixed(2)}`} />}

              <div className="border-t pt-3 flex items-center justify-between">
                <div className="font-semibold text-gray-900">To Pay</div>
                <div className="font-semibold text-primary">₹{toPay.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isProcessing || toPay <= 0}
              className="w-full bg-primary text-white text-sm font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader />
                  <span>Processing...</span>
                </div>
              ) : selectedPayment === 'COD' ? (
                'Confirm COD'
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>

          {appliedOffer && (
            <div className="mt-4 bg-green-50 border border-green-300 p-4 rounded-md flex justify-between">
              <div>
                <p className="font-semibold text-green-800 text-xs">{appliedOffer.title}</p>
                <p className="font-semibold text-green-800 text-sm">{appliedOffer.code}</p>
              </div>
              <button onClick={() => dispatch(removeOffer())} type="button" className="text-red-600 font-semibold text-sm cursor-pointer">
                Remove
              </button>
            </div>
          )}
        </form>
      </div>

      <PrescriptionCouponsModal
        isOpen={showCouponsModal}
        onClose={() => setShowCouponsModal(false)}
        order={order}
        baseAmount={itemsSubTotal}
      />
    </section>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-600">{label}</div>
      <div className="text-gray-900 font-medium">{value}</div>
    </div>
  );
}
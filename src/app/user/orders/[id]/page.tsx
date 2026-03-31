'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDeliveryCharge, fetchOrderDetail, updateQuotationStatus } from '@/features/order/orderThunks';
import { fetchCustomerOffers } from '@/features/offers/offerThunks';
import { fetchCustomerWallet, fetchWalletSetting } from '@/features/user-profile/userProfileThunks';

import { setIsRemarkOpen, setShowReturnDrawer } from '@/features/user-profile/userProfileSlice';
import { getFinalOrderStatus } from '@/utility/getFinalOrderStatus';
import { Toast } from '@/components/ui/toast';
import Loader from '@/components/ui/loader';

import RemarkDrawer from '../components/RemarkDrawer';

import QuotationCard from '../components/QuotationCard';
import PaymentSection from '../components/PaymentSection';
import { computePaymentState } from '../components/paymentDecision';

import rx from '@/assets/rx-tag.svg';
import Image from 'next/image';

import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import {
  Package,
  CalendarDays,
  FileText,
  CreditCard,
  User,
  Pill,
} from 'lucide-react';
import ReturnDrawer from '@/components/shared/return-drawer/ReturnDrawer';

type OrderType = 'PRODUCT' | 'PRESCRIPTION';

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { deliveryCharges, selectedOrder, loading } = useAppSelector((s) => s.order);
  const { isRemarkOpen, showReturnDrawer } = useAppSelector((s) => s.userProfile);

  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (!id) return;

    dispatch(fetchOrderDetail(id as string));
    dispatch(fetchDeliveryCharge());

    // PaymentSection needs offers + wallet
    dispatch(fetchCustomerOffers());
    dispatch(fetchWalletSetting());
    dispatch(fetchCustomerWallet());
  }, [id, dispatch]);

  useEffect(() => {
    const channel = new BroadcastChannel('payment_channel');
    channel.onmessage = (event) => {
      if (event.data?.type === 'PAYMENT_SUCCESS' && event.data?.orderId === id) {
        window.location.reload();
      }
    };
    return () => channel.close();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-600">
        Loading order...
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No order found</h3>
          <p className="text-gray-600">We couldn’t find the order you’re looking for.</p>
        </div>
      </div>
    );
  }

  const order: any = (selectedOrder as any).order ?? selectedOrder;
  const finalStatus = getFinalOrderStatus(order);

  const statusTagClass = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700 ring-1 ring-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 ring-1 ring-red-200';
      case 'Order Confirmed':
      case 'Order Placed':
        return 'bg-blue-100 text-blue-700 ring-1 ring-blue-200';
      case 'Awaiting Prescription Approval':
      case 'Waiting for Quotation':
        return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
      case 'Order Rejected':
      case 'Rejected by Vendor':
      case 'Rejected by Pharmacist':
        return 'bg-red-100 text-red-700 ring-1 ring-red-200';
      case 'Returned':
        return 'bg-purple-100 text-purple-700 ring-1 ring-purple-200';

      case 'Return Initiated':
        return 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200';
      case 'Return in Transit':
        return 'bg-blue-100 text-blue-700 ring-1 ring-blue-200';
      case 'Return Accepted':
        return 'bg-green-100 text-green-700 ring-1 ring-green-200';
      case 'Return Rejected':
        return 'bg-red-100 text-red-700 ring-1 ring-red-200';
      case 'Return Processing':
        return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';

      default:
        return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200';
    }
  };

  const canCancel =
    order?.orderStatus !== 'CANCELLED_BY_CUSTOMER' &&
    order?.orderStatus !== 'REJECTED' &&
    order?.deliveryStatus !== 'DELIVERED' &&
    order?.deliveryStatus !== 'RETURNED' &&
    order?.rxApprovalStatus !== 'REJECTED' &&
    order?.vendorApprovalStatus !== 'DECLINED' &&
    (order.orderType === 'PRESCRIPTION' || order.supportStaffStatus !== 'DECLINED');

  const deliveryDate = order?.deliveryDate ? new Date(order.deliveryDate) : null;
  const isWithin7Days =
    deliveryDate &&
    (new Date().getTime() - deliveryDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;

  const canReturn =
    order?.deliveryStatus === 'DELIVERED' &&
    order?.orderStatus === 'COMPLETED' &&
    order?.returnStatus !== 'ACCEPTED' &&
    order?.returnStatus !== 'RETURN_COMPLETED' &&
    isWithin7Days;

  // Shipping calculation (same as old)
  const shipping =
    Number(order.totalAmount) < Number(deliveryCharges?.min_purchase_amount ?? 0)
      ? Number(deliveryCharges?.amount ?? 0)
      : 0;

  // Quotation expiry
  const QUOTATION_EXPIRY_HOURS = 24;
  const isQuotationExpired = (() => {
    const sentAtDate = order?.quotationSentAt || order?.supportQuotationSentAt || order?.rxQuotationSentAt;
    if (!sentAtDate) return false;
    const sentAt = new Date(sentAtDate).getTime();
    const expiresAt = sentAt + QUOTATION_EXPIRY_HOURS * 60 * 60 * 1000;
    return Date.now() >= expiresAt;
  })();

  const showQuotation =
    order.quotationStatus === 'PENDING' ||
    order.quotationStatus === 'SUPPORT_QUOTE_PENDING' ||
    order.quotationStatus === 'RX_QUOTE_PENDING';

  // New centralized decision
  const paymentState = computePaymentState(order);

  // For quotation card coloring
  const amountAfterQuotation = (() => {
    const paidFirst = Number(order?.payment?.[0]?.amount ?? 0);
    return Number(order.finalAmount) - paidFirst;
  })();

  // ✅ Updated: quotation accept/reject WITHOUT redirect to payment page
  const handleQuotationStatus = async (status: 'ACCEPTED' | 'REJECTED') => {
    try {
      setLoadingAction(true);

      let finalQuotationStatus = status as string;

      if (order.quotationStatus === 'SUPPORT_QUOTE_PENDING') {
        finalQuotationStatus = status === 'ACCEPTED' ? 'SUPPORT_QUOTE_ACCEPTED' : 'SUPPORT_QUOTE_REJECTED';
      } else if (order.quotationStatus === 'RX_QUOTE_PENDING') {
        finalQuotationStatus = status === 'ACCEPTED' ? 'RX_QUOTE_ACCEPTED' : 'RX_QUOTE_REJECTED';
      }

      await dispatch(
        updateQuotationStatus({
          id: order.id,
          quotationStatus: finalQuotationStatus,
        })
      ).unwrap();

      await dispatch(fetchOrderDetail(id as string));
      Toast('Quotation updated');
    } catch {
      Toast('Failed to update quotation status');
    } finally {
      setLoadingAction(false);
    }
  };

  const openCancel = () => dispatch(setIsRemarkOpen(true));

  console.log('reder', order);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b bg-white mx-4">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <nav className="text-sm text-gray-500">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/user/orders" className="hover:text-gray-700">
                  Orders
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">Order #{order.orderNo}</li>
            </ol>
          </nav>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNo}</h1>
              <div className="text-gray-600 flex items-center">
                <div>Delivery Date:</div>
                <div className="ml-2">
                  {order.deliveryDate ? (
                    <span>{new Date(order.deliveryDate).toLocaleDateString()}</span>
                  ) : (
                    <div className="inline-flex items-center px-3 py-1.5 rounded-md font-semibold text-sm">
                      Not Scheduled
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`inline-flex items-center px-3 py-1.5 rounded-md font-semibold text-sm ${statusTagClass(finalStatus)}`}>
              {finalStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardTitle>Order Details</CardTitle>
            <Divider />
            <InfoRow
              icon={<CalendarDays className="w-4 h-4 text-gray-400" />}
              label="Placed on"
              value={format(new Date(order.orderDate), 'dd MMM yyyy, hh:mm a')}
            />
            <InfoRow
              icon={<CreditCard className="w-4 h-4 text-gray-400" />}
              label="Payment Method"
              value={order?.payment?.[0]?.paymentMethod || 'N/A'}
            />
            <InfoRow
              icon={<Package className="w-4 h-4 text-gray-400" />}
              label="Order Type"
              value={(order.orderType as OrderType) || '-'}
            />
          </Card>

          <Card>
            <CardTitle>Customer Details</CardTitle>
            <Divider />
            <InfoRow icon={<User className="w-4 h-4 text-gray-400" />} label="Customer" value={order.user?.name || '-'} />
            <InfoRow icon={<span className="text-gray-400">@</span>} label="Email" value={order.user?.email || '-'} />
            <InfoRow
              icon={<span className="text-gray-400">☎</span>}
              label="Phone"
              value={order.user?.phoneNumber ? `+91 ${order.user.phoneNumber}` : '-'}
            />
          </Card>
        </div>

        {/* Address row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardTitle>Documents</CardTitle>
            <Divider />
            <InfoRow icon={<FileText className="w-4 h-4 text-gray-400" />} label="Invoice" value={order.invoiceNumber ? `#${order.invoiceNumber}` : 'N/A'} />
            <InfoRow icon={<Package className="w-4 h-4 text-gray-400" />} label="Shipping" value={order.shippingRef || 'N/A'} />
          </Card>

          <Card>
            <CardTitle>Shipping Address</CardTitle>
            <Divider />
            <AddressBlock
              name={order.deliveryAddress?.name}
              line1={order.deliveryAddress?.addressLine1}
              line2={order.deliveryAddress?.addressLine2}
              city={order.deliveryAddress?.cityDistrict}
              pincode={order.deliveryAddress?.pincode}
              state={order.deliveryAddress?.state}
              phone={order.deliveryAddress?.phoneNumber}
            />
          </Card>
        </div>

        {/* Items */}
        <Card>
          <CardTitle>Order #{order.orderNo}</CardTitle>
          <Divider />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500">
                  <th className="py-3 text-left font-medium">Product</th>
                  <th className="py-3 text-left font-medium">SKU</th>
                  <th className="py-3 text-left font-medium">Qty</th>
                  <th className="py-3 text-left font-medium">Unit Price</th>
                  <th className="py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lineItems?.map((item: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md border bg-white flex items-center justify-center">
                          <Pill className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="font-medium text-gray-900 flex items-center gap-1">
                          <span>{item.medicineName}</span>
                          {item?.prescriptionRequired && (
                            <sup className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 p-1 rounded">
                              <Image src={rx} alt="Rx" className="w-4 h-4" />
                            </sup>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">{item.sku || '-'}</td>
                    <td className="py-4 text-gray-600">{item.quantity}</td>
                    <td className="py-4 text-gray-600">₹{Number(item.salePriceAtOrder).toFixed(2)}</td>
                    <td className="py-4 text-right text-gray-900 font-medium">₹{Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={4} className="py-3 text-right text-gray-600">
                    Subtotal
                  </td>
                  <td className="py-3 text-right font-medium">₹{Number(order.totalAmount).toFixed(2)}</td>
                </tr>
                <tr className="border-t">
                  <td colSpan={4} className="py-3 text-right text-gray-600">
                    Shipping
                  </td>
                  <td className="py-3 text-right font-medium">+₹{Number(shipping).toFixed(2)}</td>
                </tr>
                {
                  order.walletCashUsed > 0 &&
                  <tr className="border-t">
                    <td colSpan={4} className="py-3 text-right text-gray-600">
                      Cash Used
                    </td>
                    <td className="py-3 text-right font-medium">-₹{(order.walletCashUsed)}</td>
                  </tr>
                }

                {
                  order.walletCoinsUsed > 0 &&
                  <tr className="border-t">
                    <td colSpan={4} className="py-3 text-right text-gray-600">
                      Coin Used
                    </td>
                    <td className="py-3 text-right font-medium">-₹{(order.walletCoinsUsed)}</td>
                  </tr>
                }

                <tr className="border-t">
                  <td colSpan={4} className="py-3 text-right text-gray-900 text-base font-semibold">
                    Grand Total
                  </td>
                  <td className="py-3 text-right text-primary text-lg font-bold">₹{Number(order.finalAmount).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Order History */}
        {Array.isArray(order.order_history) &&
          order.order_history.map((h: any) => (
            <Card key={h.id} className="mb-6">
              <CardTitle>Order History</CardTitle>
              <Divider />

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="py-3 text-left font-medium">Product</th>
                      <th className="py-3 text-left font-medium">Qty</th>
                      <th className="py-3 text-left font-medium">Unit Price</th>
                      <th className="py-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {h.lineItems.map((item: any) => (
                      <tr key={item.id} className="border-t">
                        <td className="py-4 font-medium text-gray-900">
                          <div className="flex gap-2 items-center">
                            <div className="w-10 h-10 rounded-md border bg-white flex items-center justify-center">
                              <Pill className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>{item.productName}</div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600">{item.quantity}</td>
                        <td className="py-4 text-gray-600">₹{Number(item.salePriceAtOrder).toFixed(2)}</td>
                        <td className="py-4 text-right font-medium">₹{Number(item.subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="border-t">
                      <td colSpan={3} className="py-3 text-right text-gray-600">
                        Subtotal
                      </td>
                      <td className="py-3 text-right font-medium">₹{Number(h.totalAmount).toFixed(2)}</td>
                    </tr>

                    <tr className="border-t">
                      <td colSpan={3} className="py-3 text-right text-gray-600">
                        Shipping
                      </td>
                      <td className="py-3 text-right font-medium">+₹{Number(h.deliveryCharge).toFixed(2)}</td>
                    </tr>

                    {
                      h.walletCashUsed > 0 &&
                      <tr className="border-t">
                        <td colSpan={3} className="py-3 text-right text-gray-600">
                          Cash Used
                        </td>
                        <td className="py-3 text-right font-medium">-₹{(h.walletCashUsed)}</td>
                      </tr>
                    }

                    {
                      h.walletCoinsUsed > 0 &&
                      <tr className="border-t">
                        <td colSpan={3} className="py-3 text-right text-gray-600">
                          Coin Used
                        </td>
                        <td className="py-3 text-right font-medium">-₹{(h.walletCoinsUsed)}</td>
                      </tr>
                    }

                    <tr className="border-t">
                      <td colSpan={3} className="py-3 text-right text-gray-900 font-semibold">
                        Grand Total
                      </td>
                      <td className="py-3 text-right text-primary text-lg font-bold">₹{Number(h.finalAmount).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          ))}

        {/* Payment History (keep old, but hide during quotation pending) */}
        {order?.payment &&
          order.payment.length > 0 &&
          order.quotationStatus !== 'SUPPORT_QUOTE_PENDING' &&
          order.quotationStatus !== 'PENDING' && (
            <Card className="col-span-1 sm:col-span-2">
              <CardTitle>Payment History</CardTitle>
              <Divider />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="py-2 text-left font-medium">Method</th>
                      <th className="py-2 text-left font-medium">Status</th>
                      <th className="py-2 text-left font-medium">Amount</th>
                      <th className="py-2 text-left font-medium">Reference</th>
                      <th className="py-2 text-right font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.payment.map((p: any, i: number) => (
                      <tr key={i} className="border-t last:border-b-0">
                        <td className="py-3 text-gray-900">{p.paymentMethod}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'PAID'
                              ? 'bg-green-100 text-green-700'
                              : p.status === 'FAILED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                              }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-900 font-semibold">₹{Number(p.amount).toFixed(2)}</td>
                        <td className="py-3 text-gray-500 font-mono text-[11px] truncate max-w-[120px]" title={p.paymentRef}>
                          {p.paymentRef || 'N/A'}
                        </td>
                        <td className="py-3 text-right text-gray-600 text-xs">
                          {p.paymentDate
                            ? format(toZonedTime(new Date(p.paymentDate + 'Z'), 'Asia/Kolkata'), 'dd MMM yyyy, hh:mm a')
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        {/* ✅ Quotation + Summary row (component + your existing summary) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <QuotationCard
            show={showQuotation}
            isQuotationExpired={isQuotationExpired}
            paymentMessage={paymentState.paymentMessage}
            amountAfterQuotation={amountAfterQuotation}
            onAccept={() => handleQuotationStatus('ACCEPTED')}
            onReject={() => handleQuotationStatus('REJECTED')}
          />

          <Card className="col-span-1">
            <Divider />
            <div className="space-y-3">
              <SummaryRow label="Items Total" value={`₹${Number(order.totalAmount).toFixed(2)}`} />
              <SummaryRow label="Discount" value={`-₹${Number(order.discountAmount || 0).toFixed(2)}`} muted />
              {order.lineItems.length > 0 && <SummaryRow label="Shipping" value={`+₹${Number(shipping || 0).toFixed(2)}`} muted />}

              {order?.walletCashUsed > 0 && <SummaryRow label="Wallet Cash Used" value={`-₹${Number(order.walletCashUsed || 0).toFixed(2)}`} muted />}
              {order?.walletCoinsUsed > 0 && <SummaryRow label="Coin Used" value={`-₹${Number(order.walletCoinsUsed || 0).toFixed(2)}`} muted />}

              <div className="border-t pt-3 mt-2">
                <SummaryRow
                  label={<span className="font-semibold text-gray-900">Total Amount</span>}
                  value={<span className="text-primary font-bold">₹{Number(order.finalAmount).toFixed(2)}</span>}
                />
              </div>
            </div>

            {canCancel && (
              <div className="mt-5">
                <button
                  onClick={openCancel}
                  className="w-full px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition cursor-pointer"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {canReturn && (
              <div className="mt-5">
                <button
                  onClick={() => dispatch(setShowReturnDrawer(true))}
                  disabled={order.returnStatus === 'RETURN_INIT'}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium transition ${order.returnStatus === 'RETURN_INIT'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                    }`}
                >
                  Return Order
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* ✅ Payment Section in same page */}
        {paymentState.shouldShowPaymentSection && !showQuotation && (
          <PaymentSection
            order={order}
            deliveryCharge={Number(order?.deliveryCharge ?? shipping)}
            onPaymentDone={async () => {
              await dispatch(fetchOrderDetail(id as string));
            }}
          />
        )}

        {/* Cashback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Number(order?.cashbackAmount) > 0 && (
            <Card className="col-span-1">
              <CardTitle>Cashback Information</CardTitle>
              <Divider />
              <InfoRow icon={<CreditCard className="w-4 h-4 text-gray-400" />} label="Cashback Status" value={order?.cashbackStatus || 'N/A'} />
              <InfoRow icon={<CreditCard className="w-4 h-4 text-gray-400" />} label="Cashback Amount" value={order?.cashbackAmount || 'N/A'} />
              <InfoRow
                icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                label="Payment Date"
                value={order.payment?.paymentDate ? format(new Date(order.payment.paymentDate), 'dd MMM yyyy, hh:mm a') : 'N/A'}
              />
            </Card>
          )}
        </div>
      </div>

      {/* Drawers */}
      {isRemarkOpen && (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/40">
          <RemarkDrawer />
        </div>
      )}

      {showReturnDrawer && <ReturnDrawer orderId={id as string} />}

      {loadingAction && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
}

/* ---------- Small UI bits ---------- */

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white border shadow-sm hover:shadow transition ${className}`}>
      <div className="p-6">{children}</div>
    </section>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-gray-900">{children}</h3>;
}

function Divider() {
  return <div className="my-4 h-px bg-gray-100" />;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-gray-600 font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}

function AddressBlock({
  name,
  line1,
  line2,
  city,
  pincode,
  state,
  phone,
}: {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  pincode?: string | number;
  state?: string;
  phone?: string | number;
}) {
  return (
    <div className="space-y-1 text-gray-700">
      {name && <p className="font-medium text-gray-900">{name}</p>}
      {line1 && <p>{line1}</p>}
      {line2 && <p>{line2}</p>}
      {(city || pincode) && (
        <p>
          {city} {city && pincode ? '-' : ''} {pincode}
        </p>
      )}
      {state && <p>{state}</p>}
      {phone && <p className="text-gray-500 text-sm mt-2">+91 {phone}</p>}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`text-gray-600 ${muted ? 'opacity-80' : ''}`}>{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
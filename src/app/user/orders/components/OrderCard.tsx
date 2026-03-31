'use client';

import { useRouter } from 'next/navigation';
import { Package, IndianRupee, CalendarDays, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { getFinalOrderStatus } from '@/utility/getFinalOrderStatus';

interface Order {
  id: string;
  orderNo: string;
  orderDate: string;
  orderStatus: string;
  rxApprovalStatus: string;
  vendorApprovalStatus?: string;
  deliveryStatus?: string;
  orderType: 'PRODUCT' | 'PRESCRIPTION';
  finalAmount: string;
  supportStaffStatus: string;
  payment?: any[];
  isModifiedByRx?: boolean;
  quotationStatus:
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'SUPPORT_QUOTE_PENDING'
  | 'SUPPORT_QUOTE_ACCEPTED'
  | 'SUPPORT_QUOTE_REJECTED'
  | 'SUPPORT_QUOTE_EXPIRED'
  | 'RX_QUOTE_PENDING'
  | 'RX_QUOTE_EXPIRED'
  | 'RX_QUOTE_ACCEPTED'
  | 'RX_QUOTE_REJECTED';
  deliveryCharge?: number | string;
}

export default function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const finalStatus = getFinalOrderStatus(order);

  // const statusClass = (status: string) => {
  //   switch (status) {
  //     case 'Delivered':
  //       return 'bg-green-100 text-green-700 border border-green-200';
  //     case 'Cancelled':
  //       return 'bg-red-100 text-red-700 border border-red-200';
  //     case 'Order Confirmed':
  //     case 'Order Placed':
  //       return 'bg-blue-100 text-blue-700 border border-blue-200';
  //     case 'Awaiting Prescription Approval':
  //     case 'Waiting for Quotation':
  //       return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  //     default:
  //       return 'bg-gray-100 text-gray-700 border border-gray-200';
  //   }
  // };

  const handleView = () => {
    router.push(`/user/orders/${order.id}`);
  };

  const statusClass = (status: string) => {
    switch (status) {
      // ✅ Delivery & Order Flow
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

      // ✅ Return Flow (New)
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

      // ✅ Default
      default:
        return 'bg-gray-100 text-gray-700 ring-1 ring-gray-200';
    }
  };



  return (
    <div
      onClick={handleView}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all p-6 mb-4 cursor-pointer"
    >
      {/* Header */}
      <div className="flex sm:flex-row justify-between sm:justify-between items-center gap-2 mb-5">
        {/* Left: Icon + Order No */}
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#20539F]" />
          <p className="font-semibold text-gray-900 text-base sm:text-lg break-all">
            Order #{order.orderNo}
          </p>
        </div>

        {/* Status Badge */}
        <span
          className={`self-start sm:self-auto text-[11px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${statusClass(finalStatus)}`}
        >
          {finalStatus}
        </span>
      </div>


      {/* Divider */}
      <div className="border-t border-gray-100 mb-4"></div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-500 text-xs">Placed On</p>
            <p className="font-medium text-gray-800">
              {format(new Date(order.orderDate), 'dd MMM yyyy, hh:mm a')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-500 text-xs">Rx Approval</p>
            {
              order.rxApprovalStatus ?
                <p
                  className={`font-medium ${order.rxApprovalStatus === 'APPROVED'
                    ? 'text-green-600'
                    : order.rxApprovalStatus === 'REJECTED'
                      ? 'text-red-600'
                      : 'text-orange-600'
                    }`}
                >
                  {order.rxApprovalStatus.replace(/_/g, ' ')}
                </p> : "N/A"
            }

          </div>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-500 text-xs">Final Amount</p>
            <p className="font-semibold text-gray-900">₹{Number(order.finalAmount).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleView();
          }}
          className="text-[#20539F] text-sm font-medium hover:underline"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}

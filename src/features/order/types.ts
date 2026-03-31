// ✅ Delivery address inside an order
export interface DeliveryAddress {
  name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city_district: string;
  pincode: string;
  state: string;
  lat: number | null;
  lng: number | null;
}

// ✅ Order item
export interface OrderItem {
  medicineId: string;
  quantity: number;
  mrpAtOrder?: number;
  salePriceAtOrder?: number;
}

// ✅ Create product order payload
export interface CreateProductOrderPayload {
  deliveryDate?: string | null;
  deliveryAddress: DeliveryAddress;
  discountAmount?: number;

  items: { medicineId: string; quantity: number }[];
  prescription?: string[];
  familyMemberIds?: string[];

  paymentMethod: string;

  // Correct field names (backend compatible)
  cashUsed: number;
  isCoinsUsed: boolean;
  offerCode?: string | null;
}

// ✅ Create prescription order payload
export interface CreatePrescriptionOrderPayload {
  deliveryAddress: DeliveryAddress;
  followUpAction: 'callMe' | 'fullOrder';
  prescription: string[];
  familyMemberIds?: string[];
}

// ✅ Common types (same as before)
export interface OrderSummary {
  id: string;
  order_number?: string;
  order_status?: string;
  total_amount?: number;
  created_at?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  status: string;
  amount: number;
  paymentMethod: string;
  instrumentType?: string;
  paymentRef?: string;
  transactionId?: string;
  paymentDate?: string;
  refundRef?: string;
  created_at: string;
}

export interface OrderDetail extends OrderSummary {
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  discountAmount?: number;
  payment?: Payment[];
  prescription?: string[];
  orderType: string[];
  quotationStatus: string;
  isModifiedByRx: string;
  order_history: OrderHistory[];
  status: string;
}

export interface OrderHistory {
  id: string;
  orderNo: string;
  deliveryCharge: number;
  totalAmount: string;
  finalAmount: string;
  offerId: string;
  offerCodeUsed: string;
  isCashbackOffer: boolean;
  cashbackAmount: string;
  cashbackStatus: string;
  discountAmount: string;
  walletCashUsed: string;
  walletCoinsUsed: string;
  changedBy: string;
}

export interface CreateOrderResponse {
  data: Record<string, never>;
  status: string;
  message: string;
  errors: any;
}

export interface OrderListResponse {
  data: {
    total_count: number;
    orders: OrderSummary[];
  };
  status: string;
  message: string;
  errors: any;
}

export interface OrderDetailResponse {
  data: null;
  status: string;
  message: string;
  errors: any;
}

// Request body sent in API call
export interface CancelOrderRequest {
  reasonOfCancel: string;
}

// Response body received from API
export interface OrderDetails {
  id: string;
  userId: string;
  createdById: string;
  orderNo: string;
  rxAdminId: string | null;
  orderDate: string;
  deliveryDate: string | null;
  vendorAdminId: string;
  orderType: string;
  orderStatus: string;
  followUpAction: string | null;
  deliveryStatus: string;
  rxApprovalStatus: string;
  vendorApprovalStatus: string;
  returnStatus: string | null;
  totalAmount: string;
  discountAmount: string;
  finalAmount: string;
  isDeleted: boolean;
  reasonOfCancel: string | null;
  reasonOfReturn: string | null;
  vendorRejectReason: string | null;
  rxRejectReason: string | null;
  remark: string | null;
  updated_at: string;
}

export interface CancelOrderResponse {
  data: Partial<OrderDetail>;
  status: string;
  message: string;
  errors: any;
}

// ✅ Only orderId goes in params for thunk
export interface CancelOrderParams {
  orderId: string;
  body: CancelOrderRequest; // body contains reasonOfCancel
}
// ✅ Order Return Payload
export interface ReturnOrderPayload {
  orderId: string;
  reasonOfReturn: string;
  images?: string[];
  upiIdForCODRefund?: string;
  refundDestination: 'WALLET_CASH' | 'BANK_ACCOUNT';
}

// ✅ Order Return Response
export interface ReturnOrderResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    returnStatus: string;
    returnedItems: {
      orderLineItemId: string;
      medicineId: string;
      medicineName: string;
      quantity: number;
      pricePerUnit: number;
      refundAmount: number;
    }[];
    totalRefundAmount: number;
  };
}

export interface UploadProofResponse {
  success: boolean;
  url: string;
}

export interface Delivery {
  id: string;
  amount: number;
  is_active: boolean;
  min_purchase_amount: number;
}

export interface DeliveryResponse {
  data: Delivery;
  status: string;
  message: string;
  errors: any;
}

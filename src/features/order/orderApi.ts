import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type {
  CreateProductOrderPayload,
  CreatePrescriptionOrderPayload,
  CreateOrderResponse,
  OrderListResponse,
  OrderDetailResponse,
  OrderSummary,
  OrderDetail,
  ReturnOrderPayload,
  ReturnOrderResponse,
  UploadProofResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  Delivery,
  DeliveryResponse,
} from './types';
import axios from 'axios';
import { Toast } from '@/components/ui/toast';

;
export const createProductOrderApi = async (
  payload: CreateProductOrderPayload
): Promise<{ orderId: string; message: string; status: string }> => {
  console.log('📤 Sending order creation request:', payload);

  const response = await api.post(ENDPOINTS.ORDER.CREATE_PRODUCT, payload);

  console.log('📥 Order creation response:', response.data);
  console.log('📥 Full response:', response);

  // Check if the response structure matches what we expect
  if (response.data && response.data.data && response.data.data.order) {
    return {
      orderId: response.data.data.order.id,
      message: response.data.message,
      status: response.data.status,
    };
  } else {
    console.error('❌ Unexpected response structure:', response.data);
    throw new Error('Unexpected response structure from order creation API');
  }
};
// ✅ Initiate payment
// ✅ Initiate payment - Modified to handle redirect URL
// ✅ Initiate payment - Build redirect URL with orderId
// ✅ Initiate payment - Backend handles redirect
export const initiatePaymentApi = async (orderId: string): Promise<{ redirectUrl: string }> => {
  try {
    console.log('Calling payment initiate API with orderId:', orderId);
    localStorage.setItem(`order`, JSON.stringify(orderId));

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/initiate?orderId=${orderId}`
    );

    console.log('Payment API response:', response.data);

    // Backend should return the payment gateway URL
    if (response.data.redirectUrl) {
      return { redirectUrl: response.data.redirectUrl };
    }

    throw new Error('No redirect URL in response');

  } catch (error) {
    console.error('Payment initiation API error:', error);
    throw error;
  }
};


// ✅ Create prescription order
export const createPrescriptionOrderApi = async (
  payload: CreatePrescriptionOrderPayload
): Promise<string> => {
  const { data } = await api.post<CreateOrderResponse>(
    ENDPOINTS.ORDER.CREATE_PRESCRIPTION,
    payload
  );
  return data.message;
};

export const updatePrescriptionOrderPaymentApi = async (
  orderId: string,
  payload: {
    paymentMethod: 'Online' | 'COD';
    cashUsed?: number;
    isCoinsUsed?: boolean;
    offerCode?: string | null;
  }
): Promise<{ message: string; status: string }> => {
  console.log('🔄 Updating prescription order payment:', {
    orderId,
    ...payload
  });

  const response = await api.patch(
    `${ENDPOINTS.ORDER.BASE}/prescription/${orderId}`,
    {
      paymentMethod: payload.paymentMethod,
      cashUsed: payload.cashUsed ?? 0,
      isCoinsUsed: payload.isCoinsUsed ?? false,
      offerCode: payload.offerCode,
    }
  );

  console.log('📥 Payment update response:', response.data);

  if (response.data && response.data.status === 'success') {
    return {
      message: response.data.message,
      status: response.data.status,
    };
  }


  console.error('❌ Payment update failed:', response.data);
  throw new Error(response.data?.message || 'Failed to update payment method');
};

// ✅ Update quotation payment (for RX-modified orders)
export const updateQuotationPaymentApi = async (
  orderId: string,
  payload: {
    paymentMethod: 'Online' | 'COD';
    cashUsed?: number;
    isCoinsUsed?: boolean;
    offerCode?: string | null;
  }
): Promise<{ message: string; status: string }> => {
  console.log('🔄 Updating quotation payment:', {
    orderId,
    ...payload
  });

  const response = await api.patch(
    ENDPOINTS.ORDER.QUOTATION_PAYMENT_UPDATE(orderId),
    {
      paymentMethod: payload.paymentMethod,
      cashUsed: payload.cashUsed ?? 0,
      isCoinsUsed: payload.isCoinsUsed ?? false,
      offerCode: payload.offerCode,
    }
  );

  console.log('📥 Quotation payment update response:', response.data);

  if (response.data && response.data.status === 'success') {
    return {
      message: response.data.message,
      status: response.data.status,
    };
  }

  console.error('❌ Quotation payment update failed:', response.data);
  throw new Error(response.data?.message || 'Failed to update quotation payment');
};



// ✅ Get customer’s all orders
export const fetchOrdersApi = async (queryString?: string): Promise<OrderSummary[]> => {
  const url = queryString ? `${ENDPOINTS.ORDER.BASE}?${queryString}` : ENDPOINTS.ORDER.BASE;

  const { data } = await api.get<OrderListResponse>(url);
  return data.data.orders;
};


// ✅ Get single order details
export const fetchOrderDetailApi = async (id: string): Promise<OrderDetail> => {
  const { data } = await api.get<OrderDetailResponse>(ENDPOINTS.ORDER.DETAIL(id));
  return data.data;
};
export const updateQuotationStatusApi = async (id: string, quotationStatus: string): Promise<OrderDetailResponse> => {
  const { data } = await api.patch(ENDPOINTS.ORDER.QOUTATION_STATUS_UPDATE(id), { quotationStatus });
  return data;
};



export const cancelOrderApi = async (
  orderId: string,
  body: CancelOrderRequest
): Promise<CancelOrderResponse> => {
  const { data } = await api.post<CancelOrderResponse>(
    ENDPOINTS.ORDER.CANCEL(orderId),
    body
  );
  return data;
};

// ✅ Return order API
export const returnOrderApi = async (
  orderId: string,
  payload: ReturnOrderPayload
): Promise<ReturnOrderResponse> => {
  try {
    console.log('📦 Initiating return for order:', orderId, payload);

    // ✅ Only send what backend expects
    const body = {
      reasonOfReturn: payload.reasonOfReturn,
      images: payload.images,
      upiIdForCODRefund: payload.upiIdForCODRefund,
      refundDestination: payload.refundDestination,
    };

    const { data } = await api.patch<ReturnOrderResponse>(
      ENDPOINTS.ORDER.RETURN(orderId),
      body
    );

    console.log('📥 Return order response:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Error returning order:', error);
    throw error.response?.data || error;
  }
};


export const uploadReturnProofApi = async (file: File): Promise<UploadProofResponse> => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowed.includes(file.type)) throw new Error('Unsupported file type');
  if (file.size > 5 * 1024 * 1024) throw new Error('File too large (max 5MB)');

  // Get Cloudinary signature from backend
  const folder = 'return_proofs';
  const { data: sigResponse } = await api.post(ENDPOINTS.CLOUDINARY.SIGNATURE, { folder });

  const { signature, timestamp, cloudname, api_key } = sigResponse.data;
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`;

  // Upload to Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', api_key);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);

  const cloudRes = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return {
    success: true,
    url: cloudRes.data.secure_url,
  };
};

export const fetchDeliveryChargeApi = async (): Promise<Delivery> => {
  const { data } = await api.get<DeliveryResponse>(ENDPOINTS.DELIVERY.BASE);
  return data.data;
};


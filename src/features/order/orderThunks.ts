import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createProductOrderApi,
  createPrescriptionOrderApi,
  fetchOrdersApi,
  fetchOrderDetailApi,
  cancelOrderApi,
  returnOrderApi,
  fetchDeliveryChargeApi,
  updateQuotationStatusApi,
} from './orderApi';
import type {
  CreateProductOrderPayload,
  CreatePrescriptionOrderPayload,
  OrderSummary,
  OrderDetail,
  ReturnOrderResponse,
  ReturnOrderPayload,
  CancelOrderResponse,
  CancelOrderParams,
  Delivery,
  OrderDetailResponse,
} from './types';

export const createProductOrder = createAsyncThunk<
  { orderId: string; message: string },
  CreateProductOrderPayload,
  { rejectValue: string }
>('order/createProductOrder', async (payload, thunkAPI) => {
  try {
    console.log('🔄 createProductOrder thunk - payload:', payload);

    const { orderId, message, status } = await createProductOrderApi(payload);

    console.log('✅ createProductOrder thunk - response:', { orderId, message, status });

    if (!orderId) {
      console.error('❌ createProductOrder thunk - No orderId returned');
      return thunkAPI.rejectWithValue('Order failed to create - no order ID returned');
    }

    if (status !== 'success') {
      console.error('❌ createProductOrder thunk - API returned non-success status:', status);
      return thunkAPI.rejectWithValue(`Order creation failed: ${message}`);
    }

    return { orderId, message };
  } catch (err: any) {
    console.error('💥 createProductOrder thunk - Error:', err);

    const errorMsg =
      err?.response?.data?.message ?? err?.message ?? 'Failed to create product order';

    console.log('Error response data:', err?.response?.data);
    return thunkAPI.rejectWithValue(errorMsg);
  }
});

// ✅ Create prescription order
export const createPrescriptionOrder = createAsyncThunk<
  string,
  CreatePrescriptionOrderPayload,
  { rejectValue: string }
>('order/createPrescriptionOrder', async (payload, thunkAPI) => {
  try {
    return await createPrescriptionOrderApi(payload);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message ?? 'Failed to create prescription order'
    );
  }
});

// ✅ Fetch all orders
export const fetchOrders = createAsyncThunk<
  OrderSummary[],
  { search_term?: string; orderStatus?: string } | void,
  { rejectValue: string }
>('order/fetchOrders', async (params, thunkAPI) => {
  try {
    // Build query string if params exist
    const query = params
      ? new URLSearchParams({
          ...(params.search_term ? { search_term: params.search_term } : {}),
          ...(params.orderStatus ? { orderStatus: params.orderStatus } : {}),
        }).toString()
      : '';

    // Call API
    return await fetchOrdersApi(query);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message ?? 'Failed to fetch orders');
  }
});

// ✅ Fetch single order detail
export const fetchOrderDetail = createAsyncThunk<OrderDetail, string, { rejectValue: string }>(
  'order/fetchOrderDetail',
  async (id, thunkAPI) => {
    try {
      return await fetchOrderDetailApi(id);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ?? 'Failed to fetch order details'
      );
    }
  }
);
export const updateQuotationStatus = createAsyncThunk<
  OrderDetailResponse,
  { id: string; quotationStatus: string },
  { rejectValue: string }
>('order/updateQuotationStatus', async ({ id, quotationStatus }, thunkAPI) => {
  try {
    const response = await updateQuotationStatusApi(id, quotationStatus);
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message ?? 'Failed to update quotation status'
    );
  }
});

export const cancelOrder = createAsyncThunk<
  CancelOrderResponse, // ✅ Return type
  CancelOrderParams, // ✅ Arg type with orderId + body
  { rejectValue: string }
>('order/cancelOrder', async ({ orderId, body }, thunkAPI) => {
  try {
    const response = await cancelOrderApi(orderId, body);
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message ?? 'Failed to cancel order');
  }
});

// ✅ Return Order
export const returnOrder = createAsyncThunk<
  ReturnOrderResponse,
  ReturnOrderPayload,
  { rejectValue: string }
>('order/returnOrder', async (payload, thunkAPI) => {
  try {
    const response = await returnOrderApi(payload.orderId, payload);
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.message || err?.response?.data?.message || 'Failed to return order'
    );
  }
});

export const fetchDeliveryCharge = createAsyncThunk<Delivery, void, { rejectValue: string }>(
  'common/delivery-charge',
  async (_, thunkAPI) => {
    try {
      return await fetchDeliveryChargeApi();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message ?? 'Failed to load charges');
    }
  }
);

import { createSlice } from '@reduxjs/toolkit';
import {
  createProductOrder,
  createPrescriptionOrder,
  fetchOrders,
  fetchOrderDetail,
  cancelOrder,
  returnOrder,
  fetchDeliveryCharge,
} from './orderThunks';
import type { OrderSummary, OrderDetail, Delivery } from './types';
import { Toast } from '@/components/ui/toast';

interface OrderState {
  orders: OrderSummary[];
  selectedOrder?: OrderDetail | null;
  deliveryCharges: Delivery | null;
  loading: boolean;
  error?: string;
  successMessage?: string;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  deliveryCharges: null,
  loading: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.error = undefined;
      state.successMessage = undefined;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Create product order
      .addCase(createProductOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.successMessage = undefined;
      })
      .addCase(createProductOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || 'Order placed successfully';
        Toast(state.successMessage);
      })
      .addCase(createProductOrder.rejected, (state, action) => {
        state.loading = false;
        const errorMessage =
          (action.payload as string) || (action.error?.message ?? 'Failed to place order');
        state.error = errorMessage;
        Toast(errorMessage);
      })

      // ✅ Create prescription order
      .addCase(createPrescriptionOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.successMessage = undefined;
      })
      .addCase(createPrescriptionOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
        Toast('Prescription order placed successfully');
      })
      .addCase(createPrescriptionOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        Toast('Failed to place prescription order');
      })

      // ✅ Fetch orders list
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch order detail
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedOrder) {
          state.selectedOrder = {
            ...state.selectedOrder,
            ...action.payload.data,
          } as OrderDetail; // ✅ assert back to full type
        }
        Toast(action.payload.message || "Order cancelled successfully.");
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload ?? "Error cancelling order.";
        state.error = errorMessage;
        Toast(errorMessage);
      })
      // ✅ Return Order
      .addCase(returnOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(returnOrder.fulfilled, (state, action) => {
        state.loading = false;
        const { message, data } = action.payload;

        Toast(`${message} | Refund: ₹${data.totalRefundAmount.toFixed(2)}`);
      })
      .addCase(returnOrder.rejected, (state, action) => {
        state.loading = false;
        const errorMessage =
          action.payload || action.error?.message || 'Failed to return order';
        Toast(errorMessage);
        state.error = errorMessage;
      })
      .addCase(fetchDeliveryCharge.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveryCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryCharges = action.payload;
      })
      .addCase(fetchDeliveryCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearOrderState, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;

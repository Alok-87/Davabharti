
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { fetchCart, addToCart, deleteCartItem, updateCart } from './cartThunks';
import type { Cart } from './types';
import { Toast } from '@/components/ui/toast';

interface CartState {
  carts: Cart[];
  loading: boolean;
  error?: string;
  successMessage?: string;
}

const initialState: CartState = {
  carts: [],
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.error = undefined;
      state.successMessage = undefined;
    },
    // ✅ Add this clearCart action
    clearCart: (state) => {
      state.carts = [];
      state.loading = false;
      state.error = undefined;
      state.successMessage = undefined;
    },
    // ✅ Add this to force refresh cart data
    refreshCart: (state) => {
      // This will trigger a re-fetch when used with useEffect
      state.loading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // ✅ Improved add to cart logic
        const updatedCart = action.payload;
        const existingCartIndex = state.carts.findIndex(cart => cart.id === updatedCart.id);

        if (existingCartIndex >= 0) {
          state.carts[existingCartIndex] = updatedCart;
        } else {
          state.carts.push(updatedCart);
        }

        state.successMessage = 'Item added to cart';
        Toast('Item added to cart');
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        const backendMessage = payload;
        state.error = backendMessage;
        Toast(backendMessage);
      })
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCart = action.payload;
        state.carts = state.carts.map((cart) => (cart.id === updatedCart.id ? updatedCart : cart));
        state.successMessage = 'Cart updated successfully';
        Toast('Cart updated successfully');
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update cart';
        Toast('Failed to update cart');
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const deletedItemId = action.payload;
        state.carts = state.carts.map((cart) => ({
          ...cart,
          items: cart.items.filter((item) => item.id !== deletedItemId),
        }));
        state.successMessage = 'Item removed from cart';
        Toast('Item removed from cart');
      });
  },
});

export const { clearCartState, clearCart, refreshCart } = cartSlice.actions;
export default cartSlice.reducer;

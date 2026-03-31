import { createAsyncThunk } from '@reduxjs/toolkit';
import { addToCartApi, fetchCartApi, deleteCartItemApi, updateCartApi } from './cartApi';
import type { AddToCartPayload, Cart, UpdateCartPayload } from './types';

export const fetchCart = createAsyncThunk<Cart[], void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    try {
      return await fetchCartApi();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message ?? 'Failed to load cart');
    }
  }
);

export const addToCart = createAsyncThunk<Cart, AddToCartPayload, { rejectValue: Cart }>(
  'cart/addToCart',
  async (payload, thunkAPI) => {
    try {
      return await addToCartApi(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message ?? 'Failed to add to cart');
    }
  }
);

export const updateCart = createAsyncThunk<
  Cart,
  { id: string; payload: UpdateCartPayload },
  { rejectValue: string }
>('cart/updateCart', async ({ id, payload }, thunkAPI) => {
  try {
    return await updateCartApi(id, payload);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message ?? 'Failed to update cart');
  }
});

export const deleteCartItem = createAsyncThunk<string, string, { rejectValue: string }>(
  'cart/deleteCartItem',
  async (id, thunkAPI) => {
    try {
      await deleteCartItemApi(id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message ?? 'Failed to delete item');
    }
  }
);

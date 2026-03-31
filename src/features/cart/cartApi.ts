import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type {
  AddToCartPayload,
  CartResponse,
  AddToCartResponse,
  Cart,
  UpdateCartPayload,
  UpdateCartResponse,
} from './types';

// ✅ Add to cart
export const addToCartApi = async (payload: AddToCartPayload): Promise<Cart> => {
  const { data } = await api.post<AddToCartResponse>(ENDPOINTS.CART.BASE, payload);
  return data.data.cart;
};

// ✅ Get cart
export const fetchCartApi = async (): Promise<Cart[]> => {
  const { data } = await api.get<CartResponse>(ENDPOINTS.CART.BASE);
  return data.data;
};

// ✅ Delete cart item
export const deleteCartItemApi = async (id: string): Promise<void> => {
  await api.delete(ENDPOINTS.CART.ITEM(id));
};

// ✅ Update cart item
export const updateCartApi = async (id: string, payload: UpdateCartPayload): Promise<Cart> => {
  const { data } = await api.patch<UpdateCartResponse>(ENDPOINTS.CART.ITEM(id), payload);
  return data.data.cart;
};

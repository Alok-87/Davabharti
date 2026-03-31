import { Category } from "../medicines/types";

export interface CartItem {
  id: string;
  quantity: number;
  priceAtTime: number;
  medicine: {
    id: string;
    productName: string;
    productCode: string;
    prescriptionRequired: boolean;
    packagingSize: string;
    images?: string[];
    categories?:Category[]
  };
}

export interface Cart {
  id: string;
  total_items: number;
  sub_total: string;
  items: CartItem[];
}

export interface AddToCartPayload {
  medicineId: string;
  quantity: number;
}

export interface CartResponse {
  data: Cart[];
  status: string;
  message: string;
  errors: any;
}

export interface AddToCartResponse {
  data: { cart: Cart };
  status: string;
  message: string;
  errors: any;
}

export interface UpdateCartPayload {
  id: string;
  quantity: number;
}

export interface UpdateCartResponse {
  data: { cart: Cart };
  status: string;
  message: string;
  errors: any;
}

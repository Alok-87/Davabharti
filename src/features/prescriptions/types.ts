// features/prescription/types.ts
export type ID = string;

export type Prescription = {
  url: string;
};

export type UploadResponse = {
  success: boolean;
  prescription: Prescription;
};

export type User = {
  id: ID;
  name: string;
  email?: string;
  phone?: string;
};

export type Address = {
  id: ID;
  userId: ID;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

export type OrderRequest = {
  user: User;
  address: Address;
  prescriptionUrl: string;
  items?: Array<{ sku: string; qty: number }>; // optional demo
};

export type OrderResponse = {
  orderId: ID;
  placedAt: string;
  status: 'created' | 'processing' | 'confirmed';
};

// Request Body Type
export interface UploadPrescriptionRequest {
  folder: string;
  file: File; // assuming you're uploading a file
}

// Response Type
export interface UploadPrescriptionResponse {
  url: string;
}
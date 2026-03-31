export type SellerType = 'RETAIL' | 'WHOLESALE' | 'MANUFACTURER';
export type ProductType = 'RX' | 'OTC' | 'BOTH';
export type DocumentType = 'PAN' | 'AADHAR' | 'GST' | 'DRUG_LICENSE';
export type VendorStatus =
  | 'BASICDETAILS_SUBMITTED'
  | 'DOCUMENTS_SUBMITTED'
  | 'BANKDETAILS_SUBMITTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'AGREEMENT_GENERATED'
  | 'AGREEMENT_SENT'
  | 'AGREEMENT_SIGNED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'INACTIVE';

type TimetableDay = {
  day: string;
  open_time?: string;
  close_time?: string;
  isClosed?: boolean;
};
export interface BasicDetailsPayload {
  business_name: string;
  owner_name: string;
  seller_type: SellerType;
  product_type: ProductType;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  shop_open_time?: string;
  shop_close_time?: string;
  lat: number;
  lng: number;
  // Step 4 (Timetable)
  timetable?: TimetableDay[];
}

export interface VendorDocument {
  id?: string;
  document_type: DocumentType;
  document_number: string;
  file_url: string;
  state_code?: string; // For Drug License
  valid_from?: string;
  valid_to?: string;
  verification_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BankAccount {
  id?: string;
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  is_primary?: boolean;
  verification_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StatusLog {
  id: string;
  vendor_id: string;
  status: VendorStatus;
  reason: string | null;
  created_at: string;
}

export interface Agreement {
  id: string;
  vendor_id: string;
  agreement_url: string;
  status: string;
  created_at: string;
  [key: string]: any;
}

export interface Vendor {
  id: string;
  business_name: string;
  seller_type: SellerType;
  product_type: ProductType;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  shop_open_time?: string | null;
  shop_close_time?: string | null;
  status: VendorStatus;

  is_email_verified: boolean;
  is_mobile_verified: boolean;

  leegality_document_id?: string | null;
  leegality_signing_url?: string | null;
  leegality_status?: string | null;

  created_at: string;
  updated_at: string;

  documents: VendorDocument[];
  bank_accounts: BankAccount[];
  status_logs: StatusLog[];
  agreements: Agreement[];
}

// Form specific types
export interface OnboardingFormValues extends BasicDetailsPayload {
  mobileOtp?: string;
  emailOtp?: string;
  alternateMobile?: string;
  alternateEmail?: string;
  referralSource?: string;
  otherInfo?: string;
  businessAddress?: string; // Mapped to 'address'
  country?: string;

  // Step 2 & 3 Data
  documents: VendorDocument[];
  bank_accounts: BankAccount[];
}

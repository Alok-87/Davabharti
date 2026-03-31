export type Gender = "MALE" | "FEMALE" | "OTHER";

export type DoctorDocumentType =
  | "DEGREE"
  | "REGISTRATION_CERTIFICATE"
  | "GOVT_ID"
  | "CLINIC_PROOF"
  | "OTHER";

export interface DoctorTimetableItem {
  day_of_week: number; // 0-6 or 1-7 based on backend convention
  start_time: string; // "HH:mm"
  end_time: string;   // "HH:mm"
  is_active: boolean;
}

export interface CreateDoctorProfileRequest {
  fullName: string;
  email: string;
  mobilePhone: string;
  registrationNumber: string;
  gender: Gender;
  dateOfBirth: string; // "YYYY-MM-DD"
  biography: string;
  experience: number;
  consultationFee: number;
  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
  clinicPincode: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  specializations: string[];
  services: string[];
  symptoms: string[];
  timetable: DoctorTimetableItem[];
}

export interface DoctorProfileResponse {
  id: string;
  fullName: string;
  email: string;
  mobilePhone: string;
  registrationNumber: string;
  gender: Gender;
  dateOfBirth: string;
  biography: string;
  experience: number;
  consultationFee: number;
  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
  clinicPincode: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  specializations: string[];
  services: string[];
  symptoms: string[];
  timetable: DoctorTimetableItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorDocumentItemRequest {
  document_type: DoctorDocumentType;
  document_number: string;
  file_url: string;
}

export interface AddDoctorDocumentsRequest {
  doctor_id: string;
  documents: DoctorDocumentItemRequest[];
}

export interface DoctorDocumentItemResponse {
  id: string;
  doctor_id: string;
  document_type: DoctorDocumentType;
  document_number: string;
  file_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddDoctorDocumentsResponse {
  doctor_id: string;
  documents: DoctorDocumentItemResponse[];
}

export interface DoctorBankAccountItemRequest {
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  is_primary: boolean;
}

export interface AddDoctorBankAccountsRequest {
  doctor_id: string;
  bank_accounts: DoctorBankAccountItemRequest[];
}

export interface DoctorBankAccountItemResponse {
  id: string;
  doctor_id: string;
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  is_primary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddDoctorBankAccountsResponse {
  doctor_id: string;
  bank_accounts: DoctorBankAccountItemResponse[];
}


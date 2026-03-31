export interface DoctorSpecialization {
  id: string;
  name: string;
}

export interface DoctorService {
  id: string;
  name: string;
}

export interface DoctorSymptom {
  id: string;
  name: string;
}

export interface Doctor {
  id: string;
  doctor_id: string;
  user_id: string;
  email: string;
  phone: string;
  fullName: string;
  name: string;
  gender: string;
  dob: string | null;
  registrationNumber: string | null;
  bio: string | null;
  degree: string | null;
  experience: number;
  consultationFee: string;
  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
  clinicPincode: string;
  address_line_1: string;
  city: string;
  postal_code: string;
  status: string;
  onboardingSource: string;
  profileImageUrl: string | null;
  signatureImageUrl: string | null;
  is_email_verified: boolean;
  is_mobile_verified: boolean;
  createdAt: string;
  updatedAt: string;
  onboardingStep: number;
  specializations: DoctorSpecialization[];
  services: DoctorService[];
  symptoms: DoctorSymptom[];
  rating: number;
  reviewCount: number;
}

export interface DoctorsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DoctorsData {
  doctors: Doctor[];
  meta: DoctorsMeta;
}

export interface DoctorsResponse {
  data: DoctorsData;
  status: string;
  message: string;
  errors: unknown;
}

export interface DoctorDetailsApiResponse {
  data: DoctorDetails;
  status: 'success' | 'error';
  errors: unknown | null;
}

export interface DoctorDetails {
  id: string;
  doctor_id: string;
  user_id: string;
  email: string;
  phone: string;
  fullName: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string | null;
  registrationNumber: string | null;
  bio: string | null;
  degree: string | null;
  experience: number | null;
  consultationFee: string | null;
  clinicName: string | null;
  clinicAddress: string | null;
  clinicCity: string | null;
  clinicPincode: string | null;
  address_line_1: string | null;
  city: string | null;
  postal_code: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED' | string;
  onboardingSource: 'ADMIN_CREATED' | 'SELF_ONBOARDED' | string;
  profileImageUrl: string | null;
  signatureImageUrl: string | null;
  is_email_verified: boolean;
  is_mobile_verified: boolean;
  createdAt: string;
  updatedAt: string;
  onboardingStep: number;
  specializations: DoctorSpecialization[];
  services: DoctorService[];
  symptoms: DoctorSymptom[];
  availability: DoctorAvailability[];
  rating: number;
  reviewCount: number;
  reviews: DoctorReview[];
}

export interface DoctorAvailability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

export interface DoctorReview {
  id?: string;
  patientName?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
}

export type AppointmentBookingPayload = {
  doctorId: string;
  slotId: string;
  appointmentDate: string;
  appointmentTime: string;
  symptoms: string;
  patientType: 'SELF' | 'FAMILY_MEMBER';
  familyMemberId?: string; 
  consultationType: 'ONLINE' | 'OFFLINE';
};

export type AppointmentBookingResponse = {
  doctorId: string;
  slotId: string;
  appointmentDate: string;
  appointmentTime: string;
  symptoms: string;
  patientType: 'SELF' | 'FAMILY_MEMBER';
  familyMemberId?: string; 
  consultationType: 'ONLINE' | 'OFFLINE';
};

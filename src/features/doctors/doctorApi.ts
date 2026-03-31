import api from '@/lib/axios';
import { DoctorsResponse, Doctor, AppointmentBookingPayload, AppointmentBookingResponse} from './types';
import { DoctorDetails } from './types';
import { DoctorDetailsApiResponse } from './types';


// ✅ Get cart
export const fetchDoctorListApi = async (): Promise<Doctor[]> => {
  const { data } = await api.get<DoctorsResponse>('/doctors/public');
  return data.data.doctors;
};

export const fetchDoctorDetailApi = async (id: string): Promise<DoctorDetails> => {
  const { data } = await api.get<DoctorDetailsApiResponse>(`/doctors/public/${id}`);
  return data.data;
};

export const bookAppointmentApi = async (payload: AppointmentBookingPayload): Promise<AppointmentBookingResponse> => {
  const { data } = await api.post<AppointmentBookingResponse>('/doctors/appointments', payload);
  return data;
};

// doctorService.ts
export const initiateAppointmentPaymentApi = async (appointmentId: string) => {
  const res = await api.get(`/payment/doctor/initiate?appointmentId=${appointmentId}`);
  return res.data;
};

export const getAppointmentsApi = async (status: string, page: number, limit: number) => {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;
  const res = await api.get('/doctors/appointments', { params });
  return res.data.data;
};

export const getAppointmentDetailApi = async (id :string) => {
  const res = await api.get(`/doctors/appointments/${id}`);
  return res.data.data;
};

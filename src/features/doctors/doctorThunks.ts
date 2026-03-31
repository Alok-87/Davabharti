import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  bookAppointmentApi,
  fetchDoctorDetailApi,
  fetchDoctorListApi,
  getAppointmentDetailApi,
  getAppointmentsApi,
  initiateAppointmentPaymentApi,
} from './doctorApi';
import {
  AppointmentBookingPayload,
  AppointmentBookingResponse,
  Doctor,
  DoctorDetails,
} from './types';
import api from '@/lib/axios';

export const fetchDoctorsList = createAsyncThunk<Doctor[], void, { rejectValue: string }>(
  'doctor/fetchDoctors',
  async (_, thunkAPI) => {
    try {
      return await fetchDoctorListApi();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message);
    }
  }
);

export const fetchDoctorsDetail = createAsyncThunk<DoctorDetails, string, { rejectValue: string }>(
  'doctor/fetchDoctorDetail',
  async (id, thunkAPI) => {
    try {
      return await fetchDoctorDetailApi(id);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || 'Failed to fetch doctor details'
      );
    }
  }
);

export const bookAppointment = createAsyncThunk<
  AppointmentBookingResponse,
  AppointmentBookingPayload,
  { rejectValue: AppointmentBookingResponse }
>('doctor/bookAppointment', async (payload, thunkAPI) => {
  try {
    return await bookAppointmentApi(payload);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Failed to book Appointment');
  }
});

// doctorThunks.ts
export const initiatePayment = createAsyncThunk(
  'doctors/initiatePayment',
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const data = await initiateAppointmentPaymentApi(appointmentId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Payment initiation failed');
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'doctors/fetchAppointments',
  async (
    { status, page, limit }: { status: string; page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      return await getAppointmentsApi(status, page, limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchAppointmentDetail = createAsyncThunk(
  'doctors/fetchAppointmentDetail',
  async (id, { rejectWithValue}
  ) => {
    try {
      return await getAppointmentDetailApi(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const PaymentDone = createAsyncThunk(
  "status/done",
  async (appointment_id,{ rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/doctors/appointments/dev/mark-payment-done/${appointment_id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

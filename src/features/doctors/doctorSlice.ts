import { createSlice } from '@reduxjs/toolkit';
import {
  bookAppointment,
  fetchAppointmentDetail,
  fetchAppointments,
  fetchDoctorsDetail,
  fetchDoctorsList,
  initiatePayment,
} from './doctorThunks';
import { Doctor, DoctorDetails } from './types';

interface DoctorState {
  doctors: Doctor[];
  doctorDetail: DoctorDetails | null;
  loading: boolean;
  error?: string;
  successMessage?: string;
  appointments: [];
  appointment: any | null;
  meta: any | null;
}

const initialState: DoctorState = {
  doctors: [],
  appointments: [],
  appointment: null,
  doctorDetail: null,
  loading: false,
  meta: null,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.error = undefined;
      state.successMessage = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorsList.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctorsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDoctorsDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorsDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorDetail = action.payload;
      })
      .addCase(fetchDoctorsDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = [...(action.payload.appointments ?? [])].sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        state.meta = action.payload.meta;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(fetchAppointmentDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointmentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload;
      })
      .addCase(fetchAppointmentDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = doctorSlice.actions;
export default doctorSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  createInquiry,
  getMyInquiries,
  createMedicineRequest,
  getMyMedicineRequests,
} from './inquiryThunks';
import type { Inquiry, MedicineRequest } from './types';
import { Toast } from '@/components/ui/toast';

interface InquiryState {
  inquiries: Inquiry[];
  medicineRequests: MedicineRequest[];
  loading: boolean;
  error?: string;
  successMessage?: string;
}

const initialState: InquiryState = {
  inquiries: [],
  medicineRequests: [],
  loading: false,
};

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    clearInquiryState: (state) => {
      state.error = undefined;
      state.successMessage = undefined;
    },
  },
  extraReducers: (builder) => {
    /* ----------------------------- CREATE INQUIRY ----------------------------- */
    builder
      .addCase(createInquiry.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries.unshift(action.payload);
        state.successMessage = 'Inquiry created successfully';
        Toast('Inquiry created successfully');
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create inquiry';
        Toast(state.error);
      });

    /* ------------------------------ GET INQUIRIES ----------------------------- */
    builder
      .addCase(getMyInquiries.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getMyInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload;
      })
      .addCase(getMyInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) ?? 'Failed to fetch inquiries';
        Toast(state.error);
      });

    /* ------------------------ CREATE MEDICINE REQUEST ------------------------ */
    builder
      .addCase(createMedicineRequest.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createMedicineRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.medicineRequests.unshift(action.payload);
        state.successMessage = 'Medicine request created successfully';
        Toast('Medicine request created successfully');
      })
      .addCase(createMedicineRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create medicine request';
        Toast(state.error);
      });

    /* --------------------------- GET MY REQUESTS ----------------------------- */
    builder
      .addCase(getMyMedicineRequests.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getMyMedicineRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.medicineRequests = action.payload;
      })
      .addCase(getMyMedicineRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) ?? 'Failed to fetch medicine requests';
        Toast(state.error);
      });
  },
});

export const { clearInquiryState } = inquirySlice.actions;
export default inquirySlice.reducer;

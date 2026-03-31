
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import type { Prescription } from './types';
import { uploadPrescription, uploadPrescription_ } from './prescriptionThunks';
import { Toast } from '@/components/ui/toast';

type State = {
  uploading: boolean;
  uploadError?: string | null;
  saved: Prescription[];
  selected: string[];
  orderSelectedPrescription: string[];
  quickOrderSelectedPrescription: string[];
  fetchingSaved: boolean;
  orderPlacing: boolean;
  orderError?: string | null;
  lastPlacedOrderId?: string | null;
};

const initialState: State = {
  uploading: false,
  uploadError: null,
  saved: [],
  selected: [],
  orderSelectedPrescription: [],
  quickOrderSelectedPrescription: [],
  fetchingSaved: false,
  orderPlacing: false,
  orderError: null,
  lastPlacedOrderId: null,
};

const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    clearUploadError(state) {
      state.uploadError = null;
    },
    clearOrderError(state) {
      state.orderError = null;
    },
    removeSavedPrescription(state, action: PayloadAction<{ url: string }>) {
      state.saved = state.saved.filter((s) => s.url !== action.payload.url);
    },
    setSelectedPrescriptions(state, action: PayloadAction<string[]>) {
      state.selected = action.payload;
    },
    setOrderSelectedPrescriptions(state, action: PayloadAction<string[]>) {
      state.orderSelectedPrescription = action.payload;
    },
    setQuickOrderSelectedPrescriptions(state, action: PayloadAction<string[]>) {
      state.quickOrderSelectedPrescription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Upload Prescription
      .addCase(uploadPrescription.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
      })
      .addCase(uploadPrescription.fulfilled, (state, action) => {
        state.uploading = false;
        // state.saved.unshift(action.payload);
        Toast('Prescription uploaded successfully');
      })
      .addCase(uploadPrescription.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload ?? 'Upload failed';
        Toast('Failed to upload prescription');
      })
      .addCase(uploadPrescription_.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
      })
      .addCase(uploadPrescription_.fulfilled, (state, action) => {
        state.uploading = false;
        state.saved.unshift(action.payload);
        Toast('Prescription uploaded successfully');
      })
      .addCase(uploadPrescription_.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload ?? 'Upload failed';
        Toast('Failed to upload prescription');
      })

  },
});

export const {
  clearUploadError,
  clearOrderError,
  removeSavedPrescription,
  setSelectedPrescriptions,
  setOrderSelectedPrescriptions,
  setQuickOrderSelectedPrescriptions,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;

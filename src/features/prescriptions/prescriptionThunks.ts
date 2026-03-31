// features/prescription/prescriptionThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadPrescriptionApi, uploadPrescriptionApi_ } from './prescriptionApi';
import type { Prescription, UploadPrescriptionRequest, UploadPrescriptionResponse } from './types';

// ✅ Upload prescription
export const uploadPrescription = createAsyncThunk<Prescription, File, { rejectValue: string }>(
  'prescription/upload',
  async (file, { rejectWithValue }) => {
    try {
      const { prescription } = await uploadPrescriptionApi(file);
      return prescription;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to upload prescription');
    }
  }
);

export const uploadPrescription_ = createAsyncThunk<UploadPrescriptionResponse, UploadPrescriptionRequest, { rejectValue: string }>(
  'prescription_/upload',
  async (data, { rejectWithValue }) => {
    try {
      const response = await uploadPrescriptionApi_(data);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to upload prescription');
    }
  }
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createInquiryApi,
  getMyInquiriesApi,
  createMedicineRequestApi,
  getMyMedicineRequestsApi,
} from './inquiryApi';
import type { CreateInquiryPayload, Inquiry, CreateMedicineRequestPayload, MedicineRequest } from './types';
import { Toast } from '@/components/ui/toast';

/* -------------------------------------------------------------------------- */
/*                                INQUIRIES                                   */
/* -------------------------------------------------------------------------- */

// ✅ Create Inquiry
export const createInquiry = createAsyncThunk<
  Inquiry,
  CreateInquiryPayload,
  { rejectValue: string }
>('inquiry/createInquiry', async (payload, thunkAPI) => {
  try {
    const response = await createInquiryApi(payload);
    Toast('Inquiry created successfully');
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message ?? 'Failed to create inquiry');
  }
});

// ✅ Get My Inquiries (with pagination)
export const getMyInquiries = createAsyncThunk<
  Inquiry[],
  { offset?: number; limit?: number },
  { rejectValue: string }
>('inquiry/getMyInquiries', async ({ offset = 0, limit = 20 }, { rejectWithValue }) => {
  try {
    const response = await getMyInquiriesApi({ offset, limit });
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                           MEDICINE REQUESTS                                */
/* -------------------------------------------------------------------------- */

// ✅ Create Medicine Request
export const createMedicineRequest = createAsyncThunk<
  MedicineRequest,
  CreateMedicineRequestPayload,
  { rejectValue: string }
>('inquiry/createMedicineRequest', async (payload, thunkAPI) => {
  try {
    const response = await createMedicineRequestApi(payload);
    // Toast('Medicine request created successfully');
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.message ?? 'Failed to create medicine request'
    );
  }
});

// ✅ Get My Medicine Requests (with pagination)
export const getMyMedicineRequests = createAsyncThunk<
  MedicineRequest[],
  { offset?: number; limit?: number },
  { rejectValue: string }
>('inquiry/getMyMedicineRequests', async ({ offset = 0, limit = 20 }, { rejectWithValue }) => {
  try {
    const response = await getMyMedicineRequestsApi({ offset, limit });
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

import {
  sendMobileOtpApi,
  verifyMobileOtpApi,
  sendEmailOtpApi,
  verifyEmailOtpApi,
  submitStep1Api,
  submitStep2Api,
  submitStep3Api,
  verifyDocumentApi,
  verifyBankApi,
  initiateAadhaarVerificationApi,
  completeAadhaarVerificationApi,
} from './onboardingApi';
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BasicDetailsPayload } from './types';

/* MOBILE OTP */

export const sendMobileOtp = createAsyncThunk(
  "onboarding/sendMobileOtp",
  async (mobile: string, { rejectWithValue }) => {
    try {
      return await sendMobileOtpApi({ mobile });
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const verifyMobileOtp = createAsyncThunk(
  "onboarding/verifyMobileOtp",
  async (
    payload: { mobile: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      return await verifyMobileOtpApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

/* EMAIL OTP */

export const sendEmailOtp = createAsyncThunk(
  "onboarding/sendEmailOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      return await sendEmailOtpApi({ email });
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const verifyEmailOtp = createAsyncThunk(
  "onboarding/verifyEmailOtp",
  async (
    payload: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      return await verifyEmailOtpApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

/* STEPS */

export const submitStep1 = createAsyncThunk(
  "onboarding/submitStep1",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await submitStep1Api(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const submitStep2 = createAsyncThunk(
  "onboarding/submitStep2",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await submitStep2Api(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const submitStep3 = createAsyncThunk(
  "onboarding/submitStep3",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await submitStep3Api(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

/* VERIFICATION */

export const verifyDocument = createAsyncThunk(
  "onboarding/verifyDocument",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifyDocumentApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const verifyBank = createAsyncThunk(
  "onboarding/verifyBank",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifyBankApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const initiateAadhaarVerification = createAsyncThunk(
  "onboarding/initiateAadhaarVerification",
  async (payload: { vendor_id: string }, { rejectWithValue }) => {
    try {
      return await initiateAadhaarVerificationApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const completeAadhaarVerification = createAsyncThunk(
  "onboarding/completeAadhaarVerification",
  async (payload: { vendor_id: string; client_id: string }, { rejectWithValue }) => {
    try {
      return await completeAadhaarVerificationApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

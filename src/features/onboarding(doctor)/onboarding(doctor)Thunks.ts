import {
  sendMobileOtpApi,
  verifyMobileOtpApi,
  sendEmailOtpApi,
  verifyEmailOtpApi,
  verifyDocumentApi,
  verifyBankApi,
  initiateAadhaarVerificationApi,
  completeAadhaarVerificationApi,
  stepBasicDetailsApi,
  getDoctorSpecializationsApi,
  getDoctorServicesApi,
  getDoctorSymptomsApi,
  uploadDocumentApi,
  stepDocumentApi,
  stepBankDetailApi,
  verifyAadhaarApi,
  verifyMedicalRegistrationApi,
  verifyQualificationApi,
  verifySpecializationApi,
  verifyPanCardApi,
  verifyProfilePhotoApi,
  verifySignatureApi,
} from './onboarding(doctor)Api';
import { createAsyncThunk } from "@reduxjs/toolkit"

/* MOBILE OTP */

export const sendMobileOtp = createAsyncThunk(
  "doctoronboarding/sendMobileOtp",
  async (mobile: string, { rejectWithValue }) => {
    try {
      return await sendMobileOtpApi({ mobile });
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const verifyMobileOtp = createAsyncThunk(
  "doctoronboarding/verifyMobileOtp",
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
  "doctoronboarding/sendEmailOtp",
  async (data , { rejectWithValue }) => {
    try {
      return await sendEmailOtpApi(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const verifyEmailOtp = createAsyncThunk(
  "doctoronboarding/verifyEmailOtp",
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

export const stepBasicDetail = createAsyncThunk(
  "doctoronboarding/submitStep1",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await stepBasicDetailsApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const stepDocumentDeatil = createAsyncThunk(
  "doctoronboarding/submitStep2",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await stepDocumentApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const stepBankDetail = createAsyncThunk(
  "doctoronboarding/submitStep3",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await stepBankDetailApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

/* VERIFICATION */

export const verifyDocument = createAsyncThunk(
  "doctoronboarding/verifyDocument",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifyDocumentApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const verifyBank = createAsyncThunk(
  "doctoronboarding/verifyBank",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifyBankApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const initiateAadhaarVerification = createAsyncThunk(
  "doctoronboarding/initiateAadhaarVerification",
  async (payload: { vendor_id: string }, { rejectWithValue }) => {
    try {
      return await initiateAadhaarVerificationApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const completeAadhaarVerification = createAsyncThunk(
  "doctoronboarding/completeAadhaarVerification",
  async (payload: { vendor_id: string; client_id: string }, { rejectWithValue }) => {
    try {
      return await completeAadhaarVerificationApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
)

export const getDoctorSpecializations = createAsyncThunk(
  "doctoronboarding/getDoctorSpecializations",
  async (_, { rejectWithValue }) => {
    try {
      return await getDoctorSpecializationsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getDoctorServices = createAsyncThunk(
  "doctoronboarding/getDoctorServices",
  async (_, { rejectWithValue }) => {
    try {
      return await getDoctorServicesApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);  
    }
  }
);

export const getDoctorSymptoms = createAsyncThunk(   
  "doctoronboarding/getDoctorSymptoms",
  async (_, { rejectWithValue }) => {
    try {
      return await getDoctorSymptomsApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);  
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'doctoronboarding/upload',
  async (data, { rejectWithValue }) => {
    try {
      const response = await uploadDocumentApi(data);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to upload prescription');
    }
  }
);

export const verifyAadhaar = createAsyncThunk(
  "doctoronboarding/verifyAadhaar",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifyAadhaarApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const verifyMedicalRegistration = createAsyncThunk(
  "doctoronboarding/verifyMedicalRegistration",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifyMedicalRegistrationApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const verifyQualification = createAsyncThunk(
  "doctoronboarding/verifyQualification",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifyQualificationApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const verifySpecialization = createAsyncThunk(
  "doctoronboarding/verifySpecialization",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifySpecializationApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const verifyPanCard = createAsyncThunk(
  "doctoronboarding/verifyPanCard",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifyPanCardApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const verifyProfilePhoto = createAsyncThunk(
  "doctoronboarding/verifyProfilePhoto",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifyProfilePhotoApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const verifySignature = createAsyncThunk(
  "doctoronboarding/verifySignature",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await verifySignatureApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);



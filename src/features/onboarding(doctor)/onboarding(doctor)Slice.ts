import { createSlice } from '@reduxjs/toolkit';
import {
  sendMobileOtp,
  verifyMobileOtp,
  sendEmailOtp,
  verifyEmailOtp,
  stepBasicDetail,
  getDoctorSpecializations,
  getDoctorServices,
  getDoctorSymptoms,
  uploadDocument,
  stepDocumentDeatil,
  stepBankDetail,
  verifyAadhaar,
  verifyMedicalRegistration,
  verifyQualification,
  verifySpecialization,
  verifyPanCard,
  verifyProfilePhoto,
  verifySignature,
} from './onboarding(doctor)Thunks';
import { Toast } from '@/components/ui/toast';

interface OnboardingState {
  loading: boolean;
  error: string | null;

  mobileOtpSent: boolean;
  mobileVerified: boolean;

  emailOtpSent: boolean;
  emailVerified: boolean;

  onboardingSuccess: boolean;

  // New State fields
  doctorId: string | null;
  currentStep: number;
  doctorData: any | null;
  specializations: any[] | null;
  services: any[] | null;
  symptoms: any[] | null;
  docsUrl: string | null;

  aadhaarVerified: boolean;
  medicalRegistrationVerified: boolean;
  qualificationVerified: boolean;
  specializationVerified: boolean;
  panVerified: boolean;
  profilePhotoVerified: boolean;
  signatureVerified: boolean;
}

const initialState: OnboardingState = {
  loading: false,
  error: null,

  mobileOtpSent: false,
  mobileVerified: false,

  emailOtpSent: false,
  emailVerified: false,

  onboardingSuccess: false,

  doctorId: null,
  currentStep: 1,
  doctorData: null,
  specializations: null,
  services: null,
  symptoms: null,
  docsUrl: null,

  aadhaarVerified: false,
  medicalRegistrationVerified: false,
  qualificationVerified: false,
  specializationVerified: false,
  panVerified: false,
  profilePhotoVerified: false,
  signatureVerified: false,
};

const doctorOnboardingSlice = createSlice({
  name: 'doctoronboarding',
  initialState,
  reducers: {
    resetOnboardingState: () => initialState,
    setVendorId: (state, action) => {
      state.doctorId = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setMobileVerified: (state, action) => {
      state.mobileVerified = action.payload;
    },
    setEmailVerified: (state, action) => {
      state.emailVerified = action.payload;
    },
    setMobileOtpSent: (state, action) => {
      state.mobileOtpSent = action.payload;
    },
    setEmailOtpSent: (state, action) => {
      state.emailOtpSent = action.payload;
    },
    setDocsUrl: (state, action) => {
      state.docsUrl = action.payload;
    },
    setAadhaarVerified: (state, action) => {
      state.aadhaarVerified = action.payload;
    },
    setMedicalRegistrationVerified: (state, action) => {
      state.medicalRegistrationVerified = action.payload;
    },
    setQualificationVerified: (state, action) => {
      state.qualificationVerified = action.payload;
    },
    setSpecializationVerified: (state, action) => {
      state.specializationVerified = action.payload;
    },
    setPanVerified: (state, action) => {
      state.panVerified = action.payload;
    },
    setProfilePhotoVerified: (state, action) => {
      state.profilePhotoVerified = action.payload;
    },
    setSignatureVerified: (state, action) => {
      state.signatureVerified = action.payload;
    },
    setDoctorData: (state, action) => {
      state.doctorData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ================= MOBILE OTP ================= */

      .addCase(sendMobileOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMobileOtp.fulfilled, (state, action: any) => {
        state.loading = false;
        state.mobileOtpSent = true;
        Toast(action.payload?.message);
      })
      .addCase(sendMobileOtp.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log('action', action.payload);
        Toast(action.payload);
      })

      .addCase(verifyMobileOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMobileOtp.fulfilled, (state, action: any) => {
        state.loading = false;
        state.mobileVerified = true;
        state.mobileOtpSent = false;
        const data = action.payload?.data;
        Toast(action.payload?.message);
        if (data) {
          state.doctorId = data.doctor_id;
          state.currentStep = data.onboardingStep;
          state.doctorData = data;
          state.emailVerified = data.is_email_verified;
        }
      })
      .addCase(verifyMobileOtp.rejected, (state, action : any) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast(action.payload);
      })

      /* ================= EMAIL OTP ================= */

      .addCase(sendEmailOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmailOtp.fulfilled, (state, action : any) => {
        state.loading = false;
        state.emailOtpSent = true;
        Toast(action.payload?.message);

      })
      .addCase(sendEmailOtp.rejected, (state, action : any) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast(action.payload);
      })

      .addCase(verifyEmailOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailOtp.fulfilled, (state, action: any) => {
        state.loading = false;
        state.emailVerified = true;
        state.emailOtpSent = false;
        const data = action.payload?.data;
        Toast(action.payload?.message);
        if (data) {
          state.doctorId = data.doctor_id;
          state.currentStep = data.onboardingStep;
          state.doctorData = data;
        }
      })
      .addCase(verifyEmailOtp.rejected, (state, action : any) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast(action.payload);
      })

      /* ================= STEPS ================= */

      .addCase(stepBasicDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stepBasicDetail.fulfilled, (state, action: any) => {
        state.loading = false;
        state.currentStep = action.payload.data.onboardingStep;
        state.doctorData = action.payload.data;
        Toast(action.payload.message);
      })
      .addCase(stepBasicDetail.rejected, (state, action : any) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast(action.payload);
      })

      .addCase(stepDocumentDeatil.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stepDocumentDeatil.fulfilled, (state, action: any) => {
        state.loading = false;
        state.currentStep = action.payload.data.onboardingStep;
        state.doctorData = action.payload.data;
        Toast(action.payload.message);
      })
      .addCase(stepDocumentDeatil.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast(action.payload);
      })

      .addCase(stepBankDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stepBankDetail.fulfilled, (state, action: any) => {
        state.loading = false;
        state.currentStep = action.payload.data.onboardingStep;
        state.doctorData = action.payload.data;
        Toast(action.payload.message);
      })
      .addCase(stepBankDetail.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast(action.payload);
      })

      .addCase(getDoctorSpecializations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorSpecializations.fulfilled, (state, action: any) => {
        state.loading = false;
        state.onboardingSuccess = true;
        state.specializations = action.payload.data;
      })
      .addCase(getDoctorSpecializations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getDoctorServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorServices.fulfilled, (state, action: any) => {
        state.loading = false;
        state.onboardingSuccess = true;
        state.services = action.payload.data;
      })
      .addCase(getDoctorServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getDoctorSymptoms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorSymptoms.fulfilled, (state, action: any) => {
        state.loading = false;
        state.onboardingSuccess = true;
        state.symptoms = action.payload.data;
      })
      .addCase(getDoctorSymptoms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.docsUrl = action.payload;
        Toast('Document uploaded successfully');
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Upload failed';
        Toast('Failed to upload document');
      })

      .addCase(verifyAadhaar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAadhaar.fulfilled, (state) => {
        state.loading = false;
        state.aadhaarVerified = true;
        Toast('Aadhaar verified successfully');
      })
      .addCase(verifyAadhaar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast('Error in Aadhaar verification');
      })

      .addCase(verifyMedicalRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMedicalRegistration.fulfilled, (state) => {
        state.loading = false;
        state.medicalRegistrationVerified = true;
        Toast('Medical registration verified successfully');
      })
      .addCase(verifyMedicalRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast('Error in medical registration verification');
      })

      .addCase(verifyQualification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyQualification.fulfilled, (state) => {
        state.loading = false;
        state.qualificationVerified = true;
        Toast('Qualification verified successfully');
      })
      .addCase(verifyQualification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast('Error in qualification verification');
      })

      .addCase(verifySpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySpecialization.fulfilled, (state) => {
        state.loading = false;
        state.specializationVerified = true;
        Toast('Specialization verified successfully');
      })
      .addCase(verifySpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast('Error in specialization verification');
      })

      .addCase(verifyPanCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPanCard.fulfilled, (state) => {
        state.loading = false;
        state.panVerified = true;
        Toast('PAN card verified successfully');
      })
      .addCase(verifyPanCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast('Error in PAN card verification');
      })

      .addCase(verifyProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyProfilePhoto.fulfilled, (state) => {
        state.loading = false;
        state.profilePhotoVerified = true;
        Toast('Profile photo uploaded successfully');
      })
      .addCase(verifyProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast('Error in profile photo upload');
      })

      .addCase(verifySignature.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySignature.fulfilled, (state) => {
        state.loading = false;
        state.signatureVerified = true;
        Toast('Signature uploaded successfully');
      })
      .addCase(verifySignature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        Toast('Error in signature upload');
      });
  },
});

export const {
  resetOnboardingState,
  setVendorId,
  setCurrentStep,
  setMobileVerified,
  setEmailVerified,
  setMobileOtpSent,
  setEmailOtpSent,
  setDocsUrl,
  setAadhaarVerified,
  setMedicalRegistrationVerified,
  setQualificationVerified,
  setSpecializationVerified,
  setPanVerified,
  setProfilePhotoVerified,
  setSignatureVerified,
  setDoctorData,
} = doctorOnboardingSlice.actions;
export default doctorOnboardingSlice.reducer;

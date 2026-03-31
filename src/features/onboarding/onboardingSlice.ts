import { createSlice } from "@reduxjs/toolkit"
import {
  sendMobileOtp,
  verifyMobileOtp,
  sendEmailOtp,
  verifyEmailOtp,
  submitStep1,
  submitStep2,
  submitStep3,
} from "./onboardingThunks"

interface OnboardingState {
  loading: boolean
  error: string | null

  mobileOtpSent: boolean
  mobileVerified: boolean

  emailOtpSent: boolean
  emailVerified: boolean

  onboardingSuccess: boolean

  // New State fields
  vendorId: string | null
  currentStep: number
  vendorData: any | null // To store full vendor object for resume
}

const initialState: OnboardingState = {
  loading: false,
  error: null,

  mobileOtpSent: false,
  mobileVerified: false,

  emailOtpSent: false,
  emailVerified: false,

  onboardingSuccess: false,

  vendorId: null,
  currentStep: 1,
  vendorData: null,
}

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    resetOnboardingState: () => initialState,
    setVendorId: (state, action) => {
      state.vendorId = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      /* ================= MOBILE OTP ================= */

      .addCase(sendMobileOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendMobileOtp.fulfilled, (state) => {
        state.loading = false
        state.mobileOtpSent = true
      })
      .addCase(sendMobileOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(verifyMobileOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyMobileOtp.fulfilled, (state, action: any) => {
        state.loading = false
        state.mobileVerified = true
        const vendor = action.payload?.data?.vendor || action.payload?.vendor;
        if (vendor) {
          state.vendorData = vendor;
          state.vendorId = vendor.id;
        }
      })
      .addCase(verifyMobileOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      /* ================= EMAIL OTP ================= */

      .addCase(sendEmailOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendEmailOtp.fulfilled, (state) => {
        state.loading = false
        state.emailOtpSent = true
      })
      .addCase(sendEmailOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(verifyEmailOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmailOtp.fulfilled, (state, action: any) => {
        state.loading = false
        state.emailVerified = true
        const vendor = action.payload?.data?.vendor || action.payload?.vendor;
        if (vendor) {
          state.vendorData = vendor;
          state.vendorId = vendor.id;
        }
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      /* ================= STEPS ================= */

      .addCase(submitStep1.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitStep1.fulfilled, (state, action: any) => {
        state.loading = false
        state.vendorId = action.payload?.data?.id || action.payload?.id
      })
      .addCase(submitStep1.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(submitStep2.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitStep2.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(submitStep2.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(submitStep3.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitStep3.fulfilled, (state) => {
        state.loading = false
        state.onboardingSuccess = true
      })
      .addCase(submitStep3.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  resetOnboardingState,
  setVendorId,
  setCurrentStep,
  setMobileVerified,
  setEmailVerified,
  setMobileOtpSent,
  setEmailOtpSent
} = onboardingSlice.actions;
export default onboardingSlice.reducer;

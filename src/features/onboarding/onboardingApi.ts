import api from "@/lib/axios"
import { BasicDetailsPayload } from "./types"

/* ================= MOBILE OTP ================= */

export const sendMobileOtpApi = async (payload: {
  mobile: string
}): Promise<any> => {
  const { data } = await api.post("/vendor/verify/mobile", payload)
  return data
}

export const verifyMobileOtpApi = async (payload: {
  mobile: string
  otp: string
}): Promise<any> => {
  const { data } = await api.post("/vendor/verify/mobile/confirm", payload)
  return data
}

/* ================= EMAIL OTP ================= */

export const sendEmailOtpApi = async (payload: {
  email: string
}): Promise<any> => {
  const { data } = await api.post("/vendor/verify/email", payload)
  return data
}

export const verifyEmailOtpApi = async (payload: {
  email: string
  otp: string
}): Promise<any> => {
  const { data } = await api.post("/vendor/verify/email/confirm", payload)
  return data
}

/* ================= STEPS SUBMISSION ================= */

export const submitStep1Api = async (payload: any): Promise<any> => {
  const { data } = await api.post("/vendor/onboard/step1", payload)
  return data
}

export const submitStep2Api = async (payload: any): Promise<any> => {
  const { data } = await api.post("/vendor/onboard/step2", payload)
  return data
}

export const submitStep3Api = async (payload: any): Promise<any> => {
  const { data } = await api.post("/vendor/onboard/step3", payload)
  return data
}

/* ================= VERIFICATION ================= */

export const verifyDocumentApi = async (payload: any): Promise<any> => {
  const { data } = await api.post("/vendor/verify/document", payload)
  return data
}


export const verifyBankApi = async (payload: any): Promise<any> => {
  const { data } = await api.post("/vendor/verify/bank", payload)
  return data
}

/* ================= AADHAAR VERIFICATION (Digiboost SDK) ================= */

export const initiateAadhaarVerificationApi = async (payload: { vendor_id: string }): Promise<any> => {
  const { data } = await api.post("/vendor/verify/aadhaar/initiate", payload)
  return data
}

export const completeAadhaarVerificationApi = async (payload: { vendor_id: string, client_id: string }): Promise<any> => {
  const { data } = await api.post("/vendor/verify/aadhaar/complete", payload)
  return data
}

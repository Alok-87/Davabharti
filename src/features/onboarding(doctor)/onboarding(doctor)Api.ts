import api from "@/lib/axios"
import axios from "axios"

/* ================= MOBILE OTP ================= */

export const sendMobileOtpApi = async (payload: {
  mobile: string
}): Promise<any> => {
  const { data } = await api.post("/doctors/verify/mobile", payload)
  return data
}

export const verifyMobileOtpApi = async (payload: {
  mobile: string
  otp: string
}): Promise<any> => {
  const { data } = await api.post("/doctors/verify/mobile/confirm", payload)
  return data;
}

/* ================= EMAIL OTP ================= */

export const sendEmailOtpApi = async (payload: {
  data:any
}): Promise<any> => {
  const { data } = await api.post("/doctors/verify/email", payload)
  return data
}

export const verifyEmailOtpApi = async (payload: {
  email: string
  otp: string
}): Promise<any> => {
  const { data } = await api.post("/doctors/verify/email/confirm", payload)
  return data
}

/* ================= STEPS SUBMISSION ================= */

export const stepBasicDetailsApi = async (payload: any): Promise<any> => {
  const { data } = await api.post("/doctors/onboard/step1", payload)
  return data;
}

export const stepDocumentApi = async (payload: any): Promise<any> => {
  const { data } = await api.post("/doctors/onboard/step2", payload)
  return data;
}

export const stepBankDetailApi = async (payload: any): Promise<any> => {
  const { data } = await api.post("/doctors/onboard/step3", payload)
  return data;
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

export const getDoctorSpecializationsApi = async (): Promise<any> => {
  const { data } = await api.get("/doctors/specializations?isActive=true");  
  return data;
};


export const getDoctorServicesApi = async (): Promise<any> => {
  const { data } = await api.get("/doctors/services");                 
  return data;
};

export const getDoctorSymptomsApi = async (): Promise<any> => {
  const { data } = await api.get("/doctors/symptoms");                
  return data;
};

export const uploadDocumentApi = async (body: any): Promise<any> => {
  const formData = new FormData();

  formData.append('folder', body.folder);
  formData.append('file', body.file);

  const { data } = await axios.post(`https://dv-back.thundergits.com/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('upload', data);
  return data.data.url;
};


export const verifyAadhaarApi = async (payload: any) => {
  const res = await api.post("/doctors/verify/aadhaar", payload);
  return res.data;
};

export const verifyMedicalRegistrationApi = async (payload: any) => {
  const res = await api.post("/doctors/verify/medical-registration", payload);
  return res.data;
};

export const verifyQualificationApi = async (payload: any) => {
  const res = await api.post("/doctors/verify/qualification", payload);
  return res.data;
};

export const verifySpecializationApi = async (payload: any) => {
  const res = await api.post("/doctors/verify/specialization", payload);
  return res.data;
};

export const verifyPanCardApi = async (payload: any) => {
  const res = await api.post("/doctors/verify/pan-card", payload);
  return res.data;
};

export const verifyProfilePhotoApi = async (payload: any) => {
  const res = await api.post("/doctors/verify/profile-photo", payload);
  return res.data;
};

export const verifySignatureApi = async (payload: any) => {
  const res = await api.post("/doctors/verify/signature", payload);
  return res.data;
};

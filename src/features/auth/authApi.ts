import api from '@/lib/axios';
import type {
  OtpRequestBody,
  OtpRequestResponse,
  OtpVerifyBody,
  OtpVerifyResponse,
  User,
} from './types';

const AUTH_BASE = '/auth';

export const sendOtpApi = async (body: OtpRequestBody): Promise<OtpRequestResponse> => {
  const { data } = await api.post(`${AUTH_BASE}/otp-request`, body);
  return data as OtpRequestResponse;
};

export const verifyOtpApi = async (body: OtpVerifyBody): Promise<OtpVerifyResponse> => {
  const { data } = await api.post(`${AUTH_BASE}/otp-verify`, body);
  return data as OtpVerifyResponse;
};


export const getMeApi = async (): Promise<{ data: { user: User } }> => {
  const { data } = await api.get('/customer/me');
  return data as { data: { user: User } };
};
export const logOutApi = async (): Promise<null> => {
  await api.post('/auth/logout');
  return null;
};

// For Google OAuth we'll just return the backend URL to redirect to
export const googleAuthUrl = (frontendRedirectUrl: string) =>
  // backend should accept redirect as query param, e.g. /auth/google?redirect_uri=...
  `${AUTH_BASE}/google?redirect_uri=${encodeURIComponent(frontendRedirectUrl)}`;

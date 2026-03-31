export interface OtpRequestBody {
  phone_number: string;
  purpose: 'SIGNUP' | 'LOGIN' | 'RESET';
}

export interface OtpRequestResponse {
  data: {
    user: {
      ttl_seconds: number;
      otp?: string;
    };
  };
  status: string;
  message?: string;
}

export interface OtpVerifyBody {
  phone_number: string;
  otp_code: string;
}

export interface OtpVerifyResponse {
  data: {
    access_token: string;
    is_profile_complete: boolean;
  };
  status: string;
  message?: string;
}

export interface User {
  id: string;
  dob: string;
  name?: string;
  phone_number?: string;
  gender: string;
  email?: string;
  roles?: string[];
  referral_code?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error?: string | null;
}

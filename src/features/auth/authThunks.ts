import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendOtpApi, verifyOtpApi, getMeApi, logOutApi } from './authApi';
import type { OtpRequestBody, OtpVerifyBody, OtpVerifyResponse, User } from './types';
import { setToken } from './utils/tokenManager';

export const sendOtp = createAsyncThunk<any, OtpRequestBody, { rejectValue: string }>(
  'auth/sendOtp',
  async (body, thunkAPI) => {
    try {
      const resp = await sendOtpApi(body);
      return resp;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to send OTP';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// export const verifyOtp = createAsyncThunk<
//   { token: string; user?: User },
//   OtpVerifyBody,
//   { rejectValue: string }
// >('auth/verifyOtp', async (body, thunkAPI) => {
//   try {
//     const resp = await verifyOtpApi(body);
//     const token = resp?.data?.access_token;

//     if (!token) throw new Error('No access token returned');

//     // store token in localStorage and attach to axios
//     setToken(token);

//     // fetch user profile
//     try {
//       const me = await getMeApi();
//       return { token, user: me.data.user };
//     } catch (e) {
//       // If getMe fails, still return token; UI may call getMe later
//       return { token };
//     }
//   } catch (err: any) {
//     const message = err?.response?.data?.message ?? err?.message ?? 'OTP verification failed';
//     return thunkAPI.rejectWithValue(message);
//   }
// });

//-------------------after bug fixed-------------------
//-----------------before bug not able to login msg-"failed to load profile"--------------
// export const verifyOtp = createAsyncThunk<
//   { token: string; user?: User; message?: string; is_profile_complete?: boolean },
//   OtpVerifyBody,
//   { rejectValue: string }
// >('auth/verifyOtp', async (body, thunkAPI) => {
//   try {
//     const resp: OtpVerifyResponse = await verifyOtpApi(body);
//     const token = resp?.data?.access_token;
//     const is_profile_complete = resp?.data?.is_profile_complete;

//     if (!token) throw new Error('No access token returned');

//     setToken(token);

//     try {
//       const me = await getMeApi();
//       return { token, user: me.data.user, message: resp.message, is_profile_complete };
//     } catch {
//       return { token, message: resp.message, is_profile_complete };
//     }
//   } catch (err: any) {
//     const message = err?.response?.data?.message ?? err?.message ?? 'OTP verification failed';
//     return thunkAPI.rejectWithValue(message);
//   }
// });

//-----------------after bug not able to login msg-"failed to load profile"--------------

export const verifyOtp = createAsyncThunk<
  { token: string; user?: User; message?: string; is_profile_complete?: boolean },
  OtpVerifyBody,
  { rejectValue: string }
>('auth/verifyOtp', async (body, thunkAPI) => {
  try {
    const resp: OtpVerifyResponse = await verifyOtpApi(body);
    const token = resp?.data?.access_token;
    const is_profile_complete = resp?.data?.is_profile_complete;

    if (!token) throw new Error('No access token returned');

    setToken(token);

    // Only fetch user profile if it's marked as complete in the response
    if (is_profile_complete) {
      try {
        const me = await getMeApi();
        return { token, user: me.data.user, message: resp.message, is_profile_complete };
      } catch (profileError) {
        // Don't throw error here - user might need to complete profile
        return { token, message: resp.message, is_profile_complete: false };
      }
    } else {
      // Profile not complete, don't attempt to fetch
      return { token, message: resp.message, is_profile_complete: false };
    }
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? 'OTP verification failed';
    return thunkAPI.rejectWithValue(message);
  }
});
export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchMe',
  async (_, thunkAPI) => {
    try {
      const resp = await getMeApi();
      return resp.data.user;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const logOutThunk = createAsyncThunk<null, void, { rejectValue: string }>(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const resp = await logOutApi();
      return null;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

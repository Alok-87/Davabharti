import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getToken, setToken } from './utils/tokenManager';
import { AuthState, User } from './types';
import { fetchMe, logOutThunk, sendOtp, verifyOtp } from './authThunks';
import { clearSelectedAddressForOrder, clearSelectedFamilyMemberForOrder } from '../user-profile/userProfileSlice';
import { Toast } from '@/components/ui/toast';

const initialState: AuthState = {
  user: null,
  token: getToken(),
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      setToken(null);
      clearSelectedAddressForOrder()
      clearSelectedFamilyMemberForOrder()
      try {
        localStorage.removeItem('persist:userProfile');
        localStorage.removeItem('persist:prescription');
        localStorage.removeItem('persist:root'); // if you persist entire store
        localStorage.removeItem('app_access_token'); // your token key
        Toast('Logout Successfully')
      } catch (err) { }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // sendOtp
    builder.addCase(sendOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendOtp.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(sendOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to send OTP';
    });

    // verifyOtp
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      if (action.payload.user) state.user = action.payload.user;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'OTP verification failed';
    });

    // fetchMe
    builder.addCase(fetchMe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    builder.addCase(fetchMe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch user';
      // DON'T clear token here - user might be authenticated but profile incomplete
      // state.token = null;
      // setToken(null);
    });


    // logout 
    builder.addCase(logOutThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logOutThunk.fulfilled, (state, action) => {
      authSlice.caseReducers.logout(state);
    });
    builder.addCase(logOutThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'OTP verification failed';
    });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

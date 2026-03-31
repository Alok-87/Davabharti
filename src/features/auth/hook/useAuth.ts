import { useCallback } from 'react';
import { sendOtp, verifyOtp, fetchMe, logOutThunk } from '../authThunks';
import { setUser } from '../authSlice';
import { selectAuthUser, selectIsAuthenticated, selectAuthLoading } from '../authSelectors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSaveMobile } from '@/features/user-profile/userProfileSlice';
import { fetchCart } from '@/features/cart/cartThunks';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);

  const requestOtp = useCallback(
    (phone: string, purpose: 'SIGNUP' | 'LOGIN' | 'RESET') => {
      dispatch(setSaveMobile(phone));
      return dispatch(sendOtp({ phone_number: phone, purpose }));
    },
    [dispatch]
  );

  const verifyOtpCode = useCallback(
    (phone: string, otp: string) => {
      return dispatch(verifyOtp({ phone_number: phone, otp_code: otp }));
    },
    [dispatch]
  );

  const restore = useCallback(async () => {
    try {
      await dispatch(fetchMe()).unwrap();
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error("Restore failed:", error);
    }
  }, [dispatch]);


  const logout = useCallback(() => {
    dispatch(logOutThunk());
  }, [dispatch]);

  const setUserFromServer = useCallback((u: any) => dispatch(setUser(u)), [dispatch]);

  return {
    user,
    loading,
    isAuthenticated,
    requestOtp,
    verifyOtpCode,
    restore,
    logout,
    setUserFromServer,
  };
};


// 'use client';
// import { useState, useEffect } from 'react';
// import { useAuth } from '@/features/auth/hook/useAuth';
// import { setToken, clearToken, getToken } from '@/features/auth/utils/tokenManager';
// import { useRouter } from 'next/navigation';
// import { fetchUserProfile } from '@/features/user-profile/userProfileThunks';
// import { useAppDispatch } from '@/store/hooks';
// import type { OtpRequestResponse } from '@/features/auth/types';

// export type AuthStage = 'phone' | 'otp' | 'profile';

// export function useAuthFlow(mode: 'LOGIN' | 'SIGNUP') {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { requestOtp, verifyOtpCode, restore, isAuthenticated } = useAuth();

//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState(Array(6).fill(''));
//   const [stage, setStage] = useState<AuthStage>('phone');
//   const [sending, setSending] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const [secondsLeft, setSecondsLeft] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [userData, setUserData] = useState<any>(null);
//   const [requiresProfile, setRequiresProfile] = useState(false);
//   const [authCompleted, setAuthCompleted] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);

//   const otpValue = otp.join('');


//   // ✅ Countdown timer
//   useEffect(() => {
//     if (secondsLeft <= 0) return;
//     const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
//     return () => clearInterval(id);
//   }, [secondsLeft]);

//   const validPhone = (p: string) => /^\d{10}$/.test(p.trim());

//   // ✅ Send OTP
//   const handleSendOtp = async () => {
//     setError(null);
//     setSuccess(null);

//     if (!validPhone(phone)) return setError('Enter a valid 10-digit phone number');

//     try {
//       setSending(true);
//       const resp = (await requestOtp(phone.trim(), mode).unwrap?.()) as OtpRequestResponse;
//       setSuccess(resp?.message ?? 'OTP sent successfully.');
//       setStage('otp');
//       setSecondsLeft(resp?.data?.user?.ttl_seconds ?? 60);
//     } catch (err: any) {
//       const backendError = err?.data?.message || err?.message || err?.error || 'Failed to send OTP';
//       setError(backendError);
//     } finally {
//       setSending(false);
//     }
//   };

//   // ✅ Verify OTP
//   const handleVerifyOtp = async (): Promise<{
//     success: boolean;
//     requiresProfileCompletion?: boolean;
//     userData?: any;
//     message?: string;
//   }> => {
//     setError(null);
//     setSuccess(null);

//     if (!validPhone(phone)) {
//       setError('Enter a valid 10-digit phone number');
//       return { success: false };
//     }

//     if (!/^\d{6}$/.test(otpValue)) {
//       setError('Enter complete 6-digit OTP');
//       return { success: false };
//     }

//     try {
//       setVerifying(true);

//       const resp = (await verifyOtpCode(phone.trim(), otpValue).unwrap?.()) as {
//         token: string;
//         user?: any;
//         message?: string;
//         is_profile_complete?: boolean;
//       };

//       if (!resp.token) throw new Error('No access token received from server.');

//       setToken(resp.token);
//       setUserData(resp.user);

//       // ✅ CRITICAL: ALWAYS call restore() to update auth state
//       await restore();

//       // Check if profile needs completion
//       const needsProfileCompletion = resp.is_profile_complete === false;

//       if (!needsProfileCompletion) {
//         // Profile is complete - fetch full profile and mark auth completed
//         try {
//           await dispatch(fetchUserProfile()).unwrap();
//           setAuthCompleted(true);
//           setSuccess(resp.message ?? 'Login successful!');
//         } catch (profileError) {
//           console.error('Profile fetch error:', profileError);
//           setAuthCompleted(true);
//         }
//       } else {
//         // Profile needs completion - move to profile stage
//         setRequiresProfile(true);
//         setStage('profile');
//         setSuccess('Please complete your profile to continue');
//       }

//       return {
//         success: true,
//         requiresProfileCompletion: needsProfileCompletion,
//         userData: resp.user,
//         message: resp.message,
//       };
//     } catch (err: any) {
//       const backendError =
//         err?.data?.message || err?.message || err?.error || 'OTP verification failed';
//       setError(backendError);
//       clearToken();
//       return { success: false, message: backendError };
//     } finally {
//       setVerifying(false);
//     }
//   };

//   // ✅ Handle Google login initiation
//   const handleGoogleLogin = () => {
//     setGoogleLoading(true);
//     const frontendRedirect = `${window.location.origin}/auth/google/callback`;
//     const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
//     window.location.href = `${base}/api/v1/auth/google?redirect_uri=${encodeURIComponent(
//       frontendRedirect
//     )}`;
//   };

//   // // ✅ Get pre-filled data for Google users
//   // const getGoogleUserData = () => {
//   //   try {
//   //     const pendingGoogleUser = localStorage.getItem('pendingGoogleUser');
//   //     return pendingGoogleUser ? JSON.parse(pendingGoogleUser) : null;
//   //   } catch {
//   //     return null;
//   //   }
//   // };
// const handlePostGoogleLogin = async (token: string) => {
//   try {
//     setToken(token);

//     // Try to fetch user profile after setting token
//     const profile = await dispatch(fetchUserProfile()).unwrap();

//     // ✅ Case 1: Profile fetched and has phone number → Complete login
//     if (profile && profile.phone_number) {
//       await restore();
//       setAuthCompleted(true);
//       setRequiresProfile(false);
//       setUserData(profile);
//     }
//     // ✅ Case 2: Profile fetched but missing phone → Needs signup form
//     else {
//       setUserData(profile || {});
//       setRequiresProfile(true);
//       setStage('profile');
//     }
//   } catch (error) {
//     // ✅ Case 3: Fetch failed → treat as new Google user (no profile yet)
//     console.error('Error fetching profile after Google login:', error);
//     setUserData({});
//     setRequiresProfile(true);
//     setStage('profile');
//   }
// };

//   // ✅ Handle profile completion
//   const handleProfileComplete = async () => {
//     try {
//       // Fetch updated profile
//       await dispatch(fetchUserProfile()).unwrap();
      
//       // ✅ CRITICAL: Refresh auth state
//       await restore();
      
//       // Clear pending Google auth data if exists
//       localStorage.removeItem('pendingGoogleUser');
      
//       setRequiresProfile(false);
//       setAuthCompleted(true);
//       setSuccess('Profile completed successfully!');
//     } catch (error) {
//       console.error('Profile completion error:', error);
//       setError('Failed to complete profile. Please try again.');
//       throw error;
//     }
//   };

//   // Handle modal close - remove token if profile not completed
//   const handleModalClose = () => {
//     if (requiresProfile && !authCompleted) {
//       clearToken();
//       localStorage.removeItem('pendingGoogleUser');
//     }
//   };

//   const handleResend = () => {
//     if (secondsLeft > 0) return;
//     handleSendOtp();
//   };

//   const handleOtpChange = (index: number, value: string) => {
//     if (!/^\d?$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     if (value && index < otp.length - 1) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   return {
//     // states
//     phone,
//     setPhone,
//     otp,
//     setOtp,
//     stage,
//     setStage,
//      setUserData,
//     sending,
//     verifying,
//     secondsLeft,
//     error,
//     setError,
//     success,
//     setSuccess,
//     otpValue,
//     isAuthenticated,
//     userData,
//     requiresProfile,
//     setRequiresProfile,
//     authCompleted,
//     setAuthCompleted,
//     googleLoading,
  

//     // handlers
//     handleSendOtp,
//     handleVerifyOtp,
//     handleGoogleLogin,
//     handleProfileComplete,
//     handleModalClose,
//     handleResend,
//     handleOtpChange,
//     handlePostGoogleLogin,
//     getGoogleUserData,
//   };
// }


'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hook/useAuth';
import { setToken, clearToken, getToken } from '@/features/auth/utils/tokenManager';
import { useRouter } from 'next/navigation';
import { fetchUserProfile } from '@/features/user-profile/userProfileThunks';
import { useAppDispatch } from '@/store/hooks';
import type { OtpRequestResponse } from '@/features/auth/types';

export type AuthStage = 'phone' | 'otp' | 'profile';

export function useAuthFlow(mode: 'LOGIN' | 'SIGNUP') {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { requestOtp, verifyOtpCode, restore, isAuthenticated } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [stage, setStage] = useState<AuthStage>('phone');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [requiresProfile, setRequiresProfile] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const otpValue = otp.join('');

  // ✅ Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const validPhone = (p: string) => /^\d{10}$/.test(p.trim());

  // ✅ Send OTP
  const handleSendOtp = async () => {
    setError(null);
    setSuccess(null);

    if (!validPhone(phone)) return setError('Enter a valid 10-digit phone number');

    try {
      setSending(true);
      const resp = (await requestOtp(phone.trim(), mode).unwrap?.()) as OtpRequestResponse;
      setSuccess(resp?.message ?? 'OTP sent successfully.');
      setStage('otp');
      setSecondsLeft(resp?.data?.user?.ttl_seconds ?? 60);
    } catch (err: any) {
      const backendError = err?.data?.message || err?.message || err?.error || 'Failed to send OTP';
      setError(backendError);
    } finally {
      setSending(false);
    }
  };

  // ✅ Verify OTP
  // const handleVerifyOtp = async (): Promise<{
  //   success: boolean;
  //   requiresProfileCompletion?: boolean;
  //   userData?: any;
  //   message?: string;
  // }> => {
  //   setError(null);
  //   setSuccess(null);

  //   if (!validPhone(phone)) {
  //     setError('Enter a valid 10-digit phone number');
  //     return { success: false };
  //   }

  //   if (!/^\d{6}$/.test(otpValue)) {
  //     setError('Enter complete 6-digit OTP');
  //     return { success: false };
  //   }

  //   try {
  //     setVerifying(true);

  //     const resp = (await verifyOtpCode(phone.trim(), otpValue).unwrap?.()) as {
  //       token: string;
  //       user?: any;
  //       message?: string;
  //       is_profile_complete?: boolean;
  //     };

  //     if (!resp.token) throw new Error('No access token received from server.');

  //     setToken(resp.token);
  //     setUserData(resp.user);

  //     // ✅ CRITICAL: ALWAYS call restore() to update auth state
  //     await restore();

  //     // Check if profile needs completion
  //     const needsProfileCompletion = resp.is_profile_complete === false;

  //     if (!needsProfileCompletion) {
  //       // Profile is complete - fetch full profile and mark auth completed
  //       try {
  //         await dispatch(fetchUserProfile()).unwrap();
  //         setAuthCompleted(true);
  //         setSuccess(resp.message ?? 'Login successful!');
  //       } catch (profileError) {
  //         console.error('Profile fetch error:', profileError);
  //         setAuthCompleted(true);
  //       }
  //     } else {
  //       // Profile needs completion - move to profile stage
  //       setRequiresProfile(true);
  //       setStage('profile');
  //       setSuccess('Please complete your profile to continue');
  //     }

  //     return {
  //       success: true,
  //       requiresProfileCompletion: needsProfileCompletion,
  //       userData: resp.user,
  //       message: resp.message,
  //     };
  //   } catch (err: any) {
  //     const backendError =
  //       err?.data?.message || err?.message || err?.error || 'OTP verification failed';
  //     setError(backendError);
  //     clearToken();
  //     return { success: false, message: backendError };
  //   } finally {
  //     setVerifying(false);
  //   }
  // };
const handleVerifyOtp = async () => {
  setError(null);
  setSuccess(null);

  if (!validPhone(phone)) {
    setError('Enter a valid 10-digit phone number');
    return { success: false };
  }

  if (!/^\d{6}$/.test(otpValue)) {
    setError('Enter complete 6-digit OTP');
    return { success: false };
  }

  try {
    setVerifying(true);

    const resp = (await verifyOtpCode(phone.trim(), otpValue).unwrap?.()) as {
      token: string;
      user?: any;
      message?: string;
      is_profile_complete?: boolean;
    };

    if (!resp.token) throw new Error('No access token received from server.');

    setToken(resp.token);
    await restore();

    const needsProfileCompletion = resp.is_profile_complete === false;

    // 🆕 Always fetch profile once token is set
    const profileData = await dispatch(fetchUserProfile()).unwrap().catch(() => null);

    // Merge partial backend data with existing userData
    const combinedData = profileData || resp.user || {};
    setUserData(combinedData);

    if (!needsProfileCompletion) {
      setAuthCompleted(true);
      setSuccess(resp.message ?? 'Login successful!');
    } else {
      setRequiresProfile(true);
      setStage('profile');
      setSuccess('Please complete your profile to continue');
    }

    return {
      success: true,
      requiresProfileCompletion: needsProfileCompletion,
      userData: combinedData,
      message: resp.message,
    };
  } catch (err: any) {
    const backendError =
      err?.data?.message || err?.message || err?.error || 'OTP verification failed';
    setError(backendError);
    clearToken();
    return { success: false, message: backendError };
  } finally {
    setVerifying(false);
  }
};

  // ✅ Handle Google login initiation
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const frontendRedirect = `${window.location.origin}/auth/google/callback`;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
    window.location.href = `${base}/api/v1/auth/google?redirect_uri=${encodeURIComponent(
      frontendRedirect
    )}`;
  };

  const handlePostGoogleLogin = async (token: string) => {
    try {
      setToken(token);

      // Try to fetch user profile after setting token
      const profile = await dispatch(fetchUserProfile()).unwrap();

      // ✅ Case 1: Profile fetched and has phone number → Complete login
      if (profile && profile.phone_number) {
        await restore();
        setAuthCompleted(true);
        setRequiresProfile(false);
        setUserData(profile);
      }
      // ✅ Case 2: Profile fetched but missing phone → Needs signup form
      else {
        setUserData(profile || {});
        setRequiresProfile(true);
        setStage('profile');
      }
    } catch (error) {
      // ✅ Case 3: Fetch failed → treat as new Google user (no profile yet)
      console.error('Error fetching profile after Google login:', error);
      setUserData({});
      setRequiresProfile(true);
      setStage('profile');
    }
  };

  // ✅ Handle profile completion
  const handleProfileComplete = async () => {
    try {
      // Fetch updated profile
      await dispatch(fetchUserProfile()).unwrap();
      
      // ✅ CRITICAL: Refresh auth state
      await restore();
      
      setRequiresProfile(false);
      setAuthCompleted(true);
      setSuccess('Profile completed successfully!');
    } catch (error) {
      console.error('Profile completion error:', error);
      setError('Failed to complete profile. Please try again.');
      throw error;
    }
  };

  // Handle modal close - remove token if profile not completed
  const handleModalClose = () => {
    if (requiresProfile && !authCompleted) {
      clearToken();
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    handleSendOtp();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return {
    // states
    phone,
    setPhone,
    otp,
    setOtp,
    stage,
    setStage,
    setUserData,
    sending,
    verifying,
    secondsLeft,
    error,
    setError,
    success,
    setSuccess,
    otpValue,
    isAuthenticated,
    userData,
    requiresProfile,
    setRequiresProfile,
    authCompleted,
    setAuthCompleted,
    googleLoading,

    // handlers
    handleSendOtp,
    handleVerifyOtp,
    handleGoogleLogin,
    handleProfileComplete,
    handleModalClose,
    handleResend,
    handleOtpChange,
    handlePostGoogleLogin,
  };
}
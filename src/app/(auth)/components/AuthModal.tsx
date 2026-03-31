// //------------------adding form 


// // 'use client';

// // import { useEffect, useRef, useState } from 'react';
// // import { Dialog, DialogContent } from '@/components/ui/dialog';
// // import { useModal } from '@/context/ModalContext';
// // import AuthLayout from './AuthLayout';
// // import { useAuthFlow } from '../hooks/useAuthFlow';
// // import { useForm } from 'react-hook-form';
// // import { updateUserProfile } from '@/features/user-profile/userProfileThunks';
// // import { useAppDispatch } from '@/store/hooks';
// // import { clearToken } from '@/features/auth/utils/tokenManager';

// // interface ProfileFormData {
// //   name: string;
// //   dob: string;
// //   email: string;
// //   phone_number: string;
// //   gender: string;
// // }

// // export default function AuthModal() {
// //   const { authModal, closeAuthModal, redirectUrl, openAuthModal } = useModal();
// //   const dispatch = useAppDispatch();
// //   const isOpen = authModal !== null;
// //   const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

// //   const auth = useAuthFlow(authModal === 'login' ? 'LOGIN' : 'SIGNUP');

// //   const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileFormData>();

// //   // Reset form when user data changes
// //   useEffect(() => {
// //     if (auth.userData && auth.stage === 'profile') {
// //       reset({
// //         name: auth.userData.name || '',
// //         dob: auth.userData.dob ? auth.userData.dob.split('T')[0] : '',
// //         email: auth.userData.email || '',
// //         phone_number: auth.userData.phone_number || auth.phone,
// //         gender: auth.userData.gender || '',
// //       });
// //     }
// //   }, [auth.userData, auth.stage, auth.phone, reset]);

// //   // Handle successful authentication - ONLY when auth is completed
// // useEffect(() => {
// //   if (auth.authCompleted && isOpen) {
// //     console.log('Auth completed, closing modal and redirecting');
// //     closeAuthModal();

// //     // Use setTimeout to ensure modal is closed before redirect
// //     setTimeout(() => {
// //       if (redirectUrl) {
// //         console.log('Redirecting to:', redirectUrl);
// //         window.location.href = redirectUrl;
// //       }
// //     }, 100);
// //   }
// // }, [auth.authCompleted, isOpen, closeAuthModal, redirectUrl]);;

// //   // Reset auth flow when modal closes
// //   useEffect(() => {
// //     if (!isOpen) {
// //       const timer = setTimeout(() => {
// //         auth.setStage('phone');
// //         auth.setPhone('');
// //         auth.setOtp(Array(6).fill(''));
// //         auth.setError(null);
// //         auth.setSuccess(null);
// //         auth.setRequiresProfile(false);
// //         auth.setAuthCompleted(false);
// //       }, 300);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [isOpen]);

// //   // Auto-focus first OTP input when stage changes to OTP
// //   useEffect(() => {
// //     if (auth.stage === 'otp' && otpInputRefs.current[0]) {
// //       const timer = setTimeout(() => {
// //         otpInputRefs.current[0]?.focus();
// //       }, 100);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [auth.stage]);

// //   const handleSwitchAuth = () => {
// //     const newType = authModal === 'login' ? 'signup' : 'login';
// //     openAuthModal(newType, redirectUrl || undefined);
// //   };

// //   const handleOtpChange = (index: number, value: string) => {
// //     auth.handleOtpChange(index, value);
// //     if (value && index < 5 && otpInputRefs.current[index + 1]) {
// //       otpInputRefs.current[index + 1]?.focus();
// //     }
// //   };

// //   const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key === 'Backspace') {
// //       e.preventDefault();
// //       const currentOtp = [...auth.otp];

// //       if (!currentOtp[index] && index > 0) {
// //         otpInputRefs.current[index - 1]?.focus();
// //         auth.handleOtpChange(index - 1, '');
// //       } else if (currentOtp[index]) {
// //         auth.handleOtpChange(index, '');
// //       } else {
// //         let clearIndex = index;
// //         while (clearIndex >= 0) {
// //           auth.handleOtpChange(clearIndex, '');
// //           clearIndex--;
// //         }
// //         otpInputRefs.current[0]?.focus();
// //       }
// //     }
// //   };

// //   const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
// //     e.preventDefault();
// //     const pasteData = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, 6);
// //     const newOtp = [...auth.otp];

// //     pasteData.split('').forEach((char, index) => {
// //       if (index < 6) {
// //         newOtp[index] = char;
// //       }
// //     });

// //     auth.setOtp(newOtp);
// //     const nextEmptyIndex = newOtp.findIndex((val) => !val);
// //     const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
// //     if (otpInputRefs.current[focusIndex]) {
// //       otpInputRefs.current[focusIndex]?.focus();
// //     }
// //   };

// //   const handleResendOtp = () => {
// //     if (auth.handleResend) {
// //       auth.setOtp(Array(6).fill(''));
// //       setTimeout(() => {
// //         otpInputRefs.current[0]?.focus();
// //       }, 100);
// //       auth.handleResend();
// //     }
// //   };

// //   // Handle form submission for phone/OTP stages
// //   const handleAuthSubmit = async () => {
// //     if (auth.stage === 'phone') {
// //       await auth.handleSendOtp();
// //     } else if (auth.stage === 'otp') {
// //       const result = await auth.handleVerifyOtp();
// //       if (result.success) {
// //         if (result.requiresProfileCompletion) {
// //           // Move to profile stage instead of closing modal
// //           auth.setStage('profile');
// //           auth.setRequiresProfile(true);
// //         } else {
// //           // Profile is already complete, mark auth as completed
// //           auth.setAuthCompleted(true);
// //         }
// //       }
// //     }
// //   };

// //   // Handle profile form submission
// //   const handleProfileSubmit = async (data: ProfileFormData) => {
// //     try {
// //       await dispatch(updateUserProfile(data)).unwrap();
// //       // Profile completed successfully, mark auth as completed
// //       auth.setAuthCompleted(true);
// //     } catch (error) {
// //       console.error('Profile update failed:', error);
// //       auth.setError('Failed to update profile. Please try again.');
// //     }
// //   };

// //   // Handle modal close - remove token if profile not completed
// //   const handleModalClose = () => {
// //     if (auth.requiresProfile && !auth.authCompleted) {
// //       clearToken(); // Remove token if user closes modal without completing profile
// //     }
// //     closeAuthModal();
// //   };

// //   if (!isOpen) return null;

// //   // Determine current type for AuthLayout
// //   const getCurrentType = () => {
// //     if (auth.stage === 'profile') return 'profile';
// //     if (auth.stage === 'otp') return 'otp';
// //     return authModal as 'login' | 'signup';
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={handleModalClose}>
// //       <DialogContent className="max-w-[95vw] md:max-w-6xl md:h-[95vh] md:h-[85vh] p-0 overflow-hidden bg-transparent border-none">
// //         <div className="bg-white rounded-lg h-full flex items-center justify-center">
// //           <AuthLayout
// //             type={getCurrentType()}
// //             onSubmit={handleAuthSubmit}
// //             onGoogleLogin={auth.handleGoogle}
// //             onSwitchAuth={handleSwitchAuth}
// //             loading={auth.stage === 'phone' ? auth.sending : auth.stage === 'otp' ? auth.verifying : isSubmitting}
// //             loadingText={
// //               auth.stage === 'phone'
// //                 ? auth.sending
// //                   ? 'Requesting OTP...'
// //                   : undefined
// //                 : auth.stage === 'otp'
// //                   ? auth.verifying
// //                     ? 'Verifying...'
// //                     : undefined
// //                   : isSubmitting
// //                     ? 'Saving Profile...'
// //                     : undefined
// //             }
// //             error={auth.error}
// //             success={auth.success}
// //             secondsLeft={auth.secondsLeft}
// //             onResend={handleResendOtp}
// //             userData={auth.userData}
// //           >
// //             {auth.stage === 'phone' && (
// //               <input
// //                 type="tel"
// //                 inputMode="numeric"
// //                 value={auth.phone}
// //                 onChange={(e) => auth.setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
// //                 placeholder="Enter your mobile number"
// //                 className="w-full border rounded-lg border-gray-300 py-3 text-center text-gray-700 text-base md:text-xl focus:outline-none focus:border-primary"
// //               />
// //             )}

// //             {auth.stage === 'otp' && (
// //               <div className="flex justify-center gap-1.5 md:gap-2 mt-4">
// //                 {auth.otp.map((digit, i) => (
// //                   <input
// //                     key={i}
// //                     ref={(el) => {
// //                       otpInputRefs.current[i] = el;
// //                     }}
// //                     id={`otp-${i}`}
// //                     type="tel"
// //                     inputMode="numeric"
// //                     maxLength={1}
// //                     value={digit}
// //                     onChange={(e) => handleOtpChange(i, e.target.value)}
// //                     onKeyDown={(e) => handleOtpKeyDown(i, e)}
// //                     onPaste={i === 0 ? handleOtpPaste : undefined}
// //                     className="w-8 h-8 md:w-12 md:h-12 border rounded-md text-center text-base md:text-xl focus:outline-none focus:ring-2 focus:ring-primary"
// //                   />
// //                 ))}
// //               </div>
// //             )}

// //             {auth.stage === 'profile' && (
// //               <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-4">
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="text-sm font-medium text-gray-700 mb-2 block">
// //                       Name *
// //                     </label>
// //                     <input
// //                       {...register('name', { required: 'Name is required' })}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //                       placeholder="Enter your full name"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="text-sm font-medium text-gray-700 mb-2 block">
// //                       Date of Birth *
// //                     </label>
// //                     <input
// //                       {...register('dob', { required: 'Date of birth is required' })}
// //                       type="date"
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="text-sm font-medium text-gray-700 mb-2 block">
// //                       Email *
// //                     </label>
// //                     <input
// //                       {...register('email', { 
// //                         required: 'Email is required',
// //                         pattern: {
// //                           value: /^\S+@\S+$/i,
// //                           message: 'Invalid email address'
// //                         }
// //                       })}
// //                       type="email"
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //                       placeholder="you@example.com"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="text-sm font-medium text-gray-700 mb-2 block">
// //                       Mobile Number *
// //                     </label>
// //                     <input
// //                       {...register('phone_number')}
// //                       type="tel"
// //                       value={auth.phone}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
// //                       disabled
// //                     />
// //                     <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="text-sm font-medium text-gray-700 mb-2 block">
// //                     Gender *
// //                   </label>
// //                   <select
// //                     {...register('gender', { required: 'Gender is required' })}
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //                   >
// //                     <option value="">Select Gender</option>
// //                     <option value="MALE">Male</option>
// //                     <option value="FEMALE">Female</option>
// //                     <option value="OTHER">Other</option>
// //                     <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
// //                   </select>
// //                 </div>

// //                 <div className="flex gap-3 pt-4">
// //                   <button
// //                     type="button"
// //                     onClick={handleModalClose}
// //                     className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     disabled={isSubmitting}
// //                     className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
// //                   >
// //                     {isSubmitting ? 'Saving...' : 'Complete Profile'}
// //                   </button>
// //                 </div>
// //               </form>
// //             )}
// //           </AuthLayout>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }


// // features/auth/components/AuthModal.tsx
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { Dialog, DialogContent } from '@/components/ui/dialog';
// import { useModal } from '@/context/ModalContext';
// import AuthLayout from './AuthLayout';
// import { useAuthFlow } from '../hooks/useAuthFlow';
// import { useForm } from 'react-hook-form';
// import { updateUserProfile } from '@/features/user-profile/userProfileThunks';
// import { useAppDispatch } from '@/store/hooks';
// import { clearToken } from '@/features/auth/utils/tokenManager';

// interface ProfileFormData {
//   name: string;
//   dob: string;
//   email: string;
//   phone_number: string;
//   gender: string;
// }

// export default function AuthModal() {
//   const { authModal, closeAuthModal, redirectUrl, openAuthModal } = useModal();
//   const dispatch = useAppDispatch();
//   const isOpen = authModal !== null;
//   const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const auth = useAuthFlow(authModal === 'login' ? 'LOGIN' : 'SIGNUP');

//   const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileFormData>();

//   // Check for pending Google auth on modal open
//   useEffect(() => {
//     if (isOpen) {
//       const pendingGoogleUser = localStorage.getItem('pendingGoogleUser');

//       if (pendingGoogleUser) {
//         try {
//           const { token, userData } = JSON.parse(pendingGoogleUser);
//           // Token is already set in the callback, just update the UI state
//           auth.setUserData(userData);
//           auth.setRequiresProfile(true);
//           auth.setStage('profile');
//         } catch (error) {
//           console.error('Error handling pending Google auth:', error);
//           clearToken();
//           localStorage.removeItem('pendingGoogleUser');
//         }
//       }
//     }
//   }, [isOpen]);

//   // ✅ UPDATED: Reset form when user data changes - includes Google user data
//   useEffect(() => {
//     if (auth.stage === 'profile') {
//       const googleUserData = auth.getGoogleUserData();

//       if (googleUserData) {
//         // Pre-fill with Google user data
//         reset({
//           name: googleUserData.userData?.name || '',
//           dob: googleUserData.userData?.dob ? googleUserData.userData.dob.split('T')[0] : '',
//           email: googleUserData.userData?.email || '',
//           phone_number: googleUserData.userData?.phone_number || auth.phone || '',
//           gender: googleUserData.userData?.gender || '',
//         });
//       } else if (auth.userData) {
//         // Pre-fill with phone auth user data
//         reset({
//           name: auth.userData.name || '',
//           dob: auth.userData.dob ? auth.userData.dob.split('T')[0] : '',
//           email: auth.userData.email || '',
//           phone_number: auth.userData.phone_number || auth.phone,
//           gender: auth.userData.gender || '',
//         });
//       }
//     }
//   }, [auth.stage, auth.userData, auth.phone, reset, auth.getGoogleUserData]);

//   // Handle successful authentication
//   useEffect(() => {
//     if (auth.authCompleted && isOpen) {
//       console.log('Auth completed, closing modal and redirecting');
//       closeAuthModal();

//       setTimeout(() => {
//         if (redirectUrl) {
//           console.log('Redirecting to:', redirectUrl);
//           window.location.href = redirectUrl;
//         }
//       }, 100);
//     }
//   }, [auth.authCompleted, isOpen, closeAuthModal, redirectUrl]);

//   // Reset auth flow when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       const timer = setTimeout(() => {
//         auth.setStage('phone');
//         auth.setPhone('');
//         auth.setOtp(Array(6).fill(''));
//         auth.setError(null);
//         auth.setSuccess(null);
//         auth.setRequiresProfile(false);
//         auth.setAuthCompleted(false);
//         auth.setUserData(null);
//       }, 300);
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen]);

//   // Auto-focus first OTP input when stage changes to OTP
//   useEffect(() => {
//     if (auth.stage === 'otp' && otpInputRefs.current[0]) {
//       const timer = setTimeout(() => {
//         otpInputRefs.current[0]?.focus();
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [auth.stage]);

//   const handleSwitchAuth = () => {
//     const newType = authModal === 'login' ? 'signup' : 'login';
//     openAuthModal(newType, redirectUrl || undefined);
//   };

//   const handleOtpChange = (index: number, value: string) => {
//     auth.handleOtpChange(index, value);
//     if (value && index < 5 && otpInputRefs.current[index + 1]) {
//       otpInputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Backspace') {
//       e.preventDefault();
//       const currentOtp = [...auth.otp];

//       if (!currentOtp[index] && index > 0) {
//         otpInputRefs.current[index - 1]?.focus();
//         auth.handleOtpChange(index - 1, '');
//       } else if (currentOtp[index]) {
//         auth.handleOtpChange(index, '');
//       } else {
//         let clearIndex = index;
//         while (clearIndex >= 0) {
//           auth.handleOtpChange(clearIndex, '');
//           clearIndex--;
//         }
//         otpInputRefs.current[0]?.focus();
//       }
//     }
//   };

//   const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pasteData = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, 6);
//     const newOtp = [...auth.otp];

//     pasteData.split('').forEach((char, index) => {
//       if (index < 6) {
//         newOtp[index] = char;
//       }
//     });

//     auth.setOtp(newOtp);
//     const nextEmptyIndex = newOtp.findIndex((val) => !val);
//     const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
//     if (otpInputRefs.current[focusIndex]) {
//       otpInputRefs.current[focusIndex]?.focus();
//     }
//   };

//   const handleResendOtp = () => {
//     if (auth.handleResend) {
//       auth.setOtp(Array(6).fill(''));
//       setTimeout(() => {
//         otpInputRefs.current[0]?.focus();
//       }, 100);
//       auth.handleResend();
//     }
//   };

//   // Handle form submission for phone/OTP stages
//   const handleAuthSubmit = async () => {
//     if (auth.stage === 'phone') {
//       await auth.handleSendOtp();
//     } else if (auth.stage === 'otp') {
//       const result = await auth.handleVerifyOtp();
//       if (result.success) {
//         if (result.requiresProfileCompletion) {
//           auth.setStage('profile');
//           auth.setRequiresProfile(true);
//         } else {
//           auth.setAuthCompleted(true);
//         }
//       }
//     }
//   };

//   // Handle profile form submission
//   const handleProfileSubmit = async (data: ProfileFormData) => {
//     try {
//       await dispatch(updateUserProfile(data)).unwrap();
//       await auth.handleProfileComplete();
//     } catch (error) {
//       console.error('Profile update failed:', error);
//       auth.setError('Failed to update profile. Please try again.');
//     }
//   };

//   // Handle modal close
//   const handleModalClose = () => {
//     if (auth.requiresProfile && !auth.authCompleted) {
//       clearToken();
//       localStorage.removeItem('pendingGoogleUser');
//     }
//     closeAuthModal();
//   };

//   if (!isOpen) return null;

//   // Determine current type for AuthLayout
//   const getCurrentType = () => {
//     if (auth.stage === 'profile') return 'profile';
//     if (auth.stage === 'otp') return 'otp';
//     return authModal as 'login' | 'signup';
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleModalClose}>
//       <DialogContent className="max-w-[95vw] md:max-w-6xl md:h-[95vh] md:h-[85vh] p-0 overflow-hidden bg-transparent border-none">
//         <div className="bg-white rounded-lg h-full flex items-center justify-center">
//           <AuthLayout
//             type={getCurrentType()}
//             onSubmit={handleAuthSubmit}
//             onGoogleLogin={auth.handleGoogleLogin}
//             onSwitchAuth={handleSwitchAuth}
//             loading={
//               auth.stage === 'phone' ? auth.sending :
//                 auth.stage === 'otp' ? auth.verifying :
//                   auth.googleLoading ? true : isSubmitting
//             }
//             loadingText={
//               auth.stage === 'phone'
//                 ? auth.sending
//                   ? 'Requesting OTP...'
//                   : undefined
//                 : auth.stage === 'otp'
//                   ? auth.verifying
//                     ? 'Verifying...'
//                     : undefined
//                   : auth.googleLoading
//                     ? 'Connecting to Google...'
//                     : isSubmitting
//                       ? 'Saving Profile...'
//                       : undefined
//             }
//             error={auth.error}
//             success={auth.success}
//             secondsLeft={auth.secondsLeft}
//             onResend={handleResendOtp}
//             userData={auth.userData}
//             onChangeNumber={() => {
//               auth.setStage('phone');
//             }}
//           >
//             {auth.stage === 'phone' && (
//               <input
//                 type="tel"
//                 inputMode="numeric"
//                 value={auth.phone}
//                 onChange={(e) => auth.setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
//                 placeholder="Enter your mobile number"
//                 className="w-full border rounded-lg border-gray-300 py-3 text-center text-gray-700 text-base md:text-xl focus:outline-none focus:border-primary"
//               />
//             )}

//             {auth.stage === 'otp' && (
//               <div className="flex justify-center gap-1.5 md:gap-2 mt-4">
//                 {auth.otp.map((digit, i) => (
//                   <input
//                     key={i}
//                     ref={(el) => {
//                       otpInputRefs.current[i] = el;
//                     }}
//                     id={`otp-${i}`}
//                     type="tel"
//                     inputMode="numeric"
//                     maxLength={1}
//                     value={digit}
//                     onChange={(e) => handleOtpChange(i, e.target.value)}
//                     onKeyDown={(e) => handleOtpKeyDown(i, e)}
//                     onPaste={i === 0 ? handleOtpPaste : undefined}
//                     className="w-8 h-8 md:w-12 md:h-12 border rounded-md text-center text-base md:text-xl focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 ))}
//               </div>
//             )}

//             {auth.stage === 'profile' && (
//               <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">
//                       Name *
//                     </label>
//                     <input
//                       {...register('name', { required: 'Name is required' })}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                       placeholder="Enter your full name"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">
//                       Date of Birth *
//                     </label>
//                     <input
//                       {...register('dob', { required: 'Date of birth is required' })}
//                       type="date"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">
//                       Email *
//                     </label>
//                     <input
//                       {...register('email', {
//                         required: 'Email is required',
//                         pattern: {
//                           value: /^\S+@\S+$/i,
//                           message: 'Invalid email address'
//                         }
//                       })}
//                       type="email"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                       placeholder="you@example.com"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">
//                       Mobile Number
//                     </label>
//                     <input
//                       {...register('phone_number')}
//                       type="tel"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                       placeholder="Optional - add later"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                       You can add your mobile number later if needed
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-gray-700 mb-2 block">
//                     Gender *
//                   </label>
//                   <select
//                     {...register('gender', { required: 'Gender is required' })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="MALE">Male</option>
//                     <option value="FEMALE">Female</option>
//                     <option value="OTHER">Other</option>
//                     <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
//                   </select>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={handleModalClose}
//                     className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//                   >
//                     {isSubmitting ? 'Saving...' : 'Complete Profile'}
//                   </button>
//                 </div>
//               </form>
//             )}
//           </AuthLayout>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }




'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/context/ModalContext';
import AuthLayout from './AuthLayout';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '@/features/user-profile/userProfileThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearToken } from '@/features/auth/utils/tokenManager';

interface ProfileFormData {
  name: string;
  dob: string;
  email: string;
  phone_number: string;
  gender: string;
}

export default function AuthModal() {
  const { authModal, closeAuthModal, redirectUrl, openAuthModal } = useModal();
  const dispatch = useAppDispatch();
  const isOpen = authModal !== null;
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const auth = useAuthFlow(authModal === 'login' ? 'LOGIN' : 'SIGNUP');
  const saveMobile = useAppSelector((state) => state.userProfile.saveMobile);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileFormData>();

  useEffect(() => {
    if (saveMobile) {
      reset((prev) => ({
        ...prev,
        phone_number: saveMobile,
      }));
    }
  }, [saveMobile, reset]);


  // ✅ UPDATED: Reset form when user data changes - only use Redux store data
  useEffect(() => {
    if (auth.stage === 'profile' && auth.userData) {
      reset({
        name: auth.userData.name || '',
        dob: auth.userData.dob ? auth.userData.dob.split('T')[0] : '',
        email: auth.userData.email || '',
        phone_number: auth.userData.phone_number || auth.phone,
        gender: auth.userData.gender || '',
      });
    }
  }, [auth.stage, auth.userData, auth.phone, reset]);

  // Handle successful authentication
  useEffect(() => {
    if (auth.authCompleted && isOpen) {
      console.log('Auth completed, closing modal and redirecting');
      closeAuthModal();

      setTimeout(() => {
        if (redirectUrl) {
          console.log('Redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
        }
      }, 100);
    }
  }, [auth.authCompleted, isOpen, closeAuthModal, redirectUrl]);

  

  // Reset auth flow when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        auth.setStage('phone');
        auth.setPhone('');
        auth.setOtp(Array(6).fill(''));
        auth.setError(null);
        auth.setSuccess(null);
        auth.setRequiresProfile(false);
        auth.setAuthCompleted(false);
        auth.setUserData(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-focus first OTP input when stage changes to OTP
  useEffect(() => {
    if (auth.stage === 'otp' && otpInputRefs.current[0]) {
      const timer = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [auth.stage]);

  const handleSwitchAuth = () => {
    const newType = authModal === 'login' ? 'signup' : 'login';
    openAuthModal(newType, redirectUrl || undefined);
  };

  const handleOtpChange = (index: number, value: string) => {
    auth.handleOtpChange(index, value);
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const currentOtp = [...auth.otp];

      if (!currentOtp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
        auth.handleOtpChange(index - 1, '');
      } else if (currentOtp[index]) {
        auth.handleOtpChange(index, '');
      } else {
        let clearIndex = index;
        while (clearIndex >= 0) {
          auth.handleOtpChange(clearIndex, '');
          clearIndex--;
        }
        otpInputRefs.current[0]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, 6);
    const newOtp = [...auth.otp];

    pasteData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });

    auth.setOtp(newOtp);
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    if (otpInputRefs.current[focusIndex]) {
      otpInputRefs.current[focusIndex]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (auth.handleResend) {
      auth.setOtp(Array(6).fill(''));
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      auth.handleResend();
    }
  };

  // Handle form submission for phone/OTP stages
  const handleAuthSubmit = async () => {
    if (auth.stage === 'phone') {
      await auth.handleSendOtp();
    } else if (auth.stage === 'otp') {
      const result = await auth.handleVerifyOtp();
      if (result.success) {
        if (result.requiresProfileCompletion) {
          auth.setStage('profile');
          auth.setRequiresProfile(true);
        } else {
          auth.setAuthCompleted(true);
        }
      }
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      await auth.handleProfileComplete();
    } catch (error) {
      console.error('Profile update failed:', error);
      auth.setError('Failed to update profile. Please try again.');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    if (auth.requiresProfile && !auth.authCompleted) {
      clearToken();
    }
    closeAuthModal();
  };

  if (!isOpen) return null;

  // Determine current type for AuthLayout
  const getCurrentType = () => {
    if (auth.stage === 'profile') return 'profile';
    if (auth.stage === 'otp') return 'otp';
    return authModal as 'login' | 'signup';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl md:h-[95vh] md:h-[85vh] p-0 overflow-hidden bg-transparent border-none">
        <DialogTitle className='sr-only'>{authModal === 'login' ? 'LOGIN' : 'SIGNUP'}</DialogTitle>
        <div className="bg-white rounded-lg h-full flex items-center justify-center">
          <AuthLayout
            type={getCurrentType()}
            onSubmit={handleAuthSubmit}
            onGoogleLogin={auth.handleGoogleLogin}
            onSwitchAuth={handleSwitchAuth}
            loading={
              auth.stage === 'phone' ? auth.sending :
                auth.stage === 'otp' ? auth.verifying :
                  auth.googleLoading ? true : isSubmitting
            }
            loadingText={
              auth.stage === 'phone'
                ? auth.sending
                  ? 'Requesting OTP...'
                  : undefined
                : auth.stage === 'otp'
                  ? auth.verifying
                    ? 'Verifying...'
                    : undefined
                  : auth.googleLoading
                    ? 'Connecting to Google...'
                    : isSubmitting
                      ? 'Saving Profile...'
                      : undefined
            }
            error={auth.error}
            success={auth.success}
            secondsLeft={auth.secondsLeft}
            onResend={handleResendOtp}
            userData={auth.userData}
            onChangeNumber={() => {
              auth.setStage('phone');
            }}
          >
            {auth.stage === 'phone' && (
              <input
                type="tel"
                inputMode="numeric"
                value={auth.phone}
                onChange={(e) => auth.setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                placeholder="Enter your mobile number"
                className="w-full border rounded-lg border-gray-300 py-3 text-center text-gray-700 text-base md:text-xl focus:outline-none focus:border-primary"
              />
            )}

            {auth.stage === 'otp' && (
              <div className="flex justify-center gap-1.5 md:gap-2 mt-4">
                {auth.otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpInputRefs.current[i] = el;
                    }}
                    id={`otp-${i}`}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className="w-8 h-8 md:w-12 md:h-12 border rounded-md text-center text-base md:text-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ))}
              </div>
            )}

            {auth.stage === 'profile' && (
              <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Name *
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Date of Birth *
                    </label>
                    <input
                      {...register('dob', { required: 'Date of birth is required' })}
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email *
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Mobile Number
                    </label>
                    <input
                      {...register('phone_number')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Optional - add later"
                      disabled
                    />
                    {/* <p className="text-xs text-gray-500 mt-1">
                      You can add your mobile number later if needed
                    </p> */}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Gender *
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Complete Profile'}
                  </button>
                </div>
              </form>
            )}
          </AuthLayout>
        </div>
      </DialogContent>
    </Dialog>
  );
}
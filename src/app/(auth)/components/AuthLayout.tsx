// // // 'use client';

// // // import React, { ReactNode, useEffect, useState } from 'react';
// // // import Link from 'next/link';
// // // import Carousel from '@/components/shared/carousel/Carousel';
// // // import AuthSlideCard from '@/components/shared/card/AuthSlideCard';
// // // import { FcGoogle } from 'react-icons/fc';

// // // export const bannerItems = [
// // //   {
// // //     image: '/auth/Home-Delivery-of-Medicines.png',
// // //     title: 'Free Home delivery',
// // //     description: 'Explore amazing destinations and make unforgettable memories.',
// // //   },
// // //   {
// // //     image: '/auth/Helthcare.png',
// // //     title: 'Adventure Awaits',
// // //     description: 'Gear up for thrilling experiences in every corner of the globe.',
// // //   },
// // //   {
// // //     image: '/auth/Health-Related-Queries.png',
// // //     title: 'Relax and Unwind',
// // //     description: 'Find peace in beautiful landscapes and serene escapes.',
// // //   },
// // //   {
// // //     image: '/auth/imgi_36_ms8c7ad5qcgne2xhdlc3.png',
// // //     title: 'Cultural Journeys',
// // //     description: 'Immerse yourself in rich cultures and vibrant traditions.',
// // //   },
// // //   {
// // //     image: '/auth/Know-Your-Medicines.png',
// // //     title: 'Food & Flavor',
// // //     description: 'Savor the tastes of the world with unique culinary adventures.',
// // //   },
// // //   {
// // //     image: '/imgi_38_dlqs6iyqezfblkzohx0t.png',
// // //     title: 'Hidden Gems',
// // //     description: 'Discover secret spots off the beaten path that inspire awe.',
// // //   },
// // // ];

// // // interface AuthLayoutProps {
// // //   type: 'login' | 'signup' | 'otp';
// // //   onSubmit: () => void;
// // //   onGoogleLogin: () => void;
// // //   children: ReactNode;
// // //   onSwitchAuth?: () => void;
// // //   loading?: boolean;
// // //   loadingText?: string;
// // // }

// // // const AuthLayout: React.FC<AuthLayoutProps> = ({
// // //   type,
// // //   onSubmit,
// // //   onGoogleLogin,
// // //   children,
// // //   onSwitchAuth,
// // //   loading,
// // //   loadingText,
// // // }) => {
// // //   const isLogin = type === 'login';
// // //   const title = isLogin ? 'Login' : type === 'signup' ? 'Sign Up' : 'Enter OTP';
// // //   const description = isLogin
// // //     ? 'Get access to your orders, lab tests & doctor consultations'
// // //     : type === 'signup'
// // //       ? 'Please enter your Mobile number to receive One Time Password (OTP)'
// // //       : 'Enter the OTP sent to your mobile number';

// // //   // OTP timer
// // //   const [timer, setTimer] = useState(90);
// // //   useEffect(() => {
// // //     if (type !== 'otp') return;
// // //     const interval = setInterval(() => {
// // //       setTimer((prev) => (prev > 0 ? prev - 1 : 0));
// // //     }, 1000);
// // //     return () => clearInterval(interval);
// // //   }, [type]);

// // //   return (
// // //     <main>
// // //       <div className="min-h-[90dvh] flex flex-col md:flex-row px-4 md:px-10 py-6 md:py-8">
// // //         {/* Carousel */}
// // //         <div className="md:w-1/2 min-h-[40dvh] md:min-h-[90dvh] border-b md:border-b-0 md:border-r border-gray-200 flex justify-center items-center">
// // //           <div className="w-full max-w-[500px] h-full flex justify-center">
// // //             <Carousel
// // //               items={bannerItems}
// // //               slidesPerViewDesktop={1}
// // //               slidesPerViewTablet={1}
// // //               slidesPerViewMobile={1}
// // //               spaceBetween={0}
// // //               autoplay
// // //               loop
// // //               showPagination
// // //               showArrows={false}
// // //               centeredSlides
// // //               renderItem={(item) => <AuthSlideCard item={item} />}
// // //             />
// // //           </div>
// // //         </div>

// // //         {/* Form Section */}
// // //         <div className="md:w-1/2 min-h-[40dvh] md:min-h-[90dvh]  flex flex-col md:pt-20 md:pb-6 px-4 md:px-20 items-center mt-6 md:mt-0">
// // //           <div className={`h-full flex flex-col ${type !== 'otp' && 'justify-between'} w-full`}>
// // //             {/* Title & Description */}
// // //             <div className="flex flex-col items-center">
// // //               <h1 className="text-xl md:text-4xl">{title}</h1>
// // //               <p className="text-gray-500 text-sm md:text-base mt-2 md:mt-4 text-center md:text-start">
// // //                 {description}
// // //               </p>
// // //             </div>

// // //             {/* Form / Inputs */}
// // //             <div
// // //               className={`flex flex-col w-full mt-8 md:mt-16 ${type === 'otp' ? 'space-y-6 md:space-y-8' : 'space-y-6'}`}
// // //             >
// // //               {/* Google login button for login/signup */}
// // //               {type !== 'otp' && (
// // //                 <>
// // //                   <button
// // //                     onClick={onGoogleLogin}
// // //                     className="w-full text-sm md:text-lg border border-gray-300 text-gray-600 rounded-md px-4 py-1 md:py-2 flex items-center justify-center gap-2 hover:bg-slate-50"
// // //                   >
// // //                     <FcGoogle />
// // //                     Continue with Google
// // //                   </button>
// // //                   <div className="flex justify-center mt-2 md:mt-4">
// // //                     <p className="text-sm md:text-base">OR</p>
// // //                   </div>
// // //                 </>
// // //               )}

// // //               {/* Children (phone input or OTP inputs) */}
// // //               <div>{children}</div>

// // //               {/* OTP resend */}
// // //               {type === 'otp' && (
// // //                 <div className="text-center text-sm md:text-base text-gray-500">
// // //                   {timer > 0 ? (
// // //                     <p>Resend OTP in {timer}s</p>
// // //                   ) : (
// // //                     <button className="text-primary font-bold" onClick={() => setTimer(90)}>
// // //                       Resend OTP
// // //                     </button>
// // //                   )}
// // //                 </div>
// // //               )}

// // //               {/* Submit button */}
// // //               {/* Submit button */}
// // //               <button
// // //                 onClick={onSubmit}
// // //                 disabled={loading}
// // //                 className={`w-full bg-primary py-1 md:py-2 text-base md:text-xl  font-bold rounded-lg text-white flex justify-center items-center gap-2 transition-all ${
// // //                   loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
// // //                 }`}
// // //               >
// // //                 {loading ? (
// // //                   <>
// // //                     <svg
// // //                       className="animate-spin h-5 w-5 text-white"
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       fill="none"
// // //                       viewBox="0 0 24 24"
// // //                     >
// // //                       <circle
// // //                         className="opacity-25"
// // //                         cx="12"
// // //                         cy="12"
// // //                         r="10"
// // //                         stroke="currentColor"
// // //                         strokeWidth="4"
// // //                       />
// // //                       <path
// // //                         className="opacity-75"
// // //                         fill="currentColor"
// // //                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
// // //                       />
// // //                     </svg>
// // //                     <span>{loadingText}</span>
// // //                   </>
// // //                 ) : (
// // //                   <span>
// // //                     {isLogin ? 'Login' : type === 'signup' ? 'Sign Up' : 'Verify & Continue'}
// // //                   </span>
// // //                 )}
// // //               </button>

// // //               {/* Bottom links for login/signup */}
// // //               {type !== 'otp' && (
// // //                 <div className="flex flex-col justify-center items-center mt-3 md:mt-6 text-center">
// // //                   <div className="flex gap-1 font-bold text-sm md:text-base items-center">
// // //                     <span className="text-gray-600">
// // //                       {isLogin ? 'New on DavaBharti?' : 'Have an account?'}
// // //                     </span>
// // //                     <button className="text-primary" onClick={onSwitchAuth}>
// // //                       {isLogin ? 'Sign Up' : 'Login'}
// // //                     </button>
// // //                   </div>
// // //                   <p className="mt-2 md:mt-4 text-[12px] md:text-base text-gray-500">
// // //                     By {isLogin ? 'logging in' : 'signing up'}, you agree to our <br />
// // //                     <Link href="#" className="underline">
// // //                       Terms and Conditions
// // //                     </Link>{' '}
// // //                     &{' '}
// // //                     <Link href="#" className="underline">
// // //                       Privacy Policy
// // //                     </Link>
// // //                   </p>
// // //                   {isLogin && (
// // //                     <button className="mt-2 md:mt-4 text-primary text-sm md:text-base">
// // //                       Need help? Get In Touch
// // //                     </button>
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </main>
// // //   );
// // // };

// // // export default AuthLayout;

// // 'use client';

// // import React, { ReactNode } from 'react';
// // import Link from 'next/link';
// // import Carousel from '@/components/shared/carousel/Carousel';
// // import AuthSlideCard from '@/components/shared/card/AuthSlideCard';
// // import { FcGoogle } from 'react-icons/fc';

// // export const bannerItems = [
// //   {
// //     image: '/auth/Home-Delivery-of-Medicines.png',
// //     title: 'Fast & Free Home Delivery',
// //     description:
// //       'Order genuine medicines and get them delivered to your doorstep safely and quickly.',
// //   },
// //   {
// //     image: '/auth/Health-Related-Queries.png',
// //     title: 'Talk to Health Experts',
// //     description:
// //       'Get reliable medical guidance and prescription assistance from certified professionals.',
// //   },
// //   {
// //     image: '/auth/Helthcare.png',
// //     title: 'Your One-Stop Health Partner',
// //     description:
// //       'Shop medicines, book lab tests, and manage your health needs — all in one place.',
// //   },
// //   {
// //     image: '/auth/Know-Your-Medicines.png',
// //     title: 'Know Your Medicines Better',
// //     description:
// //       'Understand usage, dosage, and alternatives to make informed healthcare decisions.',
// //   },
// //   {
// //     image: '/auth/Secure-Pharmacy.png',
// //     title: '100% Genuine & Trusted Pharmacy',
// //     description:
// //       'We partner with verified suppliers to ensure every product you buy is authentic and safe.',
// //   },
// // ];

// // interface AuthLayoutProps {
// //   type: 'login' | 'signup' | 'otp';
// //   onSubmit: () => void;
// //   onGoogleLogin: () => void;
// //   children: ReactNode;
// //   onSwitchAuth?: () => void;
// //   loading?: boolean;
// //   loadingText?: string;
// //   error?: string | null;
// //   success?: string | null;
// //   secondsLeft?: number;
// //   onResend?: () => void;
// // }

// // const AuthLayout: React.FC<AuthLayoutProps> = ({
// //   type,
// //   onSubmit,
// //   onGoogleLogin,
// //   children,
// //   onSwitchAuth,
// //   loading,
// //   loadingText,
// //   error,
// //   success,
// //   secondsLeft,
// //   onResend,
// // }) => {
// //   const isLogin = type === 'login';
// //   const title = isLogin ? 'Login' : type === 'signup' ? 'Sign Up' : 'Enter OTP';
// //   const description = isLogin
// //     ? 'Get access to your orders, lab tests & doctor consultations'
// //     : type === 'signup'
// //     ? 'Please enter your Mobile number to receive One Time Password (OTP)'
// //     : 'Enter the OTP sent to your mobile number';

// //   return (
// //   <main className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-5">
// //   <div className="flex flex-col md:flex-row px-6 md:px-12 py-10 md:py-14 max-w-7xl mx-auto shadow-lg rounded-2xl bg-white/70 backdrop-blur-sm">
// //     {/* Carousel Section */}
// //     <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 flex justify-center items-center relative overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
// //       <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
// //       <div className="w-full max-w-[480px] flex justify-center">
// //         <Carousel
// //           items={bannerItems}
// //           slidesPerViewDesktop={1}
// //           slidesPerViewTablet={1}
// //           slidesPerViewMobile={1}
// //           spaceBetween={0}
// //           autoplay
// //           loop
// //           showPagination
// //           showArrows={false}
// //           centeredSlides
// //           renderItem={(item) => <AuthSlideCard item={item} />}
// //         />
// //       </div>
// //     </div>

// //     {/* Form Section */}
// //     <div className="md:w-1/2 flex flex-col px-6 md:px-16 pt-8 pb-10 md:py-16 bg-white/90 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none shadow-inner">
// //       <div className={`h-full flex flex-col ${type !== 'otp' && 'justify-between'} w-full`}>
// //         {/* Title & Description */}
// //         <div className="flex flex-col items-center text-center">
// //           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
// //           <p className="text-gray-500 mt-3 text-base md:text-lg max-w-md">{description}</p>
// //         </div>

// //         {/* Inputs + Actions */}
// //         <div
// //           className={`flex flex-col w-full mt-10 ${
// //             type === 'otp' ? 'space-y-8' : 'space-y-6'
// //           }`}
// //         >
// //           {type !== 'otp' && (
// //             <>
// //               <button
// //                 onClick={onGoogleLogin}
// //                 className="w-full text-sm md:text-base border border-gray-300 text-gray-600 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
// //               >
// //                 <FcGoogle className="text-xl" />
// //                 Continue with Google
// //               </button>
// //               <div className="flex justify-center mt-2 md:mt-4">
// //                 <p className="text-sm text-gray-400 font-medium">OR</p>
// //               </div>
// //             </>
// //           )}

// //           <div>{children}</div>

// //           {/* OTP Timer */}
// //           {type === 'otp' && (
// //             <div className="text-center text-sm md:text-base text-gray-500">
// //               {secondsLeft && secondsLeft > 0 ? (
// //                 <p>Resend OTP in <span className="font-semibold text-gray-700">{secondsLeft}s</span></p>
// //               ) : (
// //                 <button
// //                   className="text-primary font-semibold hover:underline"
// //                   onClick={onResend}
// //                 >
// //                   Resend OTP
// //                 </button>
// //               )}
// //             </div>
// //           )}

// //           {/* Error / Success */}
// //           {(error || success) && (
// //             <p
// //               className={`text-center text-sm mt-2 ${
// //                 error ? 'text-red-500' : 'text-green-600'
// //               }`}
// //             >
// //               {error || success}
// //             </p>
// //           )}

// //           {/* Submit */}
// //           <button
// //             onClick={onSubmit}
// //             disabled={loading}
// //             className={`w-full py-3 text-base md:text-lg font-semibold rounded-lg text-white flex justify-center items-center gap-2 transition-all shadow-md ${
// //               loading
// //                 ? 'bg-primary/70 cursor-not-allowed'
// //                 : 'bg-primary hover:bg-primary/90 hover:shadow-lg hover:-translate-y-[1px]'
// //             }`}
// //           >
// //             {loading ? (
// //               <>
// //                 <svg
// //                   className="animate-spin h-5 w-5 text-white"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   fill="none"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <circle
// //                     className="opacity-25"
// //                     cx="12"
// //                     cy="12"
// //                     r="10"
// //                     stroke="currentColor"
// //                     strokeWidth="4"
// //                   />
// //                   <path
// //                     className="opacity-75"
// //                     fill="currentColor"
// //                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
// //                   />
// //                 </svg>
// //                 <span>{loadingText || 'Processing...'}</span>
// //               </>
// //             ) : (
// //               <span>
// //                 {isLogin ? 'Login' : type === 'signup' ? 'Sign Up' : 'Verify & Continue'}
// //               </span>
// //             )}
// //           </button>

// //           {/* Switch Auth Links */}
// //           {type !== 'otp' && (
// //             <div className="flex flex-col justify-center items-center mt-4 text-center">
// //               <div className="flex gap-1 font-medium text-sm md:text-base items-center">
// //                 <span className="text-gray-600">
// //                   {isLogin ? 'New on DavaBharti?' : 'Have an account?'}
// //                 </span>
// //                 <button
// //                   className="text-primary font-semibold hover:underline"
// //                   onClick={onSwitchAuth}
// //                 >
// //                   {isLogin ? 'Sign Up' : 'Login'}
// //                 </button>
// //               </div>
// //               <p className="mt-3 text-xs md:text-sm text-gray-500 leading-relaxed">
// //                 By {isLogin ? 'logging in' : 'signing up'}, you agree to our{' '}
// //                 <Link href="#" className="text-primary underline hover:text-primary/80">
// //                   Terms and Conditions
// //                 </Link>{' '}
// //                 &{' '}
// //                 <Link href="#" className="text-primary underline hover:text-primary/80">
// //                   Privacy Policy
// //                 </Link>
// //               </p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // </main>

// //   );
// // };

// // export default AuthLayout;

// //-------------------updated for modal------------------
// // features/auth/components/AuthLayout.tsx (Updated)
// // 'use client';

// // import React, { ReactNode } from 'react';
// // import Link from 'next/link';
// // import Carousel from '@/components/shared/carousel/Carousel';
// // import AuthSlideCard from '@/components/shared/card/AuthSlideCard';
// // import { FcGoogle } from 'react-icons/fc';
// // import { X } from 'lucide-react';
// // import { useModal } from '@/context/ModalContext';

// // // ... keep your bannerItems array the same ...

// // interface AuthLayoutProps {
// //   type: 'login' | 'signup' | 'otp';
// //   onSubmit: () => void;
// //   onGoogleLogin: () => void;
// //   children: ReactNode;
// //   onSwitchAuth?: () => void;
// //   loading?: boolean;
// //   loadingText?: string;
// //   error?: string | null;
// //   success?: string | null;
// //   secondsLeft?: number;
// //   onResend?: () => void;
// // }

// // export const bannerItems = [
// //   {
// //     image: '/auth/Home-Delivery-of-Medicines.png',
// //     title: 'Fast & Free Home Delivery',
// //     description:
// //       'Order genuine medicines and get them delivered to your doorstep safely and quickly.',
// //   },
// //   {
// //     image: '/auth/Health-Related-Queries.png',
// //     title: 'Talk to Health Experts',
// //     description:
// //       'Get reliable medical guidance and prescription assistance from certified professionals.',
// //   },
// //   {
// //     image: '/auth/Helthcare.png',
// //     title: 'Your One-Stop Health Partner',
// //     description:
// //       'Shop medicines, book lab tests, and manage your health needs — all in one place.',
// //   },
// //   {
// //     image: '/auth/Know-Your-Medicines.png',
// //     title: 'Know Your Medicines Better',
// //     description:
// //       'Understand usage, dosage, and alternatives to make informed healthcare decisions.',
// //   },
// //   {
// //     image: '/auth/Secure-Pharmacy.png',
// //     title: '100% Genuine & Trusted Pharmacy',
// //     description:
// //       'We partner with verified suppliers to ensure every product you buy is authentic and safe.',
// //   },
// // ];

// // const AuthLayout: React.FC<AuthLayoutProps> = ({
// //   type,
// //   onSubmit,
// //   onGoogleLogin,
// //   children,
// //   onSwitchAuth,
// //   loading,
// //   loadingText,
// //   error,
// //   success,
// //   secondsLeft,
// //   onResend,
// // }) => {
// //   const { closeAuthModal } = useModal();
// //   const isLogin = type === 'login';
// //   const title = isLogin ? 'Login' : type === 'signup' ? 'Sign Up' : 'Enter OTP';
// //   const description = isLogin
// //     ? 'Get access to your orders, lab tests & doctor consultations'
// //     : type === 'signup'
// //     ? 'Please enter your Mobile number to receive One Time Password (OTP)'
// //     : 'Enter the OTP sent to your mobile number';

// //   return (
// //     <div className="relative">
// //       {/* Close button for modal */}
// //       <button
// //         onClick={closeAuthModal}
// //         className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
// //       >
// //         <X className="w-5 h-5" />
// //       </button>

// //       <div className="flex flex-col md:flex-row max-h-[80vh] overflow-hidden rounded-2xl bg-white">
// //         {/* Carousel Section */}
// //         <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 flex justify-center items-center relative overflow-hidden">
// //           <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
// //           <div className="w-full max-w-[480px] flex justify-center py-8">
// //             <Carousel
// //               items={bannerItems}
// //               slidesPerViewDesktop={1}
// //               slidesPerViewTablet={1}
// //               slidesPerViewMobile={1}
// //               spaceBetween={0}
// //               autoplay
// //               loop
// //               showPagination
// //               showArrows={false}
// //               centeredSlides
// //               renderItem={(item) => <AuthSlideCard item={item} />}
// //             />
// //           </div>
// //         </div>

// //         {/* Form Section */}
// //         <div className="md:w-1/2 flex flex-col px-6 md:px-12 py-8 bg-white/90 overflow-y-auto">
// //           <div className={`h-full flex flex-col ${type !== 'otp' && 'justify-between'} w-full`}>
// //             {/* Title & Description */}
// //             <div className="flex flex-col items-center text-center">
// //               <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
// //               <p className="text-gray-500 mt-2 text-sm md:text-base max-w-md">{description}</p>
// //             </div>

// //             {/* Inputs + Actions */}
// //             <div
// //               className={`flex flex-col w-full mt-6 ${
// //                 type === 'otp' ? 'space-y-6' : 'space-y-4'
// //               }`}
// //             >
// //               {type !== 'otp' && (
// //                 <>
// //                   <button
// //                     onClick={onGoogleLogin}
// //                     className="w-full text-sm md:text-base border border-gray-300 text-gray-600 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
// //                   >
// //                     <FcGoogle className="text-xl" />
// //                     Continue with Google
// //                   </button>
// //                   <div className="flex justify-center mt-2">
// //                     <p className="text-sm text-gray-400 font-medium">OR</p>
// //                   </div>
// //                 </>
// //               )}

// //               <div>{children}</div>

// //               {/* OTP Timer */}
// //               {type === 'otp' && (
// //                 <div className="text-center text-sm text-gray-500">
// //                   {secondsLeft && secondsLeft > 0 ? (
// //                     <p>Resend OTP in <span className="font-semibold text-gray-700">{secondsLeft}s</span></p>
// //                   ) : (
// //                     <button
// //                       className="text-primary font-semibold hover:underline"
// //                       onClick={onResend}
// //                     >
// //                       Resend OTP
// //                     </button>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Error / Success */}
// //               {(error || success) && (
// //                 <p
// //                   className={`text-center text-sm ${
// //                     error ? 'text-red-500' : 'text-green-600'
// //                   }`}
// //                 >
// //                   {error || success}
// //                 </p>
// //               )}

// //               {/* Submit */}
// //               <button
// //                 onClick={onSubmit}
// //                 disabled={loading}
// //                 className={`w-full py-3 text-sm md:text-base font-semibold rounded-lg text-white flex justify-center items-center gap-2 transition-all shadow-md ${
// //                   loading
// //                     ? 'bg-primary/70 cursor-not-allowed'
// //                     : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
// //                 }`}
// //               >
// //                 {loading ? (
// //                   <>
// //                     <svg
// //                       className="animate-spin h-4 w-4 text-white"
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       fill="none"
// //                       viewBox="0 0 24 24"
// //                     >
// //                       <circle
// //                         className="opacity-25"
// //                         cx="12"
// //                         cy="12"
// //                         r="10"
// //                         stroke="currentColor"
// //                         strokeWidth="4"
// //                       />
// //                       <path
// //                         className="opacity-75"
// //                         fill="currentColor"
// //                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
// //                       />
// //                     </svg>
// //                     <span>{loadingText || 'Processing...'}</span>
// //                   </>
// //                 ) : (
// //                   <span>
// //                     {isLogin ? 'Login' : type === 'signup' ? 'Sign Up' : 'Verify & Continue'}
// //                   </span>
// //                 )}
// //               </button>

// //               {/* Switch Auth Links */}
// //               {type !== 'otp' && (
// //                 <div className="flex flex-col justify-center items-center mt-3 text-center">
// //                   <div className="flex gap-1 font-medium text-sm items-center">
// //                     <span className="text-gray-600">
// //                       {isLogin ? 'New on DavaBharti?' : 'Have an account?'}
// //                     </span>
// //                     <button
// //                       className="text-primary font-semibold hover:underline"
// //                       onClick={onSwitchAuth}
// //                     >
// //                       {isLogin ? 'Sign Up' : 'Login'}
// //                     </button>
// //                   </div>
// //                   <p className="mt-2 text-xs text-gray-500 leading-relaxed">
// //                     By {isLogin ? 'logging in' : 'signing up'}, you agree to our{' '}
// //                     <Link href="#" className="text-primary underline hover:text-primary/80">
// //                       Terms and Conditions
// //                     </Link>{' '}
// //                     &{' '}
// //                     <Link href="#" className="text-primary underline hover:text-primary/80">
// //                       Privacy Policy
// //                     </Link>
// //                   </p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AuthLayout;

// // components/auth/AuthLayout.tsx (IMPROVED MOBILE LAYOUT)
// // components/auth/AuthLayout.tsx (UPDATED - FIXED SPACING)
// 'use client';

// import React, { ReactNode } from 'react';
// import Link from 'next/link';
// import Carousel from '@/components/shared/carousel/Carousel';
// import AuthSlideCard from '@/components/shared/card/AuthSlideCard';
// import { FcGoogle } from 'react-icons/fc';
// import { House, X } from 'lucide-react';
// import { useModal } from '@/context/ModalContext';
// import { useRouter } from 'next/navigation';
// import { useAppSelector } from '@/store/hooks';

// interface AuthLayoutProps {
//   type: 'login' | 'signup' | 'otp';
//   onSubmit: () => void;
//   onGoogleLogin: () => void;
//   children: ReactNode;
//   onSwitchAuth?: () => void;
//   loading?: boolean;
//   loadingText?: string;
//   error?: string | null;
//   success?: string | null;
//   secondsLeft?: number;
//   onResend?: () => void;
// }

// export const bannerItems = [
//   {
//     image: '/auth/Home-Delivery-of-Medicines.png',
//     title: 'Fast & Free Home Delivery',
//     description:
//       'Order genuine medicines and get them delivered to your doorstep safely and quickly.',
//   },
//   {
//     image: '/auth/Health-Related-Queries.png',
//     title: 'Talk to Health Experts',
//     description:
//       'Get reliable medical guidance and prescription assistance from certified professionals.',
//   },
//   {
//     image: '/auth/Helthcare.png',
//     title: 'Your One-Stop Health Partner',
//     description: 'Shop medicines, book lab tests, and manage your health needs — all in one place.',
//   },
//   {
//     image: '/auth/Know-Your-Medicines.png',
//     title: 'Know Your Medicines Better',
//     description:
//       'Understand usage, dosage, and alternatives to make informed healthcare decisions.',
//   },
//   {
//     image: '/auth/Secure-Pharmacy.png',
//     title: '100% Genuine & Trusted Pharmacy',
//     description:
//       'We partner with verified suppliers to ensure every product you buy is authentic and safe.',
//   },
// ];



// const AuthLayout: React.FC<AuthLayoutProps> = ({
//   type,
//   onSubmit,
//   onGoogleLogin,
//   children,
//   onSwitchAuth,
//   loading,
//   loadingText,
//   error,
//   success,
//   secondsLeft,
//   onResend,
// }) => {
//   const { closeAuthModal } = useModal();
//   const router = useRouter();
//   const isLogin = type === 'login';
//   const title = isLogin ? 'Login' : type === 'signup' ? 'Sign Up' : 'Enter OTP';
//   const saveMobile = useAppSelector((state) => state.userProfile.saveMobile);
//   const description = isLogin
//     ? 'Get access to your orders, lab tests & doctor consultations'
//     : type === 'signup'
//       ? 'Please enter your Mobile number to receive One Time Password (OTP)'
//       : `We have sent an OTP on +91${saveMobile}`;
//   function handleBackToHome() {
//     closeAuthModal();
//     router.push('/');

//   }

//   const handleNavigateAndClose = (path: string) => {
//     closeAuthModal();     // close modal
//     router.push(path);    // navigate
//   };


//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {/* Close button for modal */}
//       <button
//         onClick={handleBackToHome}
//         className="absolute top-2 left-2 md:top-4 md:left-4 z-20 p-1 md:p-2 rounded-full bg-gray-100 md:bg-white md:hover:gray-300 hover:bg-gray-200 transition-colors cursor-pointer"
//       >
//         <House className="w-4 h-4 md:w-5 md:h-5" />
//       </button>
//       <button
//         onClick={closeAuthModal}
//         className="absolute top-2 right-2 md:top-4 md:right-4 z-20 p-1 md:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
//       >
//         <X className="w-4 h-4 md:w-5 md:h-5" />
//       </button>

//       <div className="flex flex-col md:flex-row w-full h-full max-h-full overflow-hidden">
//         {/* Carousel Section - Hidden on mobile, visible on desktop */}
//         <div className="hidden md:flex md:w-1/2 border-r border-gray-200 justify-center items-center relative overflow-hidden bg-gray-50">
//           <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
//           <div className="w-full max-w-[480px] flex justify-center py-8">
//             <Carousel
//               items={bannerItems}
//               slidesPerViewDesktop={1}
//               slidesPerViewTablet={1}
//               slidesPerViewMobile={1}
//               spaceBetween={0}
//               autoplay
//               loop
//               showPagination
//               showArrows={false}
//               centeredSlides
//               renderItem={(item) => <AuthSlideCard item={item} />}
//             />
//           </div>
//         </div>

//         {/* Form Section - Centered on both mobile and desktop */}
//         <div className="w-full md:w-1/2 flex flex-col px-4 md:px-8 py-6 md:py-8 bg-white overflow-y-auto justify-center">
//           <div className="w-full max-w-md mx-auto">
//             {/* Title & Description - Reduced bottom margin */}
//             <div className="flex flex-col items-center text-center mb-6 md:mb-8">
//               <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
//                 {title}
//               </h1>
//               {/* <p className="text-gray-500 mt-2 text-sm md:text-base max-w-md">{description}</p> */}
//               {type === 'otp' ? (
//                 <div className="flex items-center gap-2 mt-2">
//                   <p className="text-gray-600 text-sm md:text-base">
//                     OTP sent to <span className="font-semibold">+91 {saveMobile}</span>
//                   </p>
//                   <button className="text-primary font-semibold text-sm hover:underline cursor-pointer">
//                     Change
//                   </button>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 mt-2 text-sm md:text-base max-w-md">{description}</p>
//               )}
//             </div>

//             {/* Inputs + Actions - Reduced spacing */}
//             <div className={`flex flex-col w-full ${type === 'otp' ? 'space-y-4' : 'space-y-4'}`}>
//               {type !== 'otp' && (
//                 <>
//                   <button
//                     onClick={onGoogleLogin}
//                     className="w-full text-sm md:text-base border border-gray-300 text-gray-600 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md cursor-pointer"
//                   >
//                     <FcGoogle className="text-xl" />
//                     Continue with Google
//                   </button>

//                   {/* OR separator - Reduced margin */}
//                   <div className="flex justify-center mt-1">
//                     <p className="text-sm text-gray-400 font-medium">OR</p>
//                   </div>
//                 </>
//               )}

//               {/* Children (Phone input or OTP inputs) */}
//               <div className="flex-1">{children}</div>

//               {/* OTP Timer */}
//               {type === 'otp' && (
//                 <div className="text-center text-sm text-gray-500">
//                   {secondsLeft && secondsLeft > 0 ? (
//                     <p>
//                       Resend OTP in{' '}
//                       <span className="font-semibold text-gray-700">{secondsLeft}s</span>
//                     </p>
//                   ) : (
//                     <button
//                       className="text-primary font-semibold hover:underline"
//                       onClick={onResend}
//                     >
//                       Resend OTP
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* Error / Success Messages */}
//               {(error || success) && (
//                 <p className={`text-center text-sm ${error ? 'text-red-500' : 'text-green-600'}`}>
//                   {error || success}
//                 </p>
//               )}

//               {/* Submit Button */}
//               <button
//                 onClick={onSubmit}
//                 disabled={loading}
//                 className={`w-full py-3 text-base font-semibold rounded-lg text-white flex justify-center items-center gap-2 transition-all shadow-md cursor-pointer ${loading
//                   ? 'bg-primary/70 cursor-not-allowed'
//                   : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
//                   }`}
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       className="animate-spin h-4 w-4 text-white"
//                       // xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                       />
//                     </svg>
//                     <span>{loadingText || 'Processing...'}</span>
//                   </>
//                 ) : (
//                   <span>
//                     {isLogin ? 'Login' : type === 'signup' ? 'Sign Up' : 'Verify & Continue'}
//                   </span>
//                 )}
//               </button>

//               {/* Switch Auth Links - Reduced top margin */}
//               {type !== 'otp' && (
//                 <div className="flex flex-col justify-center items-center mt-4 text-center">
//                   <div className="flex gap-1 font-medium text-sm items-center">
//                     <span className="text-gray-600">
//                       {isLogin ? 'New on DavaBharti?' : 'Have an account?'}
//                     </span>
//                     <button
//                       className="text-primary font-semibold hover:underline"
//                       onClick={onSwitchAuth}
//                     >
//                       {isLogin ? 'Sign Up' : 'Login'}
//                     </button>
//                   </div>
//                   <p className="mt-2 text-xs text-gray-500 leading-relaxed">
//                     By {isLogin ? 'logging in' : 'signing up'}, you agree to our{' '}
//                     <button
//                       onClick={() => handleNavigateAndClose('/terms-condition')}
//                       className="text-primary underline hover:text-primary/80 cursor-pointer"
//                     >
//                       Terms and Conditions
//                     </button>{' '}
//                     &{' '}
//                     <button
//                       onClick={() => handleNavigateAndClose('/privacy-policy')}
//                       className="text-primary underline hover:text-primary/80 cursor-pointer"
//                     >
//                       Privacy Policy
//                     </button>
//                   </p>

//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div >
//     </div >
//   );
// };

// export default AuthLayout;



'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Carousel from '@/components/shared/carousel/Carousel';
import AuthSlideCard from '@/components/shared/card/AuthSlideCard';
import { FcGoogle } from 'react-icons/fc';
import { House, X } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface AuthLayoutProps {
  type: 'login' | 'signup' | 'otp' | 'profile';
  onSubmit: () => void;
  onGoogleLogin: () => void;
  children: ReactNode;
  onSwitchAuth?: () => void;
  loading?: boolean;
  loadingText?: string;
  error?: string | null;
  success?: string | null;
  secondsLeft?: number;
  onResend?: () => void;
  onProfileComplete?: () => void;
  userData?: any;
  onChangeNumber?: () => void;
}

export const bannerItems = [
  {
    image: '/auth/Home-Delivery-of-Medicines.png',
    title: 'Fast & Free Home Delivery',
    description:
      'Order genuine medicines and get them delivered to your doorstep safely and quickly.',
  },
  {
    image: '/auth/Health-Related-Queries.png',
    title: 'Talk to Health Experts',
    description:
      'Get reliable medical guidance and prescription assistance from certified professionals.',
  },
  {
    image: '/auth/Helthcare.png',
    title: 'Your One-Stop Health Partner',
    description: 'Shop medicines, book lab tests, and manage your health needs — all in one place.',
  },
  {
    image: '/auth/Know-Your-Medicines.png',
    title: 'Know Your Medicines Better',
    description:
      'Understand usage, dosage, and alternatives to make informed healthcare decisions.',
  },
  {
    image: '/auth/Secure-Pharmacy.png',
    title: '100% Genuine & Trusted Pharmacy',
    description:
      'We partner with verified suppliers to ensure every product you buy is authentic and safe.',
  },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({
  type,
  onSubmit,
  onGoogleLogin,
  children,
  onSwitchAuth,
  loading,
  loadingText,
  error,
  success,
  secondsLeft,
  onResend,
  onProfileComplete,
  userData,
  onChangeNumber,
}) => {
  const { closeAuthModal } = useModal();
  const router = useRouter();

  const isLogin = type === 'login';
  const isProfile = type === 'profile';

  const title = isLogin ? 'Login' :
    type === 'signup' ? 'Sign Up' :
      type === 'otp' ? 'Enter OTP' :
        'Complete Your Profile';

  const saveMobile = useAppSelector((state) => state.userProfile.saveMobile);

  const description = isLogin
    ? 'Get access to your orders, lab tests & doctor consultations'
    : type === 'signup'
      ? 'Please enter your Mobile number to receive One Time Password (OTP)'
      : type === 'otp'
        ? `We have sent an OTP on +91${saveMobile}`
        : 'Please complete your profile to continue';

  function handleBackToHome() {
    closeAuthModal();
    router.push('/');
  }

  const handleNavigateAndClose = (path: string) => {
    closeAuthModal();
    router.push(path);
  };
  const changeNumberHanlder = () => {

  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Close button for modal */}
      <button
        onClick={handleBackToHome}
        className="absolute top-2 left-2 md:top-4 md:left-4 z-20 p-1 md:p-2 rounded-full bg-gray-100 md:bg-white md:hover:gray-300 hover:bg-gray-200 transition-colors cursor-pointer"
      >
        <House className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <button
        onClick={closeAuthModal}
        className="absolute top-2 right-2 md:top-4 md:right-4 z-20 p-1 md:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      <div className="flex flex-col md:flex-row w-full h-full max-h-full overflow-hidden">
        {/* Carousel Section - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex md:w-1/2 border-r border-gray-200 justify-center items-center relative overflow-hidden bg-gray-50">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
          <div className="w-full max-w-[480px] flex justify-center py-8">
            <Carousel
              items={bannerItems}
              slidesPerViewDesktop={1}
              slidesPerViewTablet={1}
              slidesPerViewMobile={1}
              spaceBetween={0}
              autoplay
              loop
              showPagination
              showArrows={false}
              centeredSlides
              renderItem={(item) => <AuthSlideCard item={item} />}
            />
          </div>
        </div>

        {/* Form Section - Centered on both mobile and desktop */}
        <div className="w-full md:w-1/2 flex flex-col px-4 md:px-8 py-6 md:py-8 bg-white overflow-y-auto justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Title & Description */}
            <div className="flex flex-col items-center text-center mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                {title}
              </h1>
              {type === 'otp' ? (
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-gray-600 text-sm md:text-base">
                    OTP sent to <span className="font-semibold">+91 {saveMobile}</span>
                  </p>
                  <button className="text-primary font-semibold text-sm hover:underline cursor-pointer" onClick={onChangeNumber}>
                    Change
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 mt-2 text-sm md:text-base max-w-md">{description}</p>
              )}
            </div>

            {/* Inputs + Actions */}
            <div className={`flex flex-col w-full ${type === 'profile' ? 'space-y-4' : 'space-y-4'}`} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
              }
            }}>
              {/* Google Login - Only show for phone stage */}
              {type === 'login' || type === 'signup' ? (
                <>
                  <button
                    onClick={onGoogleLogin}
                    className="w-full text-sm md:text-base border border-gray-300 text-gray-600 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <FcGoogle className="text-xl" />
                    Continue with Google
                  </button>

                  {/* OR separator */}
                  <div className="flex justify-center mt-1">
                    <p className="text-sm text-gray-400 font-medium">OR</p>
                  </div>
                </>
              ) : null}

              {/* Children (Phone input, OTP inputs, or Profile form) */}
              <div className="flex-1">{children}</div>

              {/* OTP Timer - Only for OTP stage */}
              {type === 'otp' && (
                <div className="text-center text-sm text-gray-500">
                  {secondsLeft && secondsLeft > 0 ? (
                    <p>
                      Resend OTP in{' '}
                      <span className="font-semibold text-gray-700">{secondsLeft}s</span>
                    </p>
                  ) : (
                    <button
                      className="text-primary font-semibold hover:underline"
                      onClick={onResend}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}

              {/* Error / Success Messages */}
              {(error || success) && (
                <p className={`text-center text-sm ${error ? 'text-red-500' : 'text-green-600'}`}>
                  {error || success}
                </p>
              )}

              {/* Submit Button */}
              {type !== 'profile' && (
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className={`w-full py-3 text-base font-semibold rounded-lg text-white flex justify-center items-center gap-2 transition-all shadow-md cursor-pointer ${loading
                      ? 'bg-primary/70 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
                    }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      <span>{loadingText || 'Processing...'}</span>
                    </>
                  ) : (
                    <span>
                      {isLogin ? 'Login' :
                        type === 'signup' ? 'Sign Up' :
                          'Verify & Continue'}
                    </span>
                  )}
                </button>
              )}

              {/* Switch Auth Links - Only for phone stage */}
              {(type === 'login' || type === 'signup') && (
                <div className="flex flex-col justify-center items-center mt-4 text-center">
                  <div className="flex gap-1 font-medium text-sm items-center">
                    <span className="text-gray-600">
                      {isLogin ? 'New on DavaBharti?' : 'Have an account?'}
                    </span>
                    <button
                      className="text-primary font-semibold hover:underline"
                      onClick={onSwitchAuth}
                    >
                      {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                    By {isLogin ? 'logging in' : 'signing up'}, you agree to our{' '}
                    <button
                      onClick={() => handleNavigateAndClose('/terms-condition')}
                      className="text-primary underline hover:text-primary/80 cursor-pointer"
                    >
                      Terms and Conditions
                    </button>{' '}
                    &{' '}
                    <button
                      onClick={() => handleNavigateAndClose('/privacy-policy')}
                      className="text-primary underline hover:text-primary/80 cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
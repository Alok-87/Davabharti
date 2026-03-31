
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useModal } from '@/context/ModalContext';
// import { setToken, getToken, clearToken } from '@/features/auth/utils/tokenManager';
// import { useAuth } from '@/features/auth/hook/useAuth';
// import { useAppDispatch } from '@/store/hooks';
// import { fetchUserProfile } from '@/features/user-profile/userProfileThunks';
// import { toast } from 'sonner';

// export default function GoogleCallback() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { openAuthModal, closeAuthModal } = useModal();
//   const { restore } = useAuth();
//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const handleGoogleCallback = async () => {
//       const token = searchParams.get('token');
//       const userDataParam = searchParams.get('user');
//       const error = searchParams.get('error');

//       if (error) {
//         setError(error);
//         toast.error('Google authentication failed');
//         openAuthModal('login');
//         setLoading(false);
//         return;
//       }

//       if (!token) {
//         setError('Invalid or missing Google login token');
//         toast.error('Invalid or missing Google login token');
//         openAuthModal('login');
//         setLoading(false);
//         return;
//       }

//       try {
//         // ✅ Save token to localStorage + axios headers
//         setToken(token);

//         let userData;
//         try {
//           userData = userDataParam ? JSON.parse(decodeURIComponent(userDataParam)) : {};
//         } catch {
//           userData = {};
//         }

//         // ✅ Restore session in Auth context
//         await restore();

//         // Check if profile needs completion
//         const needsProfileCompletion = userData?.is_profile_complete === false;

//         if (needsProfileCompletion) {
//           // Store user data for profile completion
//           localStorage.setItem('pendingGoogleUser', JSON.stringify({
//             token,
//             userData,
//             email: userData.email,
//             name: userData.name
//           }));
          
//           // Open signup modal for profile completion
//           openAuthModal('signup');
//           toast.info('Please complete your profile to continue');
//         } else {
//           // ✅ Fetch user profile and store in Redux
//           await dispatch(fetchUserProfile()).unwrap();
          
//           toast.success('Google login successful!');
//           closeAuthModal();
          
//           // Redirect to home or intended page
//           setTimeout(() => {
//             router.push('/');
//           }, 100);
//         }

//       } catch (err: any) {
//         console.error('Google callback error:', err);
//         const errorMessage = err?.message || 'Something went wrong while finalizing login';
//         setError(errorMessage);
//         toast.error(errorMessage);
//         clearToken();
//         openAuthModal('login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     handleGoogleCallback();
//   }, [searchParams, router, restore, dispatch, openAuthModal, closeAuthModal]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-gray-600">Completing Google authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">Error: {error}</p>
//           <button 
//             onClick={() => {
//               openAuthModal('login');
//               router.push('/');
//             }}
//             className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
//           >
//             Return to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useAppDispatch } from '@/store/hooks';
// import { setToken, clearToken } from '@/features/auth/utils/tokenManager';
// import { fetchUserProfile } from '@/features/user-profile/userProfileThunks';

// export default function GoogleCallbackPage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const searchParams = useSearchParams();
//   const [status, setStatus] = useState<'processing' | 'redirecting' | 'error'>('processing');

//   useEffect(() => {
//     const handleGoogleCallback = async () => {
//       const token = searchParams.get('token');

//       if (!token) {
//         console.error('No token found in Google callback URL');
//         setStatus('error');
//         setTimeout(() => router.push('/'), 2000);
//         return;
//       }

//       try {
//         // Save the token first
//         setToken(token);

//         // Fetch user profile using the new token
//         const profile = await dispatch(fetchUserProfile()).unwrap();

//         // ✅ Case 1: Profile exists and has phone_number → complete login
//         if (profile && profile.phone_number) {
//           localStorage.removeItem('pendingGoogleUser');
//           setStatus('redirecting');
//           // Use hard redirect for complete login
//           window.location.href = '/';
//         } 
//         // ✅ Case 2: Profile exists but missing phone → needs signup form
//         else {
//           localStorage.setItem(
//             'pendingGoogleUser',
//             JSON.stringify({ token, userData: profile })
//           );
//           setStatus('redirecting');
//           // Use hard redirect to avoid hydration issues
//           window.location.href = '/?openAuthModal=signup';
//         }
//       } catch (error) {
//         // ✅ Case 3: Profile fetch failed (likely new Google user)
//         console.error('Profile fetch failed after Google login:', error);
//         clearToken();
//         localStorage.setItem('pendingGoogleUser', JSON.stringify({ token }));
//         setStatus('redirecting');
//         // Use hard redirect to avoid hydration issues
//         window.location.href = '/?openAuthModal=signup';
//       }
//     };

//     handleGoogleCallback();
//   }, [dispatch, router, searchParams]);

//   return (
//     <div className="flex h-screen items-center justify-center">
//       <div className="text-center">
//         {status === 'processing' && (
//           <>
//             <p className="text-gray-600 text-lg mb-4">
//               Connecting your Google account...
//             </p>
//             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
//           </>
//         )}
        
//         {status === 'redirecting' && (
//           <>
//             <p className="text-gray-600 text-lg mb-4">
//               Success! Redirecting you...
//             </p>
//             <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           </>
//         )}
        
//         {status === 'error' && (
//           <>
//             <p className="text-red-600 text-lg mb-4">
//               Authentication failed. Redirecting to home page...
//             </p>
//             <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setToken, clearToken } from '@/features/auth/utils/tokenManager';
import { fetchUserProfile } from '@/features/user-profile/userProfileThunks';
import { setUser } from '@/features/auth/authSlice';
import { User } from '@/features/auth/types';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'redirecting' | 'error'>('processing');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const token = searchParams.get('token');

      if (!token) {
        console.error('No token found in Google callback URL');
        setStatus('error');
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      try {
        // Save the token first
        setToken(token);

        // Fetch user profile using the new token
        const profile = await dispatch(fetchUserProfile()).unwrap();
       // Map UserProfile to User type
const user: User = {
  id: profile.id ?? '', // provide fallback if undefined
  name: profile.name,
  email: profile.email,
  phone_number: profile.phone_number ?? '',
  dob: profile.dob,
  gender: profile.gender,
 
};

dispatch(setUser(user)) 
        // ✅ Case 1: Profile exists and has phone_number → complete login
        if (profile && profile.phone_number) {
          setStatus('redirecting');
          router.push('/'); // redirect to homepage
        } 
        // ✅ Case 2: Profile exists but missing phone → redirect to /user
        else {
          setStatus('redirecting');
          router.push('/user'); // redirect to user profile page
          console.error('Profile fetch success after Google login:', profile);
        }
      } catch (error) {
        // ✅ Case 3: Profile fetch failed (likely new Google user)
        console.error('Profile fetch failed after Google login:', error);
        clearToken();
        setStatus('redirecting');
        router.push('/user'); // redirect to user profile page
      }
    };

    handleGoogleCallback();
  }, [dispatch, router, searchParams]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <p className="text-gray-600 text-lg mb-4">
              Connecting your Google account...
            </p>
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </>
        )}
        
        {status === 'redirecting' && (
          <>
            <p className="text-gray-600 text-lg mb-4">
              Success! Redirecting you...
            </p>
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <p className="text-red-600 text-lg mb-4">
              Authentication failed. Redirecting to home page...
            </p>
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </>
        )}
      </div>
    </div>
  );
}
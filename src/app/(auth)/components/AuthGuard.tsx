'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, clearToken } from '@/features/auth/utils/tokenManager';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile } from '@/features/user-profile/userProfileThunks';
import { useAuthModal } from '@/hooks/useAuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { openLogin } = useAuthModal();
  const { user, loading } = useAppSelector((state) => state.userProfile);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      // 1️⃣ No token → show login modal
      if (!token) {
        console.log('No token found → opening login modal');
        openLogin(window.location.pathname);
        setCheckingAuth(false);
        return;
      }

      

      // 2️⃣ Token exists → user is considered authenticated
      // Fetch profile if not already loaded
      if (!user) {
        try {
          console.log('Token found → fetching user profile...');
          await dispatch(fetchUserProfile()).unwrap();
          console.log('User profile fetched successfully');
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // ⚠️ Instead of forcing logout, just allow access since token exists
          // Optionally, you can clear the token if it's invalid:
          // clearToken();
          // openLogin(window.location.pathname);
        }
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [dispatch, user, openLogin]);

  const isLoading = checkingAuth || loading;

  // 3️⃣ Only show loader when verifying token (initial check)
  if (checkingAuth) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg font-medium mb-4">
            Checking authentication...
          </p>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // 4️⃣ If token exists, but profile fetch fails → still allow access
  return <>{children}</>;
};

export default AuthGuard;


// 'use client';
// import { useEffect, useState } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { getToken } from '@/features/auth/utils/tokenManager';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchUserProfile } from '@/features/user-profile/userProfileThunks';
// import { useAuthModal } from '@/hooks/useAuthModal';
// import ProfileAlertDialog from '@/components/shared/alert/ProfileAlert';

// interface AuthGuardProps {
//   children: React.ReactNode;
// }

// const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const dispatch = useAppDispatch();
//   const { openLogin } = useAuthModal();
//   const { user, loading } = useAppSelector((state) => state.userProfile);

//   const [checkingAuth, setCheckingAuth] = useState(true);
//   const [showProfileDialog, setShowProfileDialog] = useState(false);

//   // 1️⃣ On first mount, check auth + fetch user
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = getToken();

//       // No token → login modal
//       if (!token) {
//         openLogin(window.location.pathname);
//         setCheckingAuth(false);
//         return;
//       }

//       try {
//         // Fetch user if not loaded
//         if (!user) {
//           await dispatch(fetchUserProfile()).unwrap();
//         }
//       } catch (err) {
//         console.error('Failed to fetch user profile:', err);
//       } finally {
//         // ✅ Always clear loader
//         setCheckingAuth(false);
//       }
//     };

//     checkAuth();
//     // ✅ Run only once on mount
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // 2️⃣ After profile is fetched, check completeness
//   useEffect(() => {
//     if (!checkingAuth && user) {
//       // ✅ Allow /user route even if profile incomplete
//       if (!user.is_profile_complete && pathname !== '/user') {
//         setShowProfileDialog(true);
//       }
//     }
//   }, [checkingAuth, user, pathname]);

//   // 3️⃣ Show loader only during initial verification
//   if (checkingAuth || loading) {
//     return (
//       <div className="h-screen flex justify-center items-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-gray-600 text-lg font-medium mb-4">
//             Checking authentication...
//           </p>
//           <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
//         </div>
//       </div>
//     );
//   }

//   // 4️⃣ Show profile alert dialog if needed
//   if (showProfileDialog) {
//     return (
//       <ProfileAlertDialog
//         open={showProfileDialog}
//         onClose={() => {
//           setShowProfileDialog(false);
//           router.push('/user'); // ✅ redirect incomplete users
//         }}
//       />
//     );
//   }

//   // 5️⃣ Otherwise show protected children
//   return <>{children}</>;
// };

// export default AuthGuard;

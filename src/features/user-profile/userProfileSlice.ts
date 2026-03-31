// import { createSlice } from '@reduxjs/toolkit';
// import {
//   fetchUserProfile,
//   updateUserProfile,
//   createAddress,
//   updateAddress,
// } from './userProfileThunks';
// import type { UserProfile, Address } from './types';

// interface UserProfileState {
//   user?: UserProfile | null;
//   loading: boolean;
//   error?: string;
//   successMessage?: string;
// }

// const initialState: UserProfileState = {
//   user: null,
//   loading: false,
//   error: undefined,
//   successMessage: undefined,
// };

// const userProfileSlice = createSlice({
//   name: 'userProfile',
//   initialState,
//   reducers: {
//     clearUserProfile: (state) => {
//       state.user = null;
//       state.error = undefined;
//       state.successMessage = undefined;
//     },
//     clearError: (state) => {
//       state.error = undefined;
//     },
//     clearSuccess: (state) => {
//       state.successMessage = undefined;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ✅ Fetch profile
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = undefined;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? 'Failed to load profile';
//       })

//       // ✅ Update profile
//       .addCase(updateUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = undefined;
//         state.successMessage = undefined;
//       })
//       .addCase(updateUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.successMessage = 'User profile updated successfully';
//       })
//       .addCase(updateUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? 'Failed to update profile';
//       })

//       // ✅ Create address
//       .addCase(createAddress.pending, (state) => {
//         state.loading = true;
//         state.error = undefined;
//       })
//       .addCase(createAddress.fulfilled, (state, action) => {
//         state.loading = false;
//         if (state.user) {
//           state.user.addresses = [...state.user.addresses, action.payload];
//         }
//         state.successMessage = 'Address created successfully';
//       })
//       .addCase(createAddress.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? 'Failed to create address';
//       })

//       // ✅ Update address
//       .addCase(updateAddress.pending, (state) => {
//         state.loading = true;
//         state.error = undefined;
//       })
//       .addCase(updateAddress.fulfilled, (state, action) => {
//         state.loading = false;
//         if (state.user?.addresses) {
//           const index = state.user.addresses.findIndex(
//             (addr) => addr.id === action.payload.id
//           );
//           if (index !== -1) {
//             state.user.addresses[index] = action.payload;
//           }
//         }
//         state.successMessage = 'Address updated successfully';
//       })
//       .addCase(updateAddress.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? 'Failed to update address';
//       });
//   },
// });

// export const { clearUserProfile, clearError, clearSuccess } = userProfileSlice.actions;
// export default userProfileSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';
// import {
//   fetchUserProfile,
//   updateUserProfile,
//   createAddress,
//   updateAddress,
//   fetchFamilyMembers,
//   createFamilyMember,
//   updateFamilyMember,
//   deleteFamilyMember,
//   fetchPrescriptions,
// } from './userProfileThunks';
// import type { UserProfile, Address, FamilyMember, Prescription } from './types';

// interface UserProfileState {
//   user?: UserProfile | null;
//   familyMembers: FamilyMember[];
//   prescriptions: Prescription[];
//   loading: boolean;
//   error?: string;
//   successMessage?: string;
// }

// const initialState: UserProfileState = {
//   user: null,
//   familyMembers: [],
//   prescriptions: [],
//   loading: false,
// };

// const userProfileSlice = createSlice({
//   name: 'userProfile',
//   initialState,
//   reducers: {
//     clearUserProfile: (state) => {
//       state.user = null;
//       state.familyMembers = [];
//       state.prescriptions = [];
//       state.error = undefined;
//       state.successMessage = undefined;
//     },
//     clearError: (state) => {
//       state.error = undefined;
//     },
//     clearSuccess: (state) => {
//       state.successMessage = undefined;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ✅ Profile
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ Address
//       .addCase(createAddress.fulfilled, (state, action) => {
//         if (state.user) state.user.addresses.push(action.payload);
//         state.successMessage = 'Address created successfully';
//       })
//       .addCase(updateAddress.fulfilled, (state, action) => {
//         const idx = state.user?.addresses.findIndex(a => a.id === action.payload.id);
//         if (idx !== undefined && idx >= 0 && state.user)
//           state.user.addresses[idx] = action.payload;
//         state.successMessage = 'Address updated successfully';
//       })

//       // ✅ Family Members
//       .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
//         state.familyMembers = action.payload;
//       })
//       .addCase(createFamilyMember.fulfilled, (state, action) => {
//         state.familyMembers.push(action.payload);
//         state.successMessage = 'Family member added';
//       })
//       .addCase(updateFamilyMember.fulfilled, (state, action) => {
//         const idx = state.familyMembers.findIndex(m => m.id === action.payload.id);
//         if (idx !== -1) state.familyMembers[idx] = action.payload;
//         state.successMessage = 'Family member updated';
//       })
//       .addCase(deleteFamilyMember.fulfilled, (state, action) => {
//         state.familyMembers = state.familyMembers.filter(m => m.id !== action.meta.arg);
//         state.successMessage = 'Family member deleted';
//       })

//       // ✅ Prescriptions
//       .addCase(fetchPrescriptions.fulfilled, (state, action) => {
//         state.prescriptions = action.payload;
//       });
//   },
// });

// export const { clearUserProfile, clearError, clearSuccess } = userProfileSlice.actions;
// export default userProfileSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchUserProfile,
  updateUserProfile,
  createAddress,
  updateAddress,
  fetchFamilyMembers,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  fetchPrescriptions,
  deleteAddress,
  deletePrescriptionById,
  fetchCustomerWallet,
  fetchCustomerWalletLedger,
  fetchWalletSetting,
  fetchMyReferral,
} from './userProfileThunks';
import {
  UserProfile,
  Address,
  FamilyMember,
  Prescription,
  Wallet,
  WalletSetting,
  MyReferral,
  WalletLedgerListResult,
} from './types';
import { Toast } from '@/components/ui/toast';

interface UserProfileState {
  user?: UserProfile | null;
  wallet: Wallet | null;
  walletLedgerListResult: WalletLedgerListResult | null;
  walletSetting: WalletSetting | null;
  myReferral: MyReferral[];
  familyMembers: FamilyMember[];
  prescriptions: Prescription[];
  selectedAddressForOrder: Address | null;
  selectedFamilyMemberForOrder: string[];
  showPatientForm: boolean;
  showReqMedicineModal: boolean;
  showSidebarOpen: boolean;
  saveMobile: string | null;
  showOfferModal: boolean;
  editingPatient: any | null;
  isRemarkOpen: boolean;
  isEditing: boolean;
  showReturnDrawer: boolean;
  showTermsAndConditions: string | null;
  loading: boolean;
  error?: string;
  successMessage?: string;
  lat: number;
  lng: number;
  address?: string | null;
  showAppointmentModal: boolean;
}

const initialState: UserProfileState = {
  user: null,
  familyMembers: [],
  prescriptions: [],
  wallet: null,
  walletSetting: null,
  walletLedgerListResult: null,
  myReferral: [],
  selectedAddressForOrder: null,
  selectedFamilyMemberForOrder: [],
  showPatientForm: false,
  saveMobile: null,
  showReqMedicineModal: false,
  showSidebarOpen: false,
  showOfferModal: false,
  isRemarkOpen: false,
  editingPatient: null,
  isEditing: false,
  showReturnDrawer: false,
  showTermsAndConditions: null,
  loading: false,
  lat: 0,
  lng: 0,
  address: null,
  showAppointmentModal: false,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.user = null;
      state.familyMembers = [];
      state.prescriptions = [];
      state.selectedAddressForOrder = null;
      state.error = undefined;
      state.successMessage = undefined;
    },
    clearError: (state) => {
      state.error = undefined;
    },
    clearSuccess: (state) => {
      state.successMessage = undefined;
    },
    setSelectedAddressForOrder: (state, action) => {
      state.selectedAddressForOrder = action.payload;
    },
    setSelectedFamilyMemberForOrder: (state, action) => {
      state.selectedFamilyMemberForOrder = action.payload;
    },
    setShowPatientForm: (state, action) => {
      state.showPatientForm = action.payload; // 👈 boolean true/false
    },
    togglePatientForm: (state) => {
      state.showPatientForm = !state.showPatientForm; // 👈 quick toggle
    },
    setShowReqMedicineModal: (state, action) => {
      state.showReqMedicineModal = action.payload; // 👈 boolean true/false
    },
    setShowSidebarOpen: (state, action) => {
      state.showSidebarOpen = action.payload; // 👈 boolean true/false
    },
    setShowOfferModal: (state, action) => {
      state.showOfferModal = action.payload; // 👈 boolean true/false
    },
    setSaveMobile: (state, action) => {
      state.saveMobile = action.payload;
    },
    clearSelectedAddressForOrder: (state) => {
      state.selectedAddressForOrder = null;
    },
    clearSelectedFamilyMemberForOrder: (state) => {
      state.selectedFamilyMemberForOrder = [];
    },
    setEditingPatient: (state, action: PayloadAction<any>) => {
      state.editingPatient = action.payload;
      state.isEditing = true;
    },
    clearEditingPatient: (state) => {
      state.editingPatient = null;
      state.isEditing = false;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setIsRemarkOpen: (state, action) => {
      state.isRemarkOpen = action.payload;
    },
    setShowReturnDrawer: (state, action) => {
      state.showReturnDrawer = action.payload;
    },
    setShowTermsAndConditions: (state, action) => {
      state.showTermsAndConditions = action.payload;
    },
    setLat: (state, action) => {
      state.lat = action.payload; // 👈 boolean true/false
    },
    setLng: (state, action) => {
      state.lng = action.payload; // 👈 boolean true/false
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setShowAppointmentModal: (state, action) => {
      state.showAppointmentModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload.addresses && action.payload.addresses.length > 0) {
          const defaultAddress = action.payload.addresses.find((addr) => addr.is_default);
          state.selectedAddressForOrder = defaultAddress || action.payload.addresses[0];
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load profile';
        Toast('Failed to load profile');
      })
      .addCase(fetchFamilyMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.familyMembers = action.payload ?? []; // ✅ finally sets your patient list
      })
      .addCase(fetchFamilyMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch family members';
      })

      // ✅ Update User Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = 'User profile updated successfully';
        Toast('Profile updated successfully');
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;

        // ✅ Smart error extraction
        const payload = action.payload as any;
        const backendMessage = payload;
        state.error = backendMessage;
        Toast(backendMessage);
      })

      // ✅ Create Address
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) state.user.addresses.push(action.payload);
        state.successMessage = 'Address created successfully';
        Toast('Address added successfully');
        if (state.user && state.user.addresses.length === 1) {
          state.selectedAddressForOrder = action.payload;
        }
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create address';
        Toast('Failed to add address');
      })

      // ✅ Update Address
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.user?.addresses.findIndex((a) => a.id === action.payload.id);
        if (idx !== undefined && idx >= 0 && state.user) state.user.addresses[idx] = action.payload;
        state.successMessage = 'Address updated successfully';
        Toast('Address updated successfully');
        if (state.selectedAddressForOrder?.id === action.payload.id) {
          state.selectedAddressForOrder = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update address';
        Toast('Failed to update address');
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (state.user?.addresses) {
          state.user.addresses = state.user.addresses.filter(
            (address) => address.id !== action.payload
          );

          // If the deleted address was the selected one, select another address or clear
          if (action.payload === state.selectedAddressForOrder?.id) {
            const remainingAddresses = state.user.addresses;
            if (remainingAddresses.length > 0) {
              // Select the first available address
              state.selectedAddressForOrder = remainingAddresses[0];
            } else {
              // No addresses left, clear selection
              state.selectedAddressForOrder = null;
            }
          }
        }
        Toast('Address deleted successfully');
      })

      // ✅ Create Family Member
      .addCase(createFamilyMember.fulfilled, (state, action) => {
        state.loading = false;
        state.familyMembers.push(action.payload);
        state.successMessage = 'Patient added successfully';
        Toast('Patient added successfully');
      })
      .addCase(createFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create Patient';
        Toast('Failed to add Patient');
      })

      // ✅ Update Family Member
      .addCase(updateFamilyMember.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.familyMembers.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.familyMembers[idx] = action.payload;
        state.successMessage = 'Patient updated successfully';
        Toast('Patient updated successfully');
      })
      .addCase(updateFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update Patient';
        Toast('Failed to update Patient');
      })

      // ✅ Delete Family Member
      .addCase(deleteFamilyMember.fulfilled, (state, action) => {
        state.loading = false;
        const deletedMemberId = action.meta.arg;

        state.familyMembers = state.familyMembers.filter((m) => m.id !== deletedMemberId);

        // Clear from selectedFamilyMemberForOrder if it was selected
        state.selectedFamilyMemberForOrder = state.selectedFamilyMemberForOrder.filter(
          (id) => id !== deletedMemberId
        );

        state.successMessage = 'Patient deleted successfully';
        Toast('Patient deleted successfully');
      })
      .addCase(deleteFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to delete Patient';
        Toast('Failed to delete Patient');
      })

      // ✅ Fetch Prescriptions
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch prescriptions';
        Toast('Failed to fetch prescriptions');
      })
      .addCase(deletePrescriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = state.prescriptions.filter((pre) => pre.id !== action.payload);
      })
      .addCase(deletePrescriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to delete prescriptions';
        Toast('Failed to delete prescriptions');
      }) // ✅ Fetch Customer Wallet
      .addCase(fetchCustomerWallet.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCustomerWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchCustomerWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch wallet';
      })
      .addCase(fetchCustomerWalletLedger.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCustomerWalletLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.walletLedgerListResult = action.payload;
      })
      .addCase(fetchCustomerWalletLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch wallet Ledger';
      })
      .addCase(fetchWalletSetting.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchWalletSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.walletSetting = action.payload;
      })
      .addCase(fetchWalletSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) ?? 'Failed to fetch wallet Setting';
      })
      .addCase(fetchMyReferral.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchMyReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.myReferral = action.payload;
      })
      .addCase(fetchMyReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch my wallet';
      });
  },
});

export const {
  clearUserProfile,
  clearError,
  clearSuccess,
  setSelectedAddressForOrder,
  setSelectedFamilyMemberForOrder,
  clearSelectedAddressForOrder,
  clearSelectedFamilyMemberForOrder,
  setShowPatientForm,
  setShowReqMedicineModal,
  setShowSidebarOpen,
  togglePatientForm,
  setSaveMobile,
  setEditingPatient,
  clearEditingPatient,
  setIsEditing,
  setIsRemarkOpen,
  setShowReturnDrawer,
  setShowOfferModal,
  setShowTermsAndConditions,
  setLat,
  setLng,
  setAddress,
  setShowAppointmentModal,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;

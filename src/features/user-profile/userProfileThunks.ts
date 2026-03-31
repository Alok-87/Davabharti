// import { createAsyncThunk } from '@reduxjs/toolkit';
// import {
//   fetchUserProfileApi,
//   updateUserProfileApi,
//   createAddressApi,
//   updateAddressApi,
// } from './userProfileApi';
// import type {
//   UserProfile,
//   UpdateUserProfilePayload,
//   Address,
//   CreateAddressPayload,
// } from './types';

// // ✅ Fetch user profile
// export const fetchUserProfile = createAsyncThunk<
//   UserProfile,
//   void,
//   { rejectValue: string }
// >('userProfile/fetchUserProfile', async (_, thunkAPI) => {
//   try {
//     return await fetchUserProfileApi();
//   } catch (err: any) {
//     const message =
//       err?.response?.data?.message ?? err?.message ?? 'Failed to fetch user profile';
//     return thunkAPI.rejectWithValue(message);
//   }
// });

// // ✅ Update user profile
// export const updateUserProfile = createAsyncThunk<
//   UserProfile,
//   UpdateUserProfilePayload,
//   { rejectValue: string }
// >('userProfile/updateUserProfile', async (payload, thunkAPI) => {
//   try {
//     return await updateUserProfileApi(payload);
//   } catch (err: any) {
//     const message =
//       err?.response?.data?.message ?? err?.message ?? 'Failed to update user profile';
//     return thunkAPI.rejectWithValue(message);
//   }
// });

// // ✅ Create address
// export const createAddress = createAsyncThunk<
//   Address,
//   CreateAddressPayload,
//   { rejectValue: string }
// >('userProfile/createAddress', async (payload, thunkAPI) => {
//   try {
//     return await createAddressApi(payload);
//   } catch (err: any) {
//     const message =
//       err?.response?.data?.message ?? err?.message ?? 'Failed to create address';
//     return thunkAPI.rejectWithValue(message);
//   }
// });

// // ✅ Update address
// export const updateAddress = createAsyncThunk<
//   Address,
//   { id: string; payload: CreateAddressPayload },
//   { rejectValue: string }
// >('userProfile/updateAddress', async ({ id, payload }, thunkAPI) => {
//   try {
//     return await updateAddressApi(id, payload);
//   } catch (err: any) {
//     const message =
//       err?.response?.data?.message ?? err?.message ?? 'Failed to update address';
//     return thunkAPI.rejectWithValue(message);
//   }
// });

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUserProfileApi,
  updateUserProfileApi,
  createAddressApi,
  updateAddressApi,
  fetchFamilyMembersApi,
  createFamilyMemberApi,
  updateFamilyMemberApi,
  deleteFamilyMemberApi,
  fetchPrescriptionsApi,
  deleteAddressApi,
  deletePrescriptionByIdApi,
  fetchCustomerWalletApi,
  fetchCustomerWalletLedgerApi,
  fetchWalletSettingApi,
  fetchMyReferralApi,
  WalletLedgerParams,
} from './userProfileApi';
import type {
  UserProfile,
  UpdateUserProfilePayload,
  Address,
  CreateAddressPayload,
  FamilyMember,
  CreateFamilyMemberPayload,
  Prescription,
  Wallet,
  WalletLedger,
  WalletSetting,
  MyReferral,
  WalletLedgerListResult,
} from './types';

// ✅ Fetch user profile
// export const fetchUserProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
//   'userProfile/fetchUserProfile',
//   async (_, thunkAPI) => {
//     try {
//       return await fetchUserProfileApi();
//     } catch (err: any) {
//
//       const message = err?.response?.data?.message ?? 'Failed to fetch user profile';
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );
// after "profile upload failed"
export const fetchUserProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  'userProfile/fetchUserProfile',
  async (_, thunkAPI) => {
    try {
      return await fetchUserProfileApi();
    } catch (err: any) {
      // Don't throw for 404 or profile not found - user might need to complete profile
      if (err?.response?.status === 404) {
        return thunkAPI.rejectWithValue('Profile not found. Please complete your profile.');
      }

      const message = err?.response?.data?.message ?? 'Failed to fetch user profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ Update user profile
export const updateUserProfile = createAsyncThunk<
  UserProfile,
  UpdateUserProfilePayload,
  { rejectValue: string }
>('userProfile/updateUserProfile', async (payload, thunkAPI) => {
  try {
    return await updateUserProfileApi(payload);
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to update user profile';
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ Address
export const createAddress = createAsyncThunk<
  Address,
  CreateAddressPayload,
  { rejectValue: string }
>('userProfile/createAddress', async (payload, thunkAPI) => {
  try {
    return await createAddressApi(payload);
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to create address';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateAddress = createAsyncThunk<
  Address,
  { id: string; payload: CreateAddressPayload },
  { rejectValue: string }
>('userProfile/updateAddress', async ({ id, payload }, thunkAPI) => {
  try {
    return await updateAddressApi(id, payload);
  } catch (err: any) {
    const message = err?.response?.data?.message ?? 'Failed to update address';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteAddress = createAsyncThunk<string, string, { rejectValue: string }>(
  'userProfile/deleteAddress',
  async (id, thunkAPI) => {
    try {
      await deleteAddressApi(id);
      return id; // Return ID so slice can remove it from state
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message ?? 'Failed to delete address');
    }
  }
);

// ✅ Family Members
export const fetchFamilyMembers = createAsyncThunk<FamilyMember[], void, { rejectValue: string }>(
  'userProfile/fetchFamilyMembers',
  async (_, thunkAPI) => {
    try {
      return await fetchFamilyMembersApi();
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch family members');
    }
  }
);

export const createFamilyMember = createAsyncThunk<
  FamilyMember,
  CreateFamilyMemberPayload,
  { rejectValue: string }
>('userProfile/createFamilyMember', async (payload, thunkAPI) => {
  try {
    return await createFamilyMemberApi(payload);
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Failed to create family member');
  }
});

export const updateFamilyMember = createAsyncThunk<
  FamilyMember,
  { id: string; payload: CreateFamilyMemberPayload },
  { rejectValue: string }
>('userProfile/updateFamilyMember', async ({ id, payload }, thunkAPI) => {
  try {
    return await updateFamilyMemberApi(id, payload);
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Failed to update family member');
  }
});

export const deleteFamilyMember = createAsyncThunk<string, string, { rejectValue: string }>(
  'userProfile/deleteFamilyMember',
  async (id, thunkAPI) => {
    try {
      return await deleteFamilyMemberApi(id);
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to delete family member');
    }
  }
);

// ✅ Prescriptions
export const fetchPrescriptions = createAsyncThunk<Prescription[], void, { rejectValue: string }>(
  'userProfile/fetchPrescriptions',
  async (_, thunkAPI) => {
    try {
      return await fetchPrescriptionsApi();
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch prescriptions');
    }
  }
);
export const deletePrescriptionById = createAsyncThunk<string, string, { rejectValue: string }>(
  'userProfile/deletePrescriptionById',
  async (id: string, thunkAPI) => {
    try {
      return await deletePrescriptionByIdApi(id);
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch prescriptions');
    }
  }
);

export const fetchCustomerWallet = createAsyncThunk<
  Wallet,               // Returned data type
  void,                 // No argument
  { rejectValue: string }
>(
  'userProfile/fetchCustomerWallet',
  async (_, thunkAPI) => {
    try {
      return await fetchCustomerWalletApi(); // The API function you added earlier
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch wallet');
    }
  }
);

export const fetchCustomerWalletLedger = createAsyncThunk<
  WalletLedgerListResult,        // ✅ correct return type (ARRAY)
  WalletLedgerParams,
  { rejectValue: string }
>(
  "userProfile/fetchCustomerWalletLedger",
  async (params, thunkAPI) => {
    try {
      return await fetchCustomerWalletLedgerApi(params); // ✅ correct function
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to fetch wallet ledger");
    }
  }
);
export const fetchWalletSetting = createAsyncThunk<
  WalletSetting,        // ✅ correct return type (ARRAY)
  void,
  { rejectValue: string }
>(
  "userProfile/fetchWalletSetting",
  async (_, thunkAPI) => {
    try {
      return await fetchWalletSettingApi(); // ✅ correct function
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to fetch wallet ledger");
    }
  }
);

export const fetchMyReferral = createAsyncThunk<
  MyReferral[],        // ✅ correct return type (ARRAY)
  void,
  { rejectValue: string }
>(
  "userProfile/fetchMyReferral",
  async (_, thunkAPI) => {
    try {
      return await fetchMyReferralApi(); // ✅ correct function
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Failed to fetch my wallet");
    }
  }
);

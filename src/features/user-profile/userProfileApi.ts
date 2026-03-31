// import api from '@/lib/axios';
// import { ENDPOINTS } from '@/constants/endpoints';
// import type {
//   UserProfileResponse,
//   UserProfile,
//   UpdateUserProfilePayload,
//   AddressResponse,
//   CreateAddressPayload,
//   Address,
// } from './types';

// // ✅ Fetch user profile
// export const fetchUserProfileApi = async (): Promise<UserProfile> => {
//   const { data } = await api.get<UserProfileResponse>(ENDPOINTS.CUSTOMER.PROFILE);
//   return data.data.user;
// };

// // ✅ Update user profile
// export const updateUserProfileApi = async (
//   payload: UpdateUserProfilePayload
// ): Promise<UserProfile> => {
//   const { data } = await api.patch<UserProfileResponse>(
//     ENDPOINTS.CUSTOMER.PROFILE,
//     payload
//   );
//   return data.data.user;
// };

// // ✅ Create address
// export const createAddressApi = async (
//   payload: CreateAddressPayload
// ): Promise<Address> => {
//   const { data } = await api.post<AddressResponse>(
//     ENDPOINTS.CUSTOMER.ADDRESS,
//     payload
//   );
//   return data.data.address;
// };

// // ✅ Update address
// export const updateAddressApi = async (
//   id: string,
//   payload: CreateAddressPayload
// ): Promise<Address> => {
//   const { data } = await api.patch<AddressResponse>(
//     ENDPOINTS.CUSTOMER.ADDRESS_DETAIL(id),
//     payload
//   );
//   return data.data.address;
// };

import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type {
  UserProfileResponse,
  UserProfile,
  UpdateUserProfilePayload,
  AddressResponse,
  CreateAddressPayload,
  Address,
  FamilyMembersResponse,
  FamilyMemberResponse,
  CreateFamilyMemberPayload,
  FamilyMember,
  PrescriptionsResponse,
  Prescription,
  Wallet,
  WalletResponse,
  WalletLedgerResponse,
  WalletLedger,
  WalletSetting,
  MyReferral,
  MyReferralResponse,
  WalletLedgerListResult,
} from './types';


export interface WalletLedgerParams {
  asset?: 'CASH' | 'COIN';
  limit?: number;
  offset?: number;
}

// ✅ Fetch user profile
export const fetchUserProfileApi = async (): Promise<UserProfile> => {
  const { data } = await api.get<UserProfileResponse>(ENDPOINTS.CUSTOMER.PROFILE);
  return data.data.user;
};

// ✅ Update user profile
export const updateUserProfileApi = async (
  payload: UpdateUserProfilePayload
): Promise<UserProfile> => {
  const { data } = await api.patch<UserProfileResponse>(ENDPOINTS.CUSTOMER.PROFILE, payload);
  return data.data.user;
};

// ✅ Address APIs
export const createAddressApi = async (payload: CreateAddressPayload): Promise<Address> => {
  const { data } = await api.post<AddressResponse>(ENDPOINTS.CUSTOMER.ADDRESS, payload);
  return data.data.address;
};

export const updateAddressApi = async (
  id: string,
  payload: CreateAddressPayload
): Promise<Address> => {
  const { data } = await api.patch<AddressResponse>(ENDPOINTS.CUSTOMER.ADDRESS_DETAIL(id), payload);
  return data.data.address;
};

// ✅ Family Members APIs
export const fetchFamilyMembersApi = async (): Promise<FamilyMember[]> => {
  const { data } = await api.get<FamilyMembersResponse>(ENDPOINTS.CUSTOMER.FAMILY_MEMBERS);
  return data.data.members;
};

export const deleteAddressApi = async (id: string): Promise<void> => {
  await api.delete(`/customer/address/${id}`);
};

// export const fetchFamilyMembersApi = async (): Promise<FamilyMember[]> => {
//   const { data } = await api.get<FamilyMembersResponse>(ENDPOINTS.CUSTOMER.FAMILY_MEMBERS);
//   return data.data.members;
// };

export const createFamilyMemberApi = async (
  payload: CreateFamilyMemberPayload
): Promise<FamilyMember> => {
  const { data } = await api.post<FamilyMemberResponse>(ENDPOINTS.CUSTOMER.FAMILY_MEMBERS, payload);
  return data.data.member;
};

export const updateFamilyMemberApi = async (
  id: string,
  payload: CreateFamilyMemberPayload
): Promise<FamilyMember> => {
  const { data } = await api.patch<FamilyMemberResponse>(
    ENDPOINTS.CUSTOMER.FAMILY_MEMBER_DETAIL(id),
    payload
  );
  return data.data.member;
};

export const deleteFamilyMemberApi = async (id: string): Promise<string> => {
  const { data } = await api.delete(`/customer/member/${id}`);
  return data.message ?? 'Family member deleted successfully';
};


// ✅ Prescriptions API
export const fetchPrescriptionsApi = async (): Promise<Prescription[]> => {
  const { data } = await api.get<PrescriptionsResponse>(ENDPOINTS.CUSTOMER.PRESCRIPTIONS);
  return data.data;
};
export const deletePrescriptionByIdApi = async (id: string): Promise<string> => {
  const { data } = await api.delete<PrescriptionsResponse>(`${ENDPOINTS.CUSTOMER.PRESCRIPTION}/${id}`);
  return id;
};
// ✅ Customer Wallet API
export const fetchCustomerWalletApi = async (): Promise<Wallet> => {
  const { data } = await api.get<WalletResponse>('/wallet/customer/me');
  return data.data.wallet;
};

export const fetchCustomerWalletLedgerApi = async ( params?: WalletLedgerParams ): Promise<WalletLedgerListResult> => {
  const { data } = await api.get<WalletLedgerResponse>('/wallet/ledger/customer', { params }); // Returned data type
  return {
    records: data.data.records,
    total_count: data.data.total_count,
  };
};

export const fetchWalletSettingApi = async (): Promise<{ data: WalletSetting }> => {
  const { data } = await api.get(`/wallet/settings`); // Returned data type
  return data.data;
}

export const fetchMyReferralApi = async (): Promise<MyReferral[]> => {
  const { data } = await api.get<MyReferralResponse>('referral/customer/successful'); // Returned data type
  return data.data.referrals;
};

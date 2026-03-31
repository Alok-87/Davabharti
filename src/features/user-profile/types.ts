// export interface Address {
//   id?: string;
//   name: string;
//   phone_number: string;
//   address_line_1: string;
//   address_line_2?: string;
//   city_district: string;
//   pincode: string;
//   state: string;
//   is_default: boolean;
//   created_at?: string;
//   updated_at?: string;
//   tag?:string
// }

// // ✅ User profile type
// export interface UserProfile {
//   id?: string;
//   name: string;
//   email: string;
//   phone_number: string;
//   dob: string;
//   gender: string;
//   device_type: string;
//   addresses: Address[];
//   is_profile_complete: boolean;
//   missing: string[];
// }

// // ✅ Response structure for user profile API
// export interface UserProfileResponse {
//   data: { user: UserProfile };
//   status: string;
//   message: string;
//   errors: any;
// }

// // ✅ Payload for updating user profile
// export interface UpdateUserProfilePayload {
//   name?: string;
//   email?: string;
//   phone_number?: string;
//   gender?: string;
//   dob?: string;
//   device_type?: string;
// }

// // ✅ Address request payload
// export interface CreateAddressPayload {
//   name: string;
//   phone_number: string;
//   address_line_1: string;
//   address_line_2?: string;
//   city_district: string;
//   pincode: string;
//   state: string;
//   is_default: boolean;
// }

// // ✅ Address response structure
// export interface AddressResponse {
//   data: { address: Address };
//   status: string;
//   message: string;
//   errors: any;
// }
// ✅ Address
// export interface Address {
//   id?: string;
//   name: string;
//   phone_number: string;
//   address_line_1: string;
//   address_line_2?: string;
//   city_district: string;
//   pincode: string;
//   state: string;
//   is_default: boolean;
//   created_at?: string;
//   updated_at?: string;
//   tag?: string;
// }

// // ✅ Family Member
// export interface FamilyMember {
//   id?: string;
//   userId?: string;
//   name: string;
//   relationship: 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD' | 'OTHER';
//   dob: string;
//   gender: 'MALE' | 'FEMALE' | 'OTHER';
//   isDeleted?: boolean;
// }

// // ✅ Prescription
// export interface Prescription {
//   imageUrl: string;
//   uploadedAt: string;
// }

// // ✅ User Profile
// export interface UserProfile {
//   id?: string;
//   name: string;
//   email: string;
//   phone_number: string;
//   dob: string;
//   gender: string;
//   device_type: string;
//   addresses: Address[];
//   familyMembers?: FamilyMember[];
//   is_profile_complete: boolean;
//   missing: string[];
// }

// // ✅ API Responses
// export interface UserProfileResponse {
//   data: { user: UserProfile };
//   status: string;
//   message: string;
//   errors: any;
// }

// // ✅ Family API responses
// export interface FamilyMembersResponse {
//   data: { members: FamilyMember[] };
//   status: string;
//   message: string;
//   errors: any;
// }

// export interface FamilyMemberResponse {
//   data: { member: FamilyMember };
//   status: string;
//   message: string;
//   errors: any;
// }

// // ✅ Prescriptions response
// export interface PrescriptionsResponse {
//   data: Prescription[];
//   status: string;
//   message: string;
//   errors: any;
// }

// // ✅ Payloads
// export interface UpdateUserProfilePayload {
//   name?: string;
//   email?: string;
//   phone_number?: string;
//   gender?: string;
//   dob?: string;
//   device_type?: string;
// }

// export interface CreateAddressPayload {
//   name: string;
//   phone_number: string;
//   address_line_1: string;
//   address_line_2?: string;
//   city_district: string;
//   pincode: string;
//   state: string;
//   is_default: boolean;
// }

// export interface CreateFamilyMemberPayload {
//   name: string;
//   relationship: 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD' | 'OTHER';
//   dob: string;
//   gender: 'MALE' | 'FEMALE' | 'OTHER';
// }

// export interface AddressResponse {
//   data: { address: Address };
//   status: string;
//   message: string;
//   errors: any;
// }

export interface Address {
  id?: string;
  name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city_district: string;
  pincode: string;
  state: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
  tag?: string;
  lat: number;
  lng: number;
}

// Relationship Types
export type Relationship = 'SELF' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER';

// ✅ Family Member
export interface FamilyMember {
  id?: string;
  userId?: string;
  name: string;
  relationship: Relationship;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  isDeleted?: boolean;
}

// Backend Family Member (for API responses that might use backend values)


// ✅ Prescription
export interface Prescription {
  id: string;
  imageUrl: string;
  uploadedAt: string;
}

// ✅ User Profile
export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone_number: string;
  dob: string;
  gender: string;
  device_type: string;
  addresses: Address[];
  familyMembers?: FamilyMember[];
  is_profile_complete: boolean;
  missing: string[];
  referral_code: string;
}

// ✅ API Responses
export interface UserProfileResponse {
  data: { user: UserProfile };
  status: string;
  message: string;
  errors: any;
}

// ✅ Family API responses
export interface FamilyMembersResponse {
  data: { members: FamilyMember[] };
  status: string;
  message: string;
  errors: any;
}

export interface FamilyMemberResponse {
  data: { member: FamilyMember };
  status: string;
  message: string;
  errors: any;
}





// ✅ Prescriptions response
export interface PrescriptionsResponse {
  data: Prescription[];
  status: string;
  message: string;
  errors: any;
}

// ✅ Payloads
export interface UpdateUserProfilePayload {
  name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  dob?: string;
  device_type?: string;
}

export interface CreateAddressPayload {
  name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city_district: string;
  pincode: string;
  state: string;
  is_default: boolean;
  lat: number;
  lng: number;
}

export interface CreateFamilyMemberPayload {
  name: string;
  relationship: Relationship;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}



export interface AddressResponse {
  data: { address: Address };
  status: string;
  message: string;
  errors: any;
}

export interface Wallet {
  userId: string;
  cashBalance: number;
  coinBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletResponse {
  status: string;
  message: string;
  data: {
    wallet: Wallet;
  };
}

export interface WalletLedger {
  id: string;
  userId: string;
  asset: "CASH" | "COIN" | string;   // extend if more assets exist
  direction: "CREDIT" | "DEBIT";
  amount: string;                    // keeping string because API sends string
  coinBatchId: string | null;
  source: "OFFER" | "ORDER" | "ADMIN" | string;
  referenceOrderId: string | null;
  note: string;
  metadata: Record<string, any>;
  createdAt: string;                 // ISO Date string
  coinBatch: any | null;             // update if you know coinBatch structure
};

export interface WalletLedgerResponse {
  status: string;
  message: string;
  errors: string | null;

  data: {
    total_count: number;
    records: WalletLedger[];
  };
};
export interface WalletLedgerListResult {
  records: WalletLedger[];
  total_count: number;
}
export interface WalletSetting {
  id: string;
  redemptionPercent: string;   // extend if more assets exist
};

export interface MyReferral {
  id: string;
  createdAt: string;
  rewardAmount: string;

  referee: {
    id: string;
    name: string;
    email: string;
    phone_number: string;
  };

  order: {
    id: string;
    orderNo: string;
    totalAmount: string;
    finalAmount: string;
    orderStatus: string;
  };
}


export interface MyReferralResponse {
  data: {
    referrals: MyReferral[];
    total: number;
    page: number;
    limit: number;
  };
  status: string;
  message: string;
  errors: any | null;
}


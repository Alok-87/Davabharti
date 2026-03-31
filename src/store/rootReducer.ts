// import { combineReducers } from '@reduxjs/toolkit';
// import medicinesReducer from '@/features/medicines/medicinesSlice';
// import sectionsReducer from "@/features/sections/sectionsSlice"
// import CategoriesReducer from "@/features/categories/categoriesSlice"
// import authReducer from "@/features/auth/authSlice"
// import cartReducer from "@/features/cart/cartSlice"
// import userProfileReducer from '@/features/user-profile/userProfileSlice'
// import prescriptionReducer from '@/features/prescriptions/prescriptionSlice';
// // import userProfileReducer from "@/features/user-profile/UserProfileSlice"
// // import other reducers here

// export const rootReducer = combineReducers({

//   medicines:medicinesReducer,
//   sections:sectionsReducer,
//   categories:CategoriesReducer,
//   auth:authReducer,
//   cart: cartReducer,
//   userProfile: userProfileReducer,
//     prescription: prescriptionReducer,

//   // add other slices
// });

// export type RootState = ReturnType<typeof rootReducer>;
'use client';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import medicinesReducer from '@/features/medicines/medicinesSlice';
import sectionsReducer from '@/features/sections/sectionsSlice';
import categoriesReducer from '@/features/categories/categoriesSlice';
import authReducer from '@/features/auth/authSlice';
import cartReducer from '@/features/cart/cartSlice';
import orderReducer from '@/features/order/orderSlice';
import userProfileReducer from '@/features/user-profile/userProfileSlice';
import prescriptionReducer from '@/features/prescriptions/prescriptionSlice';
import inquiryReducer from '@/features/inquiry/inquirySlice';
import offerReducer from '@/features/offers/offerSlice';
import blogReducer from '@/features/blog/blogSlice';
import onbardingReducer from '@/features/onboarding/onboardingSlice';
import homepageDataReducer from '@/features/homepage/homepageDataSlice';
import doctorOnbardingReducer from '@/features/onboarding(doctor)/onboarding(doctor)Slice';
import doctorReducers from '@/features/doctors/doctorSlice';

// ✅ Persist configs only for specific slices
const userProfilePersistConfig = {
  key: 'userProfile',
  storage,
};

const prescriptionPersistConfig = {
  key: 'prescription',
  storage,
};

export const rootReducer = combineReducers({
  medicines: medicinesReducer,
  sections: sectionsReducer,
  categories: categoriesReducer,
  auth: authReducer,
  cart: cartReducer,
  order: orderReducer,
  userProfile: persistReducer(userProfilePersistConfig, userProfileReducer),
  prescription: persistReducer(prescriptionPersistConfig, prescriptionReducer),
  inquiry: inquiryReducer,
  offers: offerReducer,
  blog: blogReducer,
  onboarding: onbardingReducer,
  homepageData: homepageDataReducer,
  doctoronboarding: doctorOnbardingReducer,
  doctor: doctorReducers,
});

export type RootState = ReturnType<typeof rootReducer>;

import { combineReducers } from '@reduxjs/toolkit';
import exampleReducer from '@/features/exampleSlice';
// import other reducers here

export const rootReducer = combineReducers({
  example: exampleReducer,
  // add other slices
});

export type RootState = ReturnType<typeof rootReducer>;

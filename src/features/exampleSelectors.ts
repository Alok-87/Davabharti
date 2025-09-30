import type { RootState } from '@/store';
export const selectExampleValue = (state: RootState) => state.example.value;
export const selectExampleLoading = (state: RootState) => state.example.loading;
export const selectExampleError = (state: RootState) => state.example.error;

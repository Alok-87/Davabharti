import type { RootState } from '../../store';
import { Prescription } from './types';

export const selectSavedPrescriptions = (state: RootState): Prescription[] =>
  state.prescription.saved;

export const selectIsUploading = (state: RootState): boolean => state.prescription.uploading;
export const selectUploadError = (state: RootState) => state.prescription.uploadError;
export const selectOrderPlacing = (state: RootState) => state.prescription.orderPlacing;
export const selectLastPlacedOrderId = (state: RootState) => state.prescription.lastPlacedOrderId;

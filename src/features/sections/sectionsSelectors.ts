import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

export const selectSectionsState = (state: RootState) => state.sections;

export const selectAllSections = createSelector(selectSectionsState, (s) => s.sections);
export const selectSectionsLoading = createSelector(selectSectionsState, (s) => s.loading);
export const selectSectionsError = createSelector(selectSectionsState, (s) => s.error);

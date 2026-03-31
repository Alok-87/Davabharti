import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Section } from './types';
import { fetchSections } from './sectionsThunks';

interface SectionsState {
  sections: Section[];
  total: number;
  loading: boolean;
  error?: string | null;
}

const initialState: SectionsState = {
  sections: [],
  total: 0,
  loading: false,
  error: null,
};

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    clearSections: (state) => {
      state.sections = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.sections = action.payload.sections ?? [];
        state.total = action.payload.total_count ?? state.sections.length;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch sections';
      });
  },
});

export const { clearSections } = sectionsSlice.actions;
export default sectionsSlice.reducer;

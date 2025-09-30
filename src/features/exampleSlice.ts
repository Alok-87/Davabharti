import { createSlice } from '@reduxjs/toolkit';
import type { ExampleState } from './types';
import { fetchExample, postExample } from './exampleThunk';

const initialState: ExampleState = {
  value: '',
  loading: false,
  error: undefined,
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExample.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchExample.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload.data;
      })
      .addCase(fetchExample.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(postExample.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(postExample.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload.data;
      })
      .addCase(postExample.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setValue, clearError } = exampleSlice.actions;
export default exampleSlice.reducer;

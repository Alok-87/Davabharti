import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSectionsApi } from './sectionsApi';

export const fetchSections = createAsyncThunk(
  'sections/fetchSections',
  async (params: { limit?: number; offset?: number } = {}, { rejectWithValue }) => {
    try {
      const res = await fetchSectionsApi(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? 'Failed to fetch sections');
    }
  }
);


import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategoriesApi } from './categoriesApi';
import { Category } from './type';

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    try {
      return await fetchCategoriesApi();
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch categories';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

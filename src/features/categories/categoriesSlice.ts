import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { fetchCategories } from './categoriesThunks';
import { Category } from './type';

interface CategoriesState {
  items: Category[];
  loading: boolean;
  error?: string;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Failed to fetch categories');
      });
  },
});

export default categoriesSlice.reducer;

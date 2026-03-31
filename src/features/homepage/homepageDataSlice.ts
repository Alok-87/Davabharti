import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomePageResponse } from './homepage';

interface HomepageDataState {
  data: HomePageResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: HomepageDataState = {
  data: null,
  loading: true, // Start in loading state
  error: null,
};

const homepageDataSlice = createSlice({
  name: 'homepageData',
  initialState,
  reducers: {
    setHomepageData: (state, action: PayloadAction<HomePageResponse | null>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setHomepageError: (state, action: PayloadAction<string>) => {
      state.data = null;
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setHomepageData, setHomepageError } = homepageDataSlice.actions;

export default homepageDataSlice.reducer;

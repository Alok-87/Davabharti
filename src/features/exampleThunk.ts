import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchExampleApi, postExampleApi } from './exampleApi';
import type { ExampleResponse } from './types';

// Fetch example
export const fetchExample = createAsyncThunk<ExampleResponse>(
  'example/fetchExample',
  async (_, thunkAPI) => {
    try {
      const response = await fetchExampleApi();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Post example
export const postExample = createAsyncThunk<ExampleResponse, { value: string }>(
  'example/postExample',
  async (payload, thunkAPI) => {
    try {
      const response = await postExampleApi(payload);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchMedicinesApi, fetchMedicineByIdApi, FetchMedicinesParams } from './medicinesApi';
// import type { MedicinesListResponse, Medicine } from './types';

// // Fetch list of medicines
// export const fetchMedicines = createAsyncThunk<
//   MedicinesListResponse,
//   FetchMedicinesParams,
//   { rejectValue: string }
// >('medicines/fetchMedicines', async (params, thunkAPI) => {
//   try {
//     const resp = await fetchMedicinesApi(params);
//     return resp;
//   } catch (err: any) {
//     // normalize error shape
//     const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch medicines';
//     return thunkAPI.rejectWithValue(message);
//   }
// });

// // Fetch detail by id
// export const fetchMedicineById = createAsyncThunk<
//   Medicine,
//   string,
//   { rejectValue: string }
// >('medicines/fetchMedicineById', async (id, thunkAPI) => {
//   try {
//     const resp = await fetchMedicineByIdApi(id);
//     return resp.data.medicine;
//   } catch (err: any) {
//     const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch medicine';
//     return thunkAPI.rejectWithValue(message);
//   }
// });

import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMedicinesApi, fetchMedicineByIdApi, FetchMedicinesParams, fetchMedicineBySlugApi } from './medicinesApi';
import type { MedicinesListResponse, MedicineDetail } from './types';

// ✅ Fetch list of medicines
export const fetchMedicines = createAsyncThunk<
  MedicinesListResponse,
  FetchMedicinesParams,
  { rejectValue: string }
>('medicines/fetchMedicines', async (params, thunkAPI) => {
  try {
    return await fetchMedicinesApi(params);
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch medicines';
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ Fetch detailed medicine info by ID
export const fetchMedicineById = createAsyncThunk<MedicineDetail, string, { rejectValue: string }>(
  'medicines/fetchMedicineById',
  async (id, thunkAPI) => {
    try {
      const medicine = await fetchMedicineByIdApi(id);
      return medicine;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch medicine';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMedicineBySlug = createAsyncThunk<MedicineDetail, string, { rejectValue: string }>(
  'medicines/fetchMedicineBySlug',
  async (slug, thunkAPI) => {
    try {
      console.log('test-1')
      const medicine = await fetchMedicineBySlugApi(slug);
      return medicine;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch medicine';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

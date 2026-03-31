// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { Medicine } from './types';
// import { fetchMedicines, fetchMedicineById } from './medicinesThunks';

// interface MedicinesState {
//   items: Medicine[];
//   total: number;
//   limit: number;
//   offset: number;
//   loading: boolean;
//   error?: string;
//   current?: Medicine | null;
//   lastParams: {
//     limit?: number;
//     offset?: number;
//     search_term?: string;
//     categoryIds?: string;
//     subCategoryIds?: string;
//   } | null;
// }

// const initialState: MedicinesState = {
//   items: [],
//   total: 0,
//   limit: 10,
//   offset: 0,
//   loading: false,
//   error: undefined,
//   current: null,
//   lastParams: null,
// };

// const medicinesSlice = createSlice({
//   name: 'medicines',
//   initialState,
//   reducers: {
//     clearMedicines: (state) => {
//       state.items = [];
//       state.total = 0;
//       state.offset = 0;
//       state.lastParams = null;
//       state.error = undefined;
//     },
//     setMedicinesParams: (state, action: PayloadAction<Partial<MedicinesState['lastParams']>>) => {
//       state.lastParams = { ...(state.lastParams ?? {}), ...action.payload };
//     },
//     clearError: (state) => {
//       state.error = undefined;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // fetchMedicines
//       .addCase(fetchMedicines.pending, (state) => {
//         state.loading = true;
//         state.error = undefined;
//       })
//       .addCase(fetchMedicines.fulfilled, (state, action) => {
//   state.loading = false;

//   if ((action.payload.offset ?? 0) === 0) {
//     // ✅ First page → replace items
//     state.items = action.payload.items;
//   } else {
//     // ✅ Next page (infinite scroll) → append
//     state.items = [...state.items, ...action.payload.items];
//   }

//   state.total = action.payload.total;
//   state.limit = action.payload.limit ?? state.limit;
//   state.offset = (action.payload.offset ?? 0) + action.payload.items.length;
// })
//       .addCase(fetchMedicines.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? 'Failed to load medicines';
//       })

//       // fetchMedicineById
//       .addCase(fetchMedicineById.pending, (state) => {
//         state.loading = true;
//         state.error = undefined;
//         state.current = null;
//       })
//       .addCase(fetchMedicineById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.current = action.payload;
//       })
//       .addCase(fetchMedicineById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? 'Failed to load medicine';
//       });
//   },
// });

// export const { clearMedicines, setMedicinesParams, clearError } = medicinesSlice.actions;
// export default medicinesSlice.reducer;

//before sorting

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Medicine, MedicineDetail } from './types';
import { fetchMedicines, fetchMedicineById, fetchMedicineBySlug } from './medicinesThunks';

interface MedicinesState {
  items: Medicine[];
  total: number;
  limit: number;
  offset: number;
  loading: boolean;
  error?: string;
  current?: MedicineDetail | null;
  lastParams: {
    limit?: number;
    offset?: number;
    search_term?: string;
    categoryIds?: string;
    subCategoryIds?: string;
  } | null;
}

const initialState: MedicinesState = {
  items: [],
  total: 0,
  limit: 10,
  offset: 0,
  loading: false,
  error: undefined,
  current: null,
  lastParams: null,
};

const medicinesSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    clearMedicines: (state) => {
      state.items = [];
      state.total = 0;
      state.offset = 0;
      state.lastParams = null;
      state.error = undefined;
    },
    setMedicinesParams: (state, action: PayloadAction<Partial<MedicinesState['lastParams']>>) => {
      state.lastParams = { ...(state.lastParams ?? {}), ...action.payload };
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ List fetch
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;

        if ((action.payload.offset ?? 0) === 0) {
          state.items = action.payload.items;
        } else {
          const existingIds = new Set(state.items.map((i) => i.id));
const newItems = action.payload.items.filter((i) => !existingIds.has(i.id));
state.items = [...state.items, ...newItems];
        }

        state.total = action.payload.total;
        state.limit = action.payload.limit ?? state.limit;
        state.offset = (action.payload.offset ?? 0) + action.payload.items.length;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load medicines';
      })

      // ✅ Detail fetch
      .addCase(fetchMedicineById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.current = null;
      })
      .addCase(fetchMedicineById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchMedicineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load medicine';
      })
      .addCase(fetchMedicineBySlug.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.current = null;
      })
      .addCase(fetchMedicineBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchMedicineBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load medicine';
      });
  },
});

export const { clearMedicines, setMedicinesParams, clearError } = medicinesSlice.actions;
export default medicinesSlice.reducer;
// --------------------------after sorting-------------------------------
// src/features/medicines/medicinesSlice.ts
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { fetchMedicinesApi, type FetchMedicinesParams } from './medicinesApi';
// import type { Medicine } from './types';

// interface MedicinesState {
//   items: Medicine[];
//   total: number;
//   loading: boolean;
//   error: string | null;
//   sortBy: string;
//   sortOrder: 'asc' | 'desc';
// }

// const initialState: MedicinesState = {
//   items: [],
//   total: 0,
//   loading: false,
//   error: null,
//   sortBy: 'name', // default
//   sortOrder: 'asc',
// };

// // ✅ Thunk
// export const fetchMedicines = createAsyncThunk(
//   'medicines/fetch',
//   async (params: FetchMedicinesParams, { rejectWithValue }) => {
//     try {
//       const response = await fetchMedicinesApi(params);
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error?.message || 'Failed to fetch medicines');
//     }
//   }
// );

// const medicinesSlice = createSlice({
//   name: 'medicines',
//   initialState,
//   reducers: {
//     setSort(state, action) {
//       state.sortBy = action.payload.sortBy;
//       state.sortOrder = action.payload.sortOrder;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMedicines.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMedicines.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload.items;
//         state.total = action.payload.total;
//       })
//       .addCase(fetchMedicines.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { setSort } = medicinesSlice.actions;
// export default medicinesSlice.reducer;

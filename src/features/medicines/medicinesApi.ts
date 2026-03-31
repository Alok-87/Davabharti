// import api from '@/lib/axios';
// import type { Medicine, MedicinesListResponse } from './types';
// import { ENDPOINTS } from '@/constants/endpoints';

// export interface FetchMedicinesParams {
//   limit?: number;
//   offset?: number;
//   search_term?: string;
//   categoryIds?: string;      // comma-separated
//   subCategoryIds?: string;   // comma-separated
//   brand?: string;            // comma-separated
//   form?: string;             // comma-separated
//   condition?: string;        // comma-separated
// }

/**
 * Fetches medicines. The server response shape may vary while the API is in progress,
 * so we defensively map common shapes to MedicinesListResponse.
 */
// export const fetchMedicinesApi = async (
//   params: FetchMedicinesParams = {}
// ): Promise<MedicinesListResponse> => {
//   const { data } = await api.get(ENDPOINTS.MEDICINES.LIST, { params });

//   // Map backend response to frontend expected shape
//   const medicines = data?.data?.medicines ?? [];
//   const total = data?.data?.total_count ?? medicines.length;
//   const limit = params.limit ?? 10;
//   const offset = params.offset ?? 0;

//   return { items: medicines, total, limit, offset };
// };

// export const fetchMedicinesApi = async (
//   params: FetchMedicinesParams = {}
// ): Promise<MedicinesListResponse> => {
//   const { data } = await api.get(ENDPOINTS.MEDICINES.LIST, { params });
//   const medicines = data?.data?.medicines ?? [];
//   const total = data?.data?.total_count ?? medicines.length;

//   return {
//     items: medicines,
//     total,
//     limit: params.limit ?? 10,
//     offset: params.offset ?? 0,
//   };
// };

// export const fetchMedicineByIdApi = async (id: string): Promise<Medicine> => {
//   const { data } = await api.get(ENDPOINTS.MEDICINES.DETAIL(id));
//   return data as Medicine;
// };

import api from '@/lib/axios';
import type { Medicine, MedicinesListResponse, MedicineDetail } from './types';
import { ENDPOINTS } from '@/constants/endpoints';

export interface FetchMedicinesParams {
  limit?: number;
  offset?: number;

  search_term?: string;

  /** Old filters (IDs) */
  categoryIds?: string;       // "1,2,3"
  subCategoryIds?: string;    // "10,11"

  /** New filters (Names) */
  categoryNames?: string;     // "Baby Care,Diabetes"
  subCategoryNames?: string;  // "Pain Relief,Ayurvedic"

  brand?: string;
  form?: string;
  condition?: string;

  /** Sorting */
  column?: string;
  order_by?: 'ASC' | 'DESC';
}

// ✅ Fetch list of medicines
// export const fetchMedicinesApi = async (
//   params: FetchMedicinesParams = {}
// ): Promise<MedicinesListResponse> => {
//   const { data } = await api.get(ENDPOINTS.MEDICINES.LIST, { params });

//   const medicines = data?.data?.medicines ?? [];
//   const total = data?.data?.total_count ?? medicines.length;

//   return {
//     items: medicines,
//     total,
//     limit: params.limit ?? 10,
//     offset: params.offset ?? 0,
//   };
// };
//added sorting
export const fetchMedicinesApi = async (
  params: FetchMedicinesParams = {}
): Promise<MedicinesListResponse> => {
  const { data } = await api.get(ENDPOINTS.MEDICINES.LIST, {
    params: {
      ...params,
      column: params.column,
      order_by: params.order_by,
    },
  });

  const medicines = data?.data?.medicines ?? [];
  const total = data?.data?.total_count ?? medicines.length;

  return {
    items: medicines,
    total,
    limit: params.limit ?? 10,
    offset: params.offset ?? 0,
  };
};

// ✅ Fetch single medicine by ID (detailed response)
export const fetchMedicineByIdApi = async (id: string): Promise<MedicineDetail> => {
  const { data } = await api.get(ENDPOINTS.MEDICINES.DETAIL(id));

  // Response structure: { data: { medicine: {...} }, status, message, errors }
  return data?.data?.medicine as MedicineDetail;
};

export const fetchMedicineBySlugApi = async (slug: string): Promise<MedicineDetail> => {
  console.log('test-2')
  const { data } = await api.get(ENDPOINTS.MEDICINES.SLUG(slug));

  // Response structure: { data: { medicine: {...} }, status, message, errors }
  console.log('slug', data.data)
  return data?.data?.medicine as MedicineDetail;
};


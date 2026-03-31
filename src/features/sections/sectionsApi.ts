import api from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import type { SectionsApiResponse } from './types';

export const fetchSectionsApi = async (params: { limit?: number; offset?: number } = {}) => {
  const { data } = await api.get(ENDPOINTS.SECTIONS.LIST, { params });
  // Return the parsed response (we keep it flexible for future mapping)
  return data as SectionsApiResponse;
};

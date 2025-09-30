import api from '@/lib/axios';
import type { ExampleResponse } from './types';
import { ENDPOINTS } from '@/constants/endpoints';

export const fetchExampleApi = async (): Promise<ExampleResponse> => {
  const { data } = await api.get<ExampleResponse>(ENDPOINTS.DUMMY.DUMMY1);
  return data;
};

export const postExampleApi = async (payload: { value: string }): Promise<ExampleResponse> => {
  const { data } = await api.post<ExampleResponse>(ENDPOINTS.DUMMY.DUMMY2, payload);
  return data;
};

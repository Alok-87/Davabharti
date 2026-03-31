import api from '@/lib/axios';
import { Category, CategoriesApiResponse } from './type';

export const fetchCategoriesApi = async (): Promise<Category[]> => {
  const response = await api.get<CategoriesApiResponse>('/category');
  return response.data.data.categories; // Correct path: data.data.categories
};
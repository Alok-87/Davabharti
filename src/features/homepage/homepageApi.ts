import api from "@/lib/axios";
import { HomePageResponse } from "./homepage";

export const getHomepageApi = async (): Promise<HomePageResponse> => {
  const { data } = await api.get('/home-page');
  return data.data;
};

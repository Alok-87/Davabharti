
import api from "@/lib/axios";
import { Blog, BlogListResponse } from "./blog";

export const fetchBlogsApi = async (
  page: number = 1,
  limit: number = 10,
  search_term?: string
): Promise<BlogListResponse> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search_term) params.set("search_term", search_term);

  const { data } = await api.get(`/blog?${params.toString()}`);
  return data.data;
};

export const fetchBlogBySlugApi = async (slug: string): Promise<Blog> => {
  const { data } = await api.get(`/blog/${slug}`);
  return data.data.blog;
};


import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBlogBySlugApi, fetchBlogsApi } from "./blogApi";
import { Blog, BlogListResponse } from "./blog";

export const fetchBlogs = createAsyncThunk<
  BlogListResponse,
  { page?: number; limit?: number; search_term?: string },
  { rejectValue: string }
>(
  "blog/fetchBlogs",
  async (params, thunkAPI) => {
    try {
      return await fetchBlogsApi(params.page, params.limit, params.search_term);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || "Failed to load blogs");
    }
  }
);

export const fetchBlogBySlug = createAsyncThunk<
  Blog,
  string, // slug
  { rejectValue: string }
>(
  "blog/fetchBlogBySlug",
  async (slug, thunkAPI) => {
    try {
      return await fetchBlogBySlugApi(slug);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || "Failed to load blog post");
    }
  }
);

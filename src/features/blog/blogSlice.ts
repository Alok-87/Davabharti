
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Blog } from "./blog";
import { fetchBlogBySlug, fetchBlogs } from "./blogThunks";

interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  totalBlogs: number;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  totalBlogs: 0,
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.totalBlogs = action.payload.total_count;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single blog by slug
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentBlog = null; // Clear previous blog
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default blogSlice.reducer;

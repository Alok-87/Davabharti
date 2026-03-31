// app/blogs/[slug]/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks"; // adjust path
import { fetchBlogBySlug, fetchBlogs } from "@/features/blog/blogThunks";
import RecentBlog from "./components/RecentBlog";


export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ? decodeURIComponent(params.slug) : "";

  const dispatch = useAppDispatch();
  const { currentBlog, blogs, loading, error } = useAppSelector((s) => s.blog);

  // Fetch list for sidebar (once)
  useEffect(() => {
    dispatch(fetchBlogs({}));
  }, [dispatch]);

  // Fetch blog by slug (when slug changes)
  useEffect(() => {
    if (!slug) return;
    dispatch(fetchBlogBySlug(slug));
  }, [dispatch, slug]);

  const sidebarBlogs = useMemo(() => {
    // You can filter published only if needed:
    // return blogs.filter(b => b.status === "published");
    return blogs;
  }, [blogs]);

  if (loading && !currentBlog) {
    return (
      <div className="flex items-center justify-center py-16">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-7 px-2 sm:px-10 xl:px-20 py-10 bg-gray-100">
      {/* Main Blog */}
      <div className="w-full xl:w-3/4 bg-white p-5 rounded-lg shadow-md">
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {currentBlog ? (
          <>
            {currentBlog.imageUrl && (
              <img
                src={currentBlog.imageUrl}
                alt={currentBlog.title}
                className="w-full rounded-lg"
              />
            )}

            <h1 className="text-xl sm:text-2xl font-bold mt-4">
              {currentBlog.title}
            </h1>

            <p className="text-gray-500">
              By {currentBlog.author} •{" "}
              {new Date(currentBlog.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-4 whitespace-pre-line">{currentBlog.content}</div>
          </>
        ) : (
          <div className="py-10 text-gray-600">Blog not found.</div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full xl:w-1/4">
        <RecentBlog blogs={sidebarBlogs} loading={loading} />
      </div>
    </div>
  );
}

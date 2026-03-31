// app/blogs/components/RecentBlog.tsx
"use client";

import { useRouter } from "next/navigation";
import BlogCard from "./BlogCard";

type RecentBlogProps = {
  blogs: Array<{
    id: string;
    slug: string;
    title: string;
    imageUrl?: string;
  }>;
  loading?: boolean;
};

export default function RecentBlog({ blogs, loading }: RecentBlogProps) {
  const router = useRouter();

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md w-full">
      <h1 className="text-lg sm:text-xl font-bold mb-4 border-b pb-2">
        Recent Blogs
      </h1>

      {loading && blogs.length === 0 ? (
        <div className="py-6 text-gray-500">Loading...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => router.push(`/blogs/${blog.slug}`)}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded transition"
            >
              <BlogCard
                blog={{
                  id: blog.id,
                  slug: blog.slug,
                  title: blog.title,
                  image: blog.imageUrl || "/placeholder-blog.jpg",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

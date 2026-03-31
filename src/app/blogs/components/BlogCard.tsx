// app/blogs/components/BlogCard.tsx
"use client";

export type BlogCardType = {
  id: string;
  slug: string;
  title: string;
  image: string;
};

export default function BlogCard({ blog }: { blog: BlogCardType }) {
  return (
    <div className="flex gap-2 cursor-pointer">
      <img
        src={blog.image}
        alt={blog.title}
        className="h-20 w-24 object-cover rounded"
      />
      <div className="text-sm font-bold text-gray-700">{blog.title}</div>
    </div>
  );
}

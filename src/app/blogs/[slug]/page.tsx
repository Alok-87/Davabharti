// app/blogs/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogClient from "../components/BlogClient";

// Use your real API/base URL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

async function getBlogBySlug(slug: string) {
  if (!API_BASE) throw new Error("Missing API base URL env");

  const res = await fetch(`${API_BASE}/api/v2/blog/${encodeURIComponent(slug)}`, {
    // choose one:
    cache: "no-store", // always fresh (SSR every request)
    // next: { revalidate: 60 }, // ISR (revalidate every 60s)
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch blog");
  const { data } = await res.json();
  return data.blog;
}

async function getRecentBlogs() {
  if (!API_BASE) throw new Error("Missing API base URL env");

  const res = await fetch(`${API_BASE}/api/v2/blog`, {
    cache: "no-store",
    // next: { revalidate: 300 },
  });

  if (!res.ok) return [];
  const { data } = await res.json();
  return data.blogs;
}

// Dynamic SEO metadata per blog
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const blog = await getBlogBySlug(decodedSlug);

  if (!blog) {
    return {
      title: "Blog not found",
      description: "The requested blog post could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = blog.metaTitle || blog.title || "Blog";
  const description =
    blog.metaDescription ||
    blog.excerpt ||
    (typeof blog.content === "string"
      ? blog.content.replace(/<[^>]*>/g, "").slice(0, 160)
      : "Read this blog post.");

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/blogs/${encodeURIComponent(decodedSlug)}`;
  const image = blog.imageUrl || `${process.env.NEXT_PUBLIC_SITE_URL || ""}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [blog, recentBlogs] = await Promise.all([
    getBlogBySlug(decodedSlug),
    getRecentBlogs(),
  ]);

  console.log("BlogPage fetch:", { slug: decodedSlug, blog, recentBlogs });
  if (!blog) notFound();

  return <BlogClient blog={blog} recentBlogs={recentBlogs} />;
}

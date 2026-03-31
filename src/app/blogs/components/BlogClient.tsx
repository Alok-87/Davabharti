// app/blogs/[slug]/BlogClient.tsx
"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import parse, { DOMNode, Element } from "html-react-parser";
import RecentBlog from "./RecentBlog";

type Blog = {
  title: string;
  author?: string;
  createdAt?: string;
  imageUrl?: string;
  content?: string;
};

export default function BlogClient({
  blog,
  recentBlogs,
}: {
  blog: Blog;
  recentBlogs: any[];
}) {
  const sanitizedBlogHtml = useMemo(() => {
    const raw = blog?.content || "";
    return raw ? DOMPurify.sanitize(raw) : "";
  }, [blog?.content]);

  const options = useMemo(
    () => ({
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element) {
          const tag = domNode.name?.toLowerCase();

          const mergeClass = (extra: string) => {
            const existing =
              domNode.attribs?.class || (domNode.attribs as any)?.className || "";
            const merged = `${existing} ${extra}`.trim();
            domNode.attribs = { ...(domNode.attribs || {}), class: merged };
          };

          switch (tag) {
            case "h1":
              mergeClass("text-3xl font-bold mb-4 mt-8 text-gray-900");
              return domNode;
            case "h2":
              mergeClass("text-2xl font-bold mb-3 mt-6 text-gray-900");
              return domNode;
            case "h3":
              mergeClass("text-xl font-semibold mt-6 mb-2 text-gray-900");
              return domNode;
            case "p":
              mergeClass("mb-4 text-gray-700 leading-7");
              return domNode;
            case "ul":
              mergeClass("list-disc pl-6 mt-2 space-y-1 mb-4 text-gray-700");
              return domNode;
            case "ol":
              mergeClass("list-decimal pl-6 mt-2 space-y-1 mb-4 text-gray-700");
              return domNode;
            case "li":
              mergeClass("mb-1 leading-7");
              return domNode;
            case "strong":
            case "b":
              mergeClass("font-semibold text-gray-900");
              return domNode;
            case "a": {
              mergeClass("text-blue-600 hover:underline");
              const href = domNode.attribs?.href || "";
              if (href.startsWith("http")) {
                domNode.attribs = {
                  ...(domNode.attribs || {}),
                  target: "_blank",
                  rel: "noreferrer",
                };
              }
              return domNode;
            }
            case "blockquote":
              mergeClass("border-l-4 border-gray-200 pl-4 italic text-gray-700 my-4");
              return domNode;
            case "img":
              mergeClass("w-full rounded-lg my-4");
              return domNode;
            case "hr":
              mergeClass("my-6 border-gray-200");
              return domNode;
            case "table":
              mergeClass("w-full border border-gray-200 my-4");
              return domNode;
            case "thead":
              mergeClass("bg-gray-50");
              return domNode;
            case "th":
              mergeClass("border border-gray-200 p-2 text-left font-semibold");
              return domNode;
            case "td":
              mergeClass("border border-gray-200 p-2");
              return domNode;
            default:
              return undefined;
          }
        }
        return undefined;
      },
    }),
    []
  );

  return (
    <div className="flex flex-col xl:flex-row gap-7 px-2 sm:px-10 xl:px-20 py-10 bg-gray-100">
      <div className="w-full xl:w-3/4 bg-white p-5 rounded-lg shadow-md">
        {blog.imageUrl && (
          <img src={blog.imageUrl} className="w-full rounded-lg" alt={blog.title} />
        )}

        <h1 className="text-2xl font-bold mt-4">{blog.title}</h1>
        <p className="text-gray-500">
          By {blog.author || "Admin"} •{" "}
          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
        </p>

        <div className="mt-4">
          {sanitizedBlogHtml ? parse(sanitizedBlogHtml, options) : null}
        </div>
      </div>

      <div className="w-full xl:w-1/4">
        <RecentBlog blogs={recentBlogs} loading={false} />
      </div>
    </div>
  );
}

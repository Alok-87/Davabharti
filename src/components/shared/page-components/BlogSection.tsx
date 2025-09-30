import React from 'react';
import Image from 'next/image';

import blog_1 from '@/assets/blog_1.png';
import blog_2 from '@/assets/blog_2.png';
import blog_3 from '@/assets/blog_3.png';
import BlogSectionCarouselWrapper from './Blog/BlogSectionCarouselWrapper'; // client-only wrapper

// Dummy data
const blogs = [
  {
    id: 1,
    title: 'Ayurvedic Remedies To Manage High Blood Pressure',
    description:
      'Millions of people worldwide suffer from High Blood Pressure. Here are Ayurvedic remedies to help manage it effectively.',
    image: blog_1,
  },
  {
    id: 2,
    title: 'Best Ayurvedic Tips for Weight Loss',
    description:
      'Discover simple and natural Ayurvedic methods to maintain a healthy weight and boost overall wellness.',
    image: blog_2,
  },
  {
    id: 3,
    title: 'How to Store Medicines at Home Safely and Effectively',
    description:
      'Learn the best practices to store medicines safely at home and ensure their effectiveness for longer.',
    image: blog_3,
  },
];

const BlogSection = () => {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-8xl mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Health Corner</h2>
          <button className="px-4 py-2 bg-primary text-white text-sm rounded cursor-pointer">
            See All
          </button>
        </div>

        {/* ✅ Static Blog Grid (SSR for SEO) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg ssr-grid shadow hover:shadow-lg transition overflow-hidden "
            >
              {/* Blog Image */}
              <div className="relative w-full h-48">
                <Image src={blog.image} alt={blog.title} fill className="object-cover" />
              </div>

              {/* Blog Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{blog.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Client Carousel Wrapper (CSR only) */}
        <div className="mt-10">
          <BlogSectionCarouselWrapper blogs={blogs} />
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

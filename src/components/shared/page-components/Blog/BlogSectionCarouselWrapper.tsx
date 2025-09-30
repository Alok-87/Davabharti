'use client';

import BlogSectionCarousel from './BlogSectionCarousel';

interface Blog {
  id: number;
  title: string;
  description: string;
  image: any;
}

const BlogSectionCarouselWrapper = ({ blogs }: { blogs: Blog[] }) => {
  return <BlogSectionCarousel blogs={blogs} />;
};

export default BlogSectionCarouselWrapper;

'use client';

import { useRef } from 'react';
import Slider from 'react-slick';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';
import blogs from '@/app/blogs/blogData';
import { useRouter } from 'next/navigation';

const BlogSlider = () => {
  const sliderRef = useRef<Slider | null>(null);

  const router = useRouter();
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false, // hide default arrows
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between gap-8">
          {/* Left Text Section */}
          <div className="w-full flex flex-col lg:w-2/5 justify-between">
            <div className="block lg:text-left text-center">
              <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
                Our latest <span className=" text-primary">blogs</span>
              </h2>
              <p className="text-gray-500 mb-10 max-lg:max-w-xl max-lg:mx-auto">
                Welcome to our blog section, where knowledge meets inspiration. Explore insightful
                articles, expert tips, and the latest trends in our field.
              </p>
              <Link
                href="./blogs/ayurvedic-winter-skincare-tips"
                className="cursor-pointer border border-gray-300 shadow-sm rounded-full py-3.5 px-7 w-52 lg:mx-0 mx-auto flex justify-center text-gray-900 font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                View All
              </Link>
            </div>

            {/* Slider controls BELOW View All */}

          </div>

          {/* Slider Section */}
          <div className="w-full lg:w-3/5 flex flex-col relative ">
            <Slider ref={sliderRef} {...settings}>
              {blogs.map((blog) => (
                <div key={blog.id} className="px-3">
                  <div className="flex items-center mb-9">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="rounded-2xl w-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl text-gray-900 line-clamp-1 font-medium leading-8 mb-4  transition">
                    {blog.title}
                  </h3>
                  <div
                    onClick={() => router.push(`/blogs/${blog.slug}`)}
                    className="cursor-pointer flex items-center gap-2 text-lg text-primary font-semibold">
                    Read more
                  </div>
                </div>
              ))}
            </Slider>
            <div className="flex items-center  lg:justify-start justify-center mt-8 gap-8 mb-4 ">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="absolute -left-4 top-1/3 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer"
              >
                <IoIosArrowBack className="text-3xl text-gray-700" />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="absolute -right-4 top-1/3 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer"
              >
                <IoIosArrowForward className="text-3xl text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSlider;

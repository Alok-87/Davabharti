"use client";
import React from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Dynamically import react-slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface Blog {
    id: number;
    title: string;
    description: string;
    image: any;
}

const BlogSectionCarousel = ({ blogs }: { blogs: Blog[] }) => {
    const settings = {
        dots: false, // ✅ no dots
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 800,
        autoplaySpeed: 3000,
        cssEase: "linear",
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 640,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <div className="w-full relative">
            <Slider {...settings}>
                {blogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="bg-white rounded-lg flex gap-5 shadow hover:shadow-lg transition overflow-hidden "
                    >
                        {/* Blog Image */}
                        <div className="relative w-full h-48">
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Blog Content */}
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 line-clamp-2">
                                {blog.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {blog.description}
                            </p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

// ✅ Custom Prev Button
function PrevArrow({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-100 z-10"
        >
            <FaArrowLeft className="w-4 h-4" />
        </button>
    );
}

// ✅ Custom Next Button
function NextArrow({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-100 z-10"
        >
            <FaArrowRight className="w-4 h-4" />
        </button>
    );
}

export default BlogSectionCarousel;

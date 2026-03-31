'use client';
import Loader from "@/components/ui/loader";
import { fetchBlogs } from "@/features/blog/blogThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { IoArrowForward } from "react-icons/io5";
import { useRouter } from "next/navigation";

const HealthInsight = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { blogs, loading, error } = useAppSelector((s) => s.blog);
    console.log('blogs', blogs);
    useEffect(() => {
        dispatch(fetchBlogs({}));
    }, [dispatch]);

    const getPreviewText = (html: string, wordLimit) => {
        const text = html.replace(/<[^>]+>/g, ""); // remove HTML tags
        const words = text.split(/\s+/).slice(0, wordLimit);
        return words.join(" ") + (words.length >= wordLimit ? "..." : "");
    };

    if (loading) return <p className="text-center"><Loader /></p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;


    return (
        <div >
            {blogs.map((blog) => (
                <section
                    key={blog._id}
                    className="text-gray-600 body-font overflow-hidden"
                >
                    <div className="container px-5 py-3 mx-auto">
                        <div className="border-b border-gray-200 py-8">
                            <div className="flex flex-col md:flex-row gap-6">

                                {/* LEFT: Image */}
                                <div className="md:w-64 w-full flex-shrink-0">
                                    <img
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        className="w-full h-40 object-cover rounded-lg cursor-pointer"
                                        onClick={() => router.push(`/blogs/${blog.slug}`)}
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        {new Date(blog.createdAt).toDateString()}
                                    </p>
                                    <p className="mt-2 text-sm text-primary">
                                        {blog.author}
                                    </p>
                                </div>

                                {/* RIGHT: Content */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                        {blog.title}
                                    </h2>

                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {getPreviewText(blog.content,60)}
                                    </p>


                                    <div
                                      onClick={() => router.push(`/blogs/${blog.slug}`)}
                                        className="inline-flex gap-1 justify-center items-center text-primary mt-6 font-medium cursor-pointer"
                                    >
                                        Learn More <IoArrowForward  />
                                        
                                        </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

            ))}
        </div>
    );
};

export default HealthInsight;

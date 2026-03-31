'use client';
import { useForm } from 'react-hook-form';
import { MdEmail } from 'react-icons/md';
import { FiPhoneCall } from 'react-icons/fi';
import { RiCustomerService2Fill } from 'react-icons/ri';
import Image from 'next/image';
import inquiry from '@/assets/Inquiry.jpg';
import { createInquiry } from '@/features/inquiry/inquiryThunks';
import { useAppDispatch } from '@/store/hooks';
import { getToken } from '@/features/auth/utils/tokenManager';

type InquiryFormData = {
  name: string;
  phone: string;
  email?: string;
  question: string;
};

export default function InquiryPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>();

  const dispatch = useAppDispatch();

  const onSubmit = (data: InquiryFormData) => {
    const token = getToken();
    if (token) {
      dispatch(createInquiry(data));
      reset(); // reset form after submit
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* ===== Hero Section ===== */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <Image src={inquiry} alt="Health Inquiry Banner" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold text-white mb-2">Health Inquiry</h1>
          <p className="text-gray-200">
            Tell us about your health concern, our medical team is here for you.
          </p>
        </div>
      </div>

      {/* ===== Form Section ===== */}
      <div className="flex justify-center -mt-20 px-4 z-4">
        <div className="w-full max-w-2xl bg-white text-gray-800 rounded-xl shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Enter a valid 10-digit Indian phone number',
                  },
                })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email (optional)</label>
              <input
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Question */}
            <div>
              <label className="block font-medium mb-1">
                Health Concern <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('question', {
                  required: 'Please describe your health concern',
                  minLength: {
                    value: 10,
                    message: 'Your message should be at least 10 characters long',
                  },
                })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none resize-none"
                rows={4}
                placeholder="Describe your symptoms or concern..."
              ></textarea>
              {errors.question && <p className="text-red-500 text-sm">{errors.question.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold shadow-md hover:bg-primary/90 transition cursor-pointer"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>

      {/* ===== Contact Section ===== */}
      <section className="bg-white text-black py-12 px-6 mt-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 text-center">
          {/* Email */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-800/60 p-4 rounded-xl">
              <MdEmail className="text-3xl sm:text-4xl text-white" />
            </div>
            <h3 className="text-lg font-semibold">Email us:</h3>
            <p className="text-gray-800 max-w-xs">
              Email us for general queries, including marketing and partnership opportunities.
            </p>
            <a className="text-primary font-medium mt-1 hover:underline">care@davabharti.com</a>
          </div>

          {/* Call */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-800/60 p-4 rounded-xl">
              <FiPhoneCall className="text-3xl sm:text-4xl text-white" />
            </div>
            <h3 className="text-lg font-semibold">Call us:</h3>
            <p className="text-gray-800 max-w-xs">
              Call us to speak to a member of our team. We are always happy to help.
            </p>
            <a href="" className="text-primary font-medium mt-1 hover:underline">
              +91 8955801801
            </a>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-800/60 p-4 rounded-xl">
              <RiCustomerService2Fill className="text-3xl sm:text-4xl text-white" />
            </div>
            <h3 className="text-lg font-semibold">Support</h3>
            <p className="text-gray-800 max-w-xs">
              Email us for general queries, including marketing and partnership opportunities.
            </p>
            <a
              href="#"
              className="mt-2 border border-blue-700 text-primary px-4 py-1.5 rounded-lg text-sm hover:bg-primary hover:text-white transition"
            >
              Support center
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';
import { useForm } from 'react-hook-form';
import { MdEmail } from 'react-icons/md';
import { FiPhoneCall } from 'react-icons/fi';
import { RiCustomerService2Fill } from 'react-icons/ri';
import Image from 'next/image';
import network from '@/assets/network.jpg';
import { createInquiry } from '@/features/inquiry/inquiryThunks';
import { useAppDispatch } from '@/store/hooks';
import { getToken } from '@/features/auth/utils/tokenManager';
import medicalshop from '@/assets/medicalshop.jpg'
import OnboardingForm from './components/OnboardingForm';

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
        <Image src={network} alt="Health Inquiry Banner" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Become a Partner
          </h1>
          <p className="text-gray-200 max-w-xl">
            Join hands with us to grow together. Partner with our platform and reach
            more customers while delivering trusted healthcare solutions.
          </p>
        </div>

      </div>
      {/* ===== Form Section ===== */}
      <div className="flex justify-center -mt-20 px-1 z-20">
        <div className="w-full max-w-7xl  bg-white text-gray-800 rounded-xl shadow-lg p-4 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-center mt-4">
            Partner Registration Details
          </h2>

          <OnboardingForm/>
        </div>
      </div>
      {/* CTA Secton */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-3xl bg-[#F6F2EE] shadow-sm md:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-12 md:px-14 md:py-16">
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                Start partnering today!
              </h2>

              <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
                Join DavaBharti as a Partner and grow your earnings by helping customers
                get medicines and healthcare services faster.
              </p>

              <div className="mt-8">
                <a
                  href="#partner-form"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200"
                >
                  Become a Partner
                </a>
              </div>
            </div>

            <div className="relative min-h-[260px] md:min-h-[360px]">
              <Image
                src={medicalshop}
                alt="DavaBharti Partner"
                className="h-full w-full object-cover rounded-xl"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import UploadPrescription from '@/components/shared/upload-prescription/UploadPrescription';
import Link from 'next/link';
import React from 'react';
import { GoArrowLeft } from 'react-icons/go';

const Page = () => {
  return (
    <div className="flex flex-col  gap-6 px-4 py-8 md:px-8 lg:px-16 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="flex items-center mb-4 lg:ml-35 ">
        <Link href="/checkout">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
          >
            <GoArrowLeft className="text-lg" />
            <span className="font-medium">Back</span>
          </button>
        </Link>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
        {/* Upload Section */}
        <section className="w-full lg:w-[40vw] flex justify-center">
          <UploadPrescription href="/checkout" orderType="order" />
        </section>

        {/* Guide Section */}
        <article className="w-full lg:w-[40vw] bg-white rounded-lg border border-gray-200 shadow-md p-6 flex flex-col min-h-[70vh]">
          {/* Heading */}
          <header className="border-b border-gray-200 pb-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Guide for a Valid Prescription</h3>
          </header>

          {/* Content */}
          <div className="flex flex-col md:flex-row gap-5 flex-1">
            {/* Image */}
            <div className="w-full md:w-1/2 h-[250px] md:h-auto rounded-lg overflow-hidden shadow-inner bg-gray-50">
              <img
                src="/validate_rx.png"
                alt="Prescription upload preview"
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>

            {/* Bullet Points */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
                <li>
                  <strong>Validate Prescription Guide</strong>
                </li>
                <li>Don’t crop out any part of the image</li>
                <li>Avoid blurred images</li>
                <li>Include details of doctor, patient, and clinic visit date</li>
                <li>Medicines will be dispensed as per prescription</li>
                <li>Supported file types: jpeg, jpg, png, pdf</li>
                <li>Maximum allowed file size: 5MB</li>
              </ul>
            </div>
          </div>

          <p className="mt-5 text-xs md:text-sm font-medium text-gray-600">
            *Government regulations require a valid prescription
          </p>
        </article>
      </div>
    </div>
  );
};

export default Page;

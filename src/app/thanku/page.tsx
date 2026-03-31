'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Thanku() {
  const orderId = 'DB12345678';
  const amount = 823.16;
  const estimatedDelivery = 'Fri, 11 Oct 2025';

  return (
    <div className=" bg-gray-50 flex flex-col items-center justify-center px-4 py-4">
      {/* Card */}
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 max-w-lg w-full text-center">
        {/* ✅ Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="w-16 h-16 text-green-500 animate-bounce" />
        </div>

        {/* 🎉 Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Thank you for shopping with <span className="font-semibold text-primary">Davabharti</span>
          . Your order has been confirmed and is being processed.
        </p>

        {/* 🧾 Order Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-md mt-6 p-4 text-left">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Order ID:</span> {orderId}
          </p>
          <p className="text-sm text-gray-700 mt-2">
            <span className="font-medium text-gray-900">Amount Paid:</span> ₹{amount}
          </p>
          <p className="text-sm text-gray-700 mt-2">
            <span className="font-medium text-gray-900">Estimated Delivery:</span>{' '}
            {estimatedDelivery}
          </p>
        </div>

        {/* 🚚 Info Box */}
        <div className="mt-4 text-sm text-gray-600">
          You’ll receive updates about your order via email and SMS.
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/user/orders"
            className="bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            Track Order
          </Link>
          <Link
            href="/"
            className="border border-primary text-primary px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary/10 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

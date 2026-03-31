'use client';

import Link from 'next/link';

export default function ComingSoon() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      {/* Content */}
      <div className="text-center px-6">
        <h1 className="text-6xl sm:text-8xl font-semibold mb-4">Coming Soon</h1>
        <p className="text-gray-500 text-base sm:text-lg mb-8">
          We’re working hard to bring you something amazing. Stay tuned!
        </p>

        <Link
          href="/"
          className="inline-block rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}

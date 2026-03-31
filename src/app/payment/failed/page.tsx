'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { XCircle } from 'lucide-react';

export default function PaymentFailedPage() {
  const router = useRouter();

  // Optional auto-redirect after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/user/orders');
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[80vh] px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Payment Failed</h1>
        <p className="text-gray-500 mt-2">Something went wrong while processing your payment.</p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/checkout"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
          >
            Try Again
          </Link>
          <Link
            href="/user/orders"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all"
          >
            Go to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

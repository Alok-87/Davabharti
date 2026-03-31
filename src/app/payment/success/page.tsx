// 'use client';

// import { useRouter, useSearchParams } from 'next/navigation';
// import { useEffect } from 'react';

// export default function PaymentSuccessPage() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const status = params.get('status'); // backend might append ?status=success or ?status=failed

//   useEffect(() => {
//     if (status === 'success') {
//       router.push('/user/orders');
//     } else {
//       router.push('/payment/failed');
//     }
//   }, [status, router]);

//   return (
//     <div className="flex items-center justify-center h-[70vh]">
//       <div className="text-center">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Redirecting you to your orders page...
//         </p>
//       </div>
//     </div>
//   );
// }

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get('status');
  const status = rawStatus?.toLowerCase(); // ✅ Makes it safe
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (status === 'success' || status === 'failed') {
      if (status === 'success') {
        const channel = new BroadcastChannel('payment_channel');
        channel.postMessage({ type: 'PAYMENT_SUCCESS', orderId });
        channel.close();
      }

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (status === 'success') {
              router.push('/user/orders');
            } else {
              router.push('/payment/failed');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      // If no status parameter, assume failed
      router.push('/payment/failed');
    }
  }, [status, router]);

  const isSuccess = status === 'success';

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center max-w-md w-full">
        {isSuccess ? (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        )}

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h1>

        <p className="text-gray-600 mb-4">
          {isSuccess
            ? 'Thank you for your order. Your payment has been processed successfully.'
            : 'We encountered an issue while processing your payment. Please try again.'
          }
        </p>

        {orderId && isSuccess && (
          <p className="text-sm text-gray-500 mb-4">
            Order ID: {orderId}
          </p>
        )}

        <p className="text-gray-500 text-sm mb-6">
          Redirecting in {countdown} seconds...
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isSuccess ? (
            <button
              onClick={() => router.push('/user/orders')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              View Orders
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/checkout')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/user/orders')}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go to Orders
              </button>
            </>
          )}
        </div>

        {/* Manual status check for debugging */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Debug Info:</p>
          <p className="text-xs text-gray-500">Status: {status || 'not provided'}</p>
          <p className="text-xs text-gray-500">Order ID: {orderId || 'not provided'}</p>
        </div>
      </div>
    </div>
  );
}
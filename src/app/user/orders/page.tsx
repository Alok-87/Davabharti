'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrders } from '@/features/order/orderThunks';
import OrderCard from './components/OrderCard';
import { AlertTriangle, Package, Search } from 'lucide-react';
import { getToken } from '@/features/auth/utils/tokenManager';
import { useSearchParams, useRouter } from 'next/navigation';
import { removeOffer } from '@/features/offers/offerSlice';

const CHUNK_SIZE = 10;

export default function Orders() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, loading, error } = useAppSelector((state) => state.order);

  const initialSearch = searchParams.get('search_term') || '';
  const initialStatus = searchParams.get('orderStatus') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [orderStatus, setOrderStatus] = useState(initialStatus);
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);

  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setVisibleCount(CHUNK_SIZE);
  }, [orders]);

  const updateURL = (search: string, status: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search_term', search);
    if (status) params.set('orderStatus', status);

    const qs = params.toString();
    router.replace(qs ? `/user/orders?${qs}` : `/user/orders`);
  };

  const appliedOffer = useAppSelector((state) => state.offers.appliedOffer);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    if (appliedOffer) {
      dispatch(removeOffer());
    }

    updateURL(searchTerm, orderStatus);

    const delay = setTimeout(() => {
      dispatch(
        fetchOrders({
          search_term: searchTerm || '',
          orderStatus: orderStatus || '',
        })
      );
    }, 300);

    return () => clearTimeout(delay);
  }, [dispatch, searchTerm, orderStatus]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastOrderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + CHUNK_SIZE, orders.length));
        }
      });

      observer.current.observe(node);
    },
    [orders?.length]
  );

  const hasMore = orders && visibleCount < orders.length;
  const visibleOrders = orders ? orders.slice(0, visibleCount) : [];

  if (error)
    return (
      <div className="max-w-md mt-10 flex flex-col items-center gap-3 p-6 rounded-lg bg-yellow-50 border text-yellow-700">
        <p className="font-semibold text-lg flex items-center gap-4">
          <AlertTriangle className="w-8 h-8" /> Failed to load orders
        </p>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );

  return (
    <div className="relative px-4 py-2 bg-gray-50">

      {/* FIXED SEARCH + FILTER */}
      <div className="mx-auto max-w-6xl space-y-3 bg-gray-50 pb-3 pt-2  sm:px-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
          My Orders
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-3 rounded-lg shadow-sm border">

          {/* Search */}
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search order number..."
              className="bg-transparent outline-none flex-1 text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setTimeout(() => searchRef.current?.focus(), 0);
              }}
            />
          </div>

          {/* Filter */}
          <select
            className="border rounded-lg px-3 py-2 bg-gray-50 text-gray-700 text-sm w-full sm:w-48"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PLACED">Placed</option>
            <option value="PAYMENT_INITIATED">Payment Initiated</option>
            <option value="PAYMENT_FAILED">Payment Failed</option>
            <option value="CANCELLED_BY_CUSTOMER">Cancelled</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
          </select>

        </div>
      </div>


      {/* SCROLLABLE AREA */}
      <div className="mx-auto max-w-6xl space-y-6 h-[60vh] overflow-y-auto pr-1 pb-10 scrollbar-thin scrollbar-thumb-gray-300">

        {/* OLD ORIGINAL LOADING SPINNER AT TOP */}
        {loading && (
          <div className="flex items-center justify-center">
            <div role="status" className="flex flex-col items-center">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mb-2"
                viewBox="0 0 100 101"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071Z"
                  fill="currentFill"
                />
              </svg>
              <span className="text-gray-600 text-sm">Loading...</span>
            </div>
          </div>
        )}

        {!orders || orders.length === 0 ? (
          <div className="flex justify-center items-center mt-5">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No order found</h3>
              <p className="text-gray-600">We couldn't find any orders.</p>
            </div>
          </div>
        ) : (
          visibleOrders.map((order, index) => {
            const isLastVisible = index === visibleOrders.length - 1;
            if (isLastVisible) {
              return (
                <div ref={lastOrderRef} key={order.id}>
                  <OrderCard order={order} />
                </div>
              );
            }
            return <OrderCard key={order.id} order={order} />;
          })
        )}

        {hasMore && (
          <div className="text-center py-4 text-gray-500 text-sm">Loading more orders...</div>
        )}

        {!hasMore && orders.length > 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">You've reached the end.</div>
        )}
      </div>
    </div>
  );
}

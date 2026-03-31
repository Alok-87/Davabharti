// "use client";
// import { useEffect, useRef, useState } from "react";
// import SearchError from "./SearchError";
// import SearchResultCard from "./components/SearchResultCard";

// export interface ResultType {
//   id: string;
//   product_name: string;
//   sale_price: number;
//   images?: string[];
//   slug?: string;
// }

// interface SearchClientProps {
//   initialData: ResultType[];
//   term: string;
// }

// export default function SearchClient({ initialData, term }: SearchClientProps) {
//   const [results, setResults] = useState<ResultType[]>(initialData);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const loaderRef = useRef<HTMLDivElement | null>(null);

//   // Intersection Observer
//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       const first = entries[0];
//       if (first.isIntersecting && hasMore) {
//         setPage((prev) => prev + 1);
//       }
//     });

//     const current = loaderRef.current;
//     if (current) observer.observe(current);

//     return () => {
//       if (current) observer.unobserve(current);
//       observer.disconnect(); // ✅ no null return
//     };
//   }, [hasMore]);

//   // Fetch next page
//   useEffect(() => {
//     if (page === 1) return;

//     const fetchMore = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/medicine?offset=${page}&limit=25&search_term=${term}`);
//         if (!res.ok) throw new Error("Failed to load more results");

//         const data = await res.json();
//         if (!data.results?.length) {
//           setHasMore(false);
//           return;
//         }
//         setResults((prev) => [...prev, ...data.results]);
//       } catch (err: any) {
//         setError(err.message);
//       }
//     };

//     fetchMore();
//   }, [page, term]);

//   if (error) return <SearchError message={error} />;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//      {results.map((item) => (
//   <SearchResultCard key={item.id} medicine={item} />
// ))}

//       {hasMore && <div ref={loaderRef} className="h-10" />}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import SearchResultCard from './components/SearchResultCard';

export default function SearchClient({
  initialData,
  totalCount,
  term,
}: {
  initialData: any[];
  totalCount: number;
  term: string;
}) {
  const [results, setResults] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.length < totalCount);
  const [loading, setLoading] = useState(false);

  const fetchMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/medicine?offset=${
          page * 25
        }&limit=25&search_term=${term}`
      );
      const data = await res.json();
      const newItems = data?.data?.medicines || [];

      if (newItems.length === 0) setHasMore(false);
      else {
        setResults((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-sm text-gray-600 mb-4">
        Showing {results.length.toLocaleString()} of {totalCount.toLocaleString()} results for{' '}
        <span className="font-semibold text-gray-800">{term}</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item) => (
          <SearchResultCard key={item.id} medicine={item} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={fetchMore}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </main>
  );
}

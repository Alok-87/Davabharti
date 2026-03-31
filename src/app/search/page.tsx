// 'use client';

// import { useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchMedicines } from '@/features/medicines/medicinesThunks';
// import MedicineCard from '@/components/shared/card/MedicineCard';
// import Shimmer from '@/components/shared/shimmer/Shimmer';

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const term = searchParams.get('term') || '';
//   const dispatch = useAppDispatch();
//   const { items: medicines, loading } = useAppSelector((s) => s.medicines);

//   useEffect(() => {
//     if (term.trim()) {
//       dispatch(fetchMedicines({ search_term: term, limit: 20, offset: 0 }));
//     }
//   }, [term]);

//   return (
//     <section className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-gray-800">
//         Search results for <span className="text-primary">"{term}"</span>
//       </h1>

//       {loading && medicines.length === 0 ? (
//         <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Shimmer
//               key={i}
//               className="p-2"
//               elements={[
//                 { width: 'w-full', height: 'h-40', rounded: 'rounded-lg' },
//                 { width: 'w-3/4', height: 'h-4' },
//                 { width: 'w-1/2', height: 'h-4' },
//               ]}
//             />
//           ))}
//         </div>
//       ) : medicines.length > 0 ? (
//         <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
//           {medicines.map((medicine) => {
//             const mrp = parseFloat(medicine.mrp ?? '0');
//             const salePrice = parseFloat(medicine.sale_price ?? medicine.mrp ?? '0');
//             const discount = mrp ? Math.round(((mrp - salePrice) / mrp) * 100) : 0;
//             return (
//               <MedicineCard
//                 key={medicine.id}
//                 product={{
//                   id: medicine.id,
//                   name: medicine.product_name,
//                   description: medicine.packaging_size ?? '',
//                   price: `₹${salePrice.toFixed(2)}`,
//                   mrp: mrp ? `₹${mrp.toFixed(2)}` : undefined,
//                   discount: discount > 0 ? `${discount}% OFF` : undefined,
//                   rating: 4,
//                   reviewCount: 0,
//                   imageSrc: medicine.images?.[0] ?? '/placeholder.jpg',
//                   imageAlt: medicine.product_name,
//                   in_stock: medicine.in_stock,
//                   href: '#',
//                 }}
//               />
//             );
//           })}
//         </div>
//       ) : (
//         <p className="text-gray-500 text-center mt-10">No results found.</p>
//       )}
//     </section>
//   );
// }
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchMedicinesApi } from '@/features/medicines/medicinesApi';
import MedicineCard from '@/components/shared/card/MedicineCard';
import Shimmer from '@/components/shared/shimmer/Shimmer';
import type { Medicine } from '@/features/medicines/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const term = searchParams.get('term') || '';

  // === State ===
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const limit = 20;

  // === Fetch medicines (with pagination) ===
  const fetchMedicines = useCallback(
    async (pageNumber: number, reset = false) => {
      if (!term.trim()) {
        setMedicines([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetchMedicinesApi({
          search_term: term,
          limit,
          offset: pageNumber * limit, // ✅ proper offset calculation
        });

        setMedicines((prev) =>
          reset ? res.items : [...prev, ...res.items]
        );

        setHasMore(res.items.length === limit);
      } catch (err) {
        console.error('Error fetching medicines:', err);
      } finally {
        setLoading(false);
      }
    },
    [term]
  );

  // === Reset when term changes ===
  useEffect(() => {
    setPage(0);
    fetchMedicines(0, true);
  }, [term, fetchMedicines]);

  // === Infinite scroll (IntersectionObserver) ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const next = prev + 1;
            fetchMedicines(next);
            return next;
          });
        }
      },
      { rootMargin: '300px' }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchMedicines]);

  // === Virtualization (based on window scroll) ===
  const [scrollTop, setScrollTop] = useState(0);
  const rowHeight = 320;
  const columns = 4;
  const viewportHeight =
    typeof window !== 'undefined' ? window.innerHeight : 800;

  const totalRows = Math.ceil(medicines.length / columns);
  const totalHeight = totalRows * rowHeight;
  const visibleRows = Math.ceil(viewportHeight / rowHeight);
  const startRow = Math.floor(scrollTop / rowHeight);
  const endRow = Math.min(startRow + visibleRows + 4, totalRows);

  const visibleItems = medicines.slice(startRow * columns, endRow * columns);
  const offsetY = startRow * rowHeight;

  // === Track scroll position ===
  useEffect(() => {
    const handleScroll = () => setScrollTop(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // === Render ===
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-gray-800">
        Search results for <span className="text-primary">"{term}"</span>
      </h1>

      {loading && medicines.length === 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Shimmer
              key={i}
              className="p-2"
              elements={[
                { width: 'w-full', height: 'h-40', rounded: 'rounded-lg' },
                { width: 'w-3/4', height: 'h-4' },
                { width: 'w-1/2', height: 'h-4' },
              ]}
            />
          ))}
        </div>
      ) : medicines.length > 0 ? (
        <>
          <div
            style={{
              height: `${totalHeight}px`,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: `${offsetY}px`,
                left: 0,
                right: 0,
              }}
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
            >
              {visibleItems.map((medicine) => {
                const mrp = parseFloat(medicine.mrp ?? '0');
                const salePrice = parseFloat(
                  medicine.sale_price ?? medicine.mrp ?? '0'
                );
                const discount = mrp
                  ? Math.round(((mrp - salePrice) / mrp) * 100)
                  : 0;

                return (
                  <MedicineCard
                    key={medicine.id}
                    product={{
                      id: medicine.id,
                      name: medicine.product_name,
                      description: medicine.packaging_size ?? '',
                      price: `₹${salePrice.toFixed(2)}`,
                      mrp: mrp ? `₹${mrp.toFixed(2)}` : undefined,
                      discount: discount > 0 ? `${discount}% OFF` : undefined,
                      rating: 4,
                      reviewCount: 0,
                      imageSrc: medicine.images?.[0] ?? '/no-image.png',
                      imageAlt: medicine.product_name,
                      in_stock: medicine.in_stock,
                      href: '#',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Infinite scroll trigger */}
          <div
            ref={observerRef}
            className="h-10 mt-6 flex justify-center items-center"
          >
            {loading && hasMore && (
              <p className="text-gray-500">Loading more...</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center mt-10">No results found.</p>
      )}
    </section>
  );
}

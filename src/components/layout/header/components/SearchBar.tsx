// 'use client';

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { FiSearch } from 'react-icons/fi';
// import { IoMdClose } from 'react-icons/io';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchMedicines } from "@/features/medicines/medicinesThunks"
// import { clearMedicines } from '@/features/medicines/medicinesSlice';

// /* ---------------- Custom Debounce Hook ---------------- */
// function useDebounce<T>(callback: (value: T) => void, delay: number) {
//   const callbackRef = useRef(callback);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Update callback ref when callback changes
//   useEffect(() => {
//     callbackRef.current = callback;
//   }, [callback]);

//   const debouncedCallback = useCallback((value: T) => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }

//     timeoutRef.current = setTimeout(() => {
//       callbackRef.current(value);
//     }, delay);
//   }, [delay]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   return debouncedCallback;
// }

// /* ---------------- Virtual List Hook ---------------- */
// function useVirtualList<T>({
//   items,
//   itemHeight,
//   containerHeight,
//   onLoadMore,
// }: {
//   items: T[];
//   itemHeight: number;
//   containerHeight: number;
//   onLoadMore?: () => void;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [scrollTop, setScrollTop] = useState(0);

//   const totalHeight = items.length * itemHeight;
//   const visibleCount = Math.ceil(containerHeight / itemHeight);
//   const startIndex = Math.floor(scrollTop / itemHeight);
//   const endIndex = Math.min(startIndex + visibleCount + 3, items.length); // overscan
//   const visibleItems = Array.isArray(items) ? items.slice(startIndex, endIndex) : [];

//   const handleScroll = useCallback(() => {
//     if (!containerRef.current) return;
//     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//     setScrollTop(scrollTop);

//     if (scrollTop + clientHeight >= scrollHeight - 80) {
//       onLoadMore?.();
//     }
//   }, [onLoadMore]);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, [handleScroll]);

//   return { containerRef, visibleItems, totalHeight, offsetY: startIndex * itemHeight };
// }

// /* ---------------- Main SearchBar Component ---------------- */
// export default function SearchBar() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const { items, loading } = useAppSelector((s) => s.medicines);

//   const [query, setQuery] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [offset, setOffset] = useState(0);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const LIMIT = 8;
//   const containerRef = useRef<HTMLDivElement>(null);

//   // ---------------- Debounced Search ----------------
//   const executeSearch = useCallback((term: string) => {
//     setIsTyping(false); // User stopped typing
//     if (term.trim().length > 1) {
//       setOffset(0);
//       setIsSearching(true);
//       dispatch(fetchMedicines({ search_term: term, limit: LIMIT, offset: 0 }))
//         .finally(() => setIsSearching(false));
//       setShowDropdown(true);
//     } else {
//       dispatch(clearMedicines());
//       setShowDropdown(false);
//       setIsSearching(false);
//     }
//   }, [dispatch]);

//   const debouncedSearch = useDebounce(executeSearch, 400);

//   useEffect(() => {
//     if (query.trim().length > 1) {
//       setIsSearching(false); // Reset searching state
//       setIsTyping(true); // User is typing
//     } else {
//       setIsTyping(false);
//     }

//     debouncedSearch(query);
//   }, [query, debouncedSearch]);

//   // ---------------- Infinite Scroll ----------------
//   const handleLoadMore = useCallback(() => {
//     if (!loading && items.length >= LIMIT) {
//       const nextOffset = offset + 1;
//       setOffset(nextOffset);
//       dispatch(fetchMedicines({ search_term: query, limit: LIMIT, offset: nextOffset }));
//     }
//   }, [loading, offset, query, items.length]);

//   // ---------------- Close Dropdown on Outside Click ----------------
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   const resetSearch = () => {
//     setQuery('');
//     setShowDropdown(false);
//     setIsSearching(false);
//     setIsTyping(false);
//     dispatch(clearMedicines());
//   };

//   const handleSearchSubmit = () => {
//     if (query.trim()) {
//       router.push(`/search?term=${encodeURIComponent(query)}`);
//       resetSearch();
//     }
//   };

//   // ---------------- Virtualized List ----------------
//   const ITEM_HEIGHT = 80;
//   const CONTAINER_HEIGHT = 384; // Tailwind max-h-96
//   const { containerRef: dropdownRef, visibleItems, totalHeight, offsetY } = useVirtualList({
//     items,
//     itemHeight: ITEM_HEIGHT,
//     containerHeight: CONTAINER_HEIGHT,
//     onLoadMore: handleLoadMore,
//   });
//   console.log();


//   return (
//     <div ref={containerRef} className="relative w-full">
//       {/* Search Input */}
//       <div className="w-full flex items-center">
//         <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 w-full">
//           <FiSearch className="text-gray-600 text-xl" />
//           <input
//             type="text"
//             placeholder="Search for medicines, creams, syrups..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onFocus={() => query.trim().length > 1 && setShowDropdown(true)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 e.preventDefault();
//                 handleSearchSubmit();
//               }
//             }}
//             className="flex-1 outline-none bg-transparent text-sm placeholder-gray-500 py-1"
//           />
//           {query && <IoMdClose className="text-gray-600 text-xl cursor-pointer" onClick={resetSearch} />}
//         </div>
//         <button onClick={handleSearchSubmit} className="bg-primary p-3 rounded-md ml-2 cursor-pointer">
//           <FiSearch className="text-white text-xl" />
//         </button>
//       </div>

//       {/* Dropdown */}
//       {(showDropdown || (query.trim().length === 1) || (isTyping && query.trim().length > 1)) && (
//         <div className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-100 z-50 overflow-hidden">
//           {query.trim().length === 1 && (
//             <p className="text-center py-3 text-gray-500 text-sm">
//               Type at least 2 characters to search...
//             </p>
//           )}

//           {(showDropdown || (isTyping && query.trim().length > 1)) && (
//             <>
//               {(loading || isSearching || isTyping) && items.length === 0 && (
//                 <p className="text-center py-3 text-gray-500 text-sm">
//                   {isTyping ? 'Waiting for you to stop typing...' : isSearching ? 'Searching...' : 'Loading...'}
//                 </p>
//               )}
//               {!loading && !isSearching && !isTyping && items.length === 0 && query && (
//                 <p className="text-center py-3 text-gray-500 text-sm">No results found</p>
//               )}
//             </>
//           )}

//           {(showDropdown && items.length > 0) && (
//             <div ref={dropdownRef} className="overflow-y-auto" style={{ height: CONTAINER_HEIGHT }}>
//               <div style={{ height: totalHeight, position: 'relative' }}>
//                 <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, right: 0 }}>
//                   {visibleItems.map((med) => {
//                     const discount =
//                       med.mrp && med.sale_price
//                         ? Math.round(((parseFloat(med.mrp) - parseFloat(med.sale_price)) / parseFloat(med.mrp)) * 100)
//                         : 0;

//                     const placeholderImage = "/no-image.png";

//                     // Determine a valid image source
//                     const imgSrc =
//                       med.images && med.images.length > 0 && med.images[0]?.startsWith("http") && med.images[0]?.trim() !== ""
//                         ? med.images[0]
//                         : placeholderImage;

//                     return (
//                       <Link
//                         key={med.id}
//                         href={`/medicines/${med.id}`}
//                         onClick={resetSearch}
//                         className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
//                             <img
//                               src={imgSrc}
//                               alt={med.product_name}
//                               className="object-contain w-full h-full p-1"
//                               loading="lazy"
//                               onError={(e) => {
//                                 e.currentTarget.src = placeholderImage;
//                               }}
//                             />
//                           </div>
//                           <div className="flex flex-col">
//                             <span className="font-medium text-gray-900 text-sm line-clamp-1">{med.product_name}</span>
//                             <span className="text-xs text-gray-500">{med.packaging_size}</span>
//                             <div className="flex items-center gap-2 mt-0.5">
//                               <span className="text-sm font-semibold text-gray-800">
//                                 ₹{med.sale_price ? parseFloat(med.sale_price).toFixed(2) : '0.00'}
//                               </span>
//                               {med.mrp && med.sale_price && med.mrp !== med.sale_price && (
//                                 <>
//                                   <span className="text-xs line-through text-gray-400">₹{parseFloat(med.mrp).toFixed(2)}</span>
//                                   <span className="text-xs text-green-600 font-semibold">{discount}% OFF</span>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="hidden sm:flex flex-col items-end text-xs">
//                           <span className={`${med.in_stock ? 'text-green-600' : 'text-red-500'} font-medium`}>
//                             {med.in_stock ? 'In Stock' : 'Out of Stock'}
//                           </span>
//                         </div>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           )}

//           {showDropdown && loading && items.length > 0 && (
//             <p className="text-center py-2 text-gray-500 text-xs">Loading more...</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }















'use client';

import { clearMedicines } from '@/features/medicines/medicinesSlice';
import { fetchMedicines } from '@/features/medicines/medicinesThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { useSearchParams } from 'next/navigation';




/* ---------------- Debounce Hook ---------------- */
function useDebounce<T>(callback: (value: T) => void, delay: number) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debounced = useCallback(
    (value: T) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(value), delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debounced;
}

/* ---------------- Virtual List Hook (Fixed) ---------------- */
function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  onLoadMore,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  onLoadMore?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
  const endIndex = Math.min(startIndex + visibleCount + 6, items.length);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setScrollTop(scrollTop);

    // Trigger load more when near bottom
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      onLoadMore?.();
    }
  }, [onLoadMore]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Recalculate when items grow
  useEffect(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, [items.length]);

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY: startIndex * itemHeight,
  };
}

/* ---------------- SearchBar Component ---------------- */
export default function SearchBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, loading } = useAppSelector((s) => s.medicines);

  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const LIMIT = 8;
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* ---------------- Debounced Search ---------------- */
  const executeSearch = useCallback(
    (term: string) => {
      setIsTyping(false);
      if (term.trim().length > 1) {
        setPage(0);
        setIsSearching(true);
        dispatch(fetchMedicines({ search_term: term, limit: LIMIT, offset: 0 }))
          .finally(() => setIsSearching(false));
        setShowDropdown(true);
      } else {
        dispatch(clearMedicines());
        setShowDropdown(false);
        setIsSearching(false);
      }
    },
    [dispatch]
  );

  const debouncedSearch = useDebounce(executeSearch, 400);

  useEffect(() => {
    if (query.trim().length > 1) setIsTyping(true);
    else setIsTyping(false);
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  /* ---------------- Infinite Scroll ---------------- */
  const handleLoadMore = useCallback(() => {
    if (!loading && items.length >= LIMIT * (page + 1)) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchMedicines({
        search_term: query,
        limit: LIMIT,
        offset: nextPage, // ✅ treat as page number (not record offset)
      }));
    }
  }, [loading, items.length, page, query, dispatch]);

  /* ---------------- Click Outside ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const searchParams = useSearchParams();
  const categoryNames = searchParams.get('categoryNames');
  /* ---------------- Reset & Submit ---------------- */
  const resetSearch = () => {
    setQuery('');
    setShowDropdown(false);
    setIsSearching(false);
    setIsTyping(false);

    dispatch(clearMedicines());

    dispatch(
      fetchMedicines({
        limit: 20,
        offset: 0,
        ...(categoryNames && { categoryNames }),
      })
    );
  };



  const handleSearchSubmit = () => {
    if (query.trim()) {
      router.push(`/search?term=${encodeURIComponent(query)}`);
      resetSearch();
    }
  };

  /* ---------------- Virtual List ---------------- */
  const ITEM_HEIGHT = 80;
  const CONTAINER_HEIGHT = 384;
  const { containerRef, visibleItems, totalHeight, offsetY } = useVirtualList({
    items,
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    onLoadMore: handleLoadMore,
  });






  /* ---------------- JSX ---------------- */
  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Search Input */}
      <div className="w-full flex items-center">
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 w-full">
          <FiSearch className="text-gray-600 text-xl" />
          <input
            type="text"
            placeholder="Search for medicines, creams, syrups..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 1 && setShowDropdown(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            className="flex-1 outline-none bg-transparent text-sm placeholder-gray-500 py-1"
          />
          {query && <IoMdClose className="text-gray-600 text-xl cursor-pointer" onClick={resetSearch} />}
        </div>
        {/* <button onClick={handleSearchSubmit} className="bg-primary p-3 rounded-md ml-2 cursor-pointer">
          <FiSearch className="text-white text-xl" />
        </button> */}
      </div>

      {/* Dropdown */}
      {(showDropdown || (isTyping && query.trim().length > 1)) && (
        <div className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-100 z-50 overflow-hidden">
          {/* Instruction */}
          {query.trim().length === 1 && (
            <p className="text-center py-3 text-gray-500 text-sm">
              Type at least 2 characters to search...
            </p>
          )}

          {/* Loading / Empty States */}
          {(loading || isTyping) && items.length === 0 && (
            <p className="text-center py-3 text-gray-500 text-sm">
              {isTyping ? 'Waiting for you to stop typing...' : 'Searching...'}
            </p>
          )}
          {!loading && !isTyping && items.length === 0 && query && (
            <p className="text-center py-3 text-gray-500 text-sm">No results found</p>
          )}

          {/* Virtualized Results */}
          {items.length > 0 && (
            <div ref={containerRef} className="overflow-y-auto" style={{ height: CONTAINER_HEIGHT }}>
              <div style={{ height: totalHeight, position: 'relative' }}>
                <div
                  style={{
                    transform: `translateY(${offsetY}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {visibleItems.map((med) => {
                    const discount =
                      med.mrp && med.sale_price
                        ? Math.round(((parseFloat(med.mrp) - parseFloat(med.sale_price)) / parseFloat(med.mrp)) * 100)
                        : 0;

                    const placeholder = '/no-image.png';
                    const imgSrc =
                      med.images?.[0]?.startsWith('http') && med.images[0]?.trim() !== ''
                        ? med.images[0]
                        : placeholder;

                    return (
                      <Link
                        key={med.id}
                        href={`/medicines/${med.slug}`}
                        onClick={resetSearch}
                        className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50 transition-colors h-20"
                      >
                        <div className="flex items-start gap-3">
                          {/* Image */}
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={imgSrc}
                              alt={med.product_name}
                              className="object-contain w-full h-full p-1"
                              loading="lazy"
                              onError={(e) => (e.currentTarget.src = placeholder)}
                            />
                          </div>

                          {/* Text */}
                          <div className="flex flex-col w-[220px]">
                            <span title={med.product_name} className="font-medium text-gray-900 text-sm line-clamp-1 truncate">
                              {med.product_name}
                            </span>

                            <span title={med.packaging_size} className="text-xs text-gray-500 truncate">
                              {med.packaging_size}
                            </span>

                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-semibold text-gray-800">
                                ₹{parseFloat(med.sale_price ?? '0').toFixed(2)}
                              </span>

                              {med.mrp && med.mrp !== med.sale_price && (
                                <>
                                  <span className="text-xs line-through text-gray-400 truncate">
                                    ₹{parseFloat(med.mrp).toFixed(2)}
                                  </span>
                                  <span className="text-xs text-green-600 font-semibold truncate">
                                    {discount}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stock Status */}
                        <div className="hidden sm:flex flex-col items-end text-xs">
                          <span className={`${med.in_stock ? 'text-green-600' : 'text-red-500'} font-medium truncate`}>
                            {med.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </Link>

                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {showDropdown && loading && items.length > 0 && (
            <p className="text-center py-2 text-gray-500 text-xs">Loading more...</p>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useAppSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';

function BottomNavBarMobile() {
  const pathname = usePathname();
  const { loading, data } = useAppSelector((state) => state.homepageData);
  const categories = data?.categories;
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // ✅ Show only on homepage
  if (pathname !== '/') return null;

  // ✅ Loading shimmer
  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-5 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  // Handle case where categories might be null or undefined after loading
  if (!categories || categories.length === 0) {
    return null;
  }

  // ✅ Filter: active + has subcategories
  const activeCategoriesWithSubcategories = categories
    .filter(
      (category) =>
        category?.is_active &&
        Array.isArray(category.subcategories) &&
        category.subcategories.length > 0
    )
    .slice(0, 9); // Limit to 9

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // ✅ No data (after filtering)
  if (activeCategoriesWithSubcategories.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
      <ul className="space-y-2">
        {activeCategoriesWithSubcategories.map((category, index) => (
          <li
            key={category.id}
            className="text-gray-700 border-b border-gray-100 last:border-b-0 text-start"
          >
            <button
              onClick={() => toggleDropdown(index)}
              className="w-full py-2 px-3 flex justify-between items-center hover:bg-gray-50"
            >
              {category.name}
              <IoIosArrowDown
                className={`h-4 w-4 text-gray-400 transition-transform ${activeDropdown === index ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {activeDropdown === index && (
              <ul className=" bg-gray-100 rounded-md my-1">
                {category.subcategories?.map((sub) => (
                  <li
                    key={sub.id}
                    className="py-2 px-3 text-gray-600 border-b border-gray-100 last:border-b-0"
                  >
                    <a
                      href={`/medicines?subCategoryIds=${encodeURIComponent(sub.id)}`}
                      className="block hover:text-gray-900"
                    >
                      {sub.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BottomNavBarMobile;

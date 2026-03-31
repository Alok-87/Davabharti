'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { IoIosArrowDown } from 'react-icons/io';
import { useAppSelector } from '@/store/hooks';
import usePortalRoot from '@/hooks/usePortalRoot';

interface NavCategory {
  name: string;
  items: {
    id: string;
    name: string;
    href: string;
  }[];
}

export default function BottomNavBarDesktop() {
  useEffect(() => {
    const handleScroll = () => {
      setOpenDropdown(null);
    };

    const handleResize = () => {
      setOpenDropdown(null);
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

const pathname = usePathname();
  const { loading, data } = useAppSelector((state) => state.homepageData);
  const categories = data?.categories;

  const portalRoot = usePortalRoot('dropdown-root');

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  // Show only on home page
  if (pathname !== '/') return null;

  if (loading) {
    // Optional: return a loading skeleton here
    return null;
  }

  if (!categories) {
    return null;
  }

  const activeCategories = categories
    .filter((c) => c?.is_active && Array.isArray(c.subcategories))
    .slice(0, 15);

  const navCategories: NavCategory[] = activeCategories.map((c) => ({
    name: c.name,
    items:
      c.subcategories?.map((s) => ({
        id: s.id,
        name: s.name,
        href: `/medicines?categoryNames=${encodeURIComponent(
          c.name
        )}&subCategoryNames=${encodeURIComponent(s.name)}`,
      })) || [],
  }));

  if (loading || navCategories.length === 0) return null;

  return (
    <div className="hidden lg:block bg-white border-b shadow-sm relative overflow-visible">
      {/* Horizontal scroll container */}
      <div
        className="
          w-full overflow-x-auto overflow-y-visible
          whitespace-nowrap scroll-smooth px-4 py-4
          [&::-webkit-scrollbar]:hidden
        "
      >
        <div className="flex items-center space-x-8 min-w-max">
          {navCategories.map((category, index) => (
            <div
              key={category.name}
              className="relative flex-shrink-0"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPosition({
                  left: rect.left,
                  top: rect.bottom,
                });
                setOpenDropdown(index);
              }}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {/* Category label */}
              <div className="flex items-center gap-1 text-gray-800 font-medium text-sm cursor-pointer whitespace-nowrap hover:text-blue-600 transition">
                {category.name}
                <IoIosArrowDown
                  className={`h-3 w-3 transition-transform ${openDropdown === index ? 'rotate-180' : ''
                    }`}
                />
              </div>

              {/* Dropdown (PORTAL) */}
              {openDropdown === index &&
                portalRoot &&
                createPortal(
                  <div
                    className="bg-white shadow-lg border border-gray-200 rounded-md w-56 py-2 z-1"
                    style={{
                      position: 'fixed',
                      left: position.left,
                      top: position.top,
                    }}
                  >
                    {category.items.map((item) => (
                      <a
                        key={item.id}
                        href={item.href}
                        title={item.name}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap truncate max-w-[250px]"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>,
                  portalRoot
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

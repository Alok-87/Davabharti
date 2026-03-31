// 'use client';
// import React, { useEffect } from 'react';
// import CategoryCarousel from './CategoryCarousel';
// import must_have from '@/assets/skin_care.webp';
// import Image from 'next/image';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchCategories } from '@/features/categories/categoriesThunks';

// const CategorySection = () => {
//   const dispatch = useAppDispatch();
//   const { items: categories } = useAppSelector((s) => s.categories);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   return (
//     <div className="py-12 bg-white sm:py-16 lg:py-20">
//       <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-18">
//         <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
//           Shop by <span className="text-primary">Categories</span>
//         </h2>

//         {/* ✅ Static grid for SEO */}
//         <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 sr-only">
//           {categories.map((category) => (
//             <div
//               key={category.id}
//               className="flex flex-col items-center text-center p-4 transition"
//             >
//               {/* ✅ Correct Next.js Image usage */}
//               <div className="relative w-32 h-32 mb-3 border border-gray-200 rounded-md overflow-hidden">
//                 <Image
//                   src={must_have}
//                   alt={category.name}
//                   fill
//                   priority // 👈 boolean, not string or false
//                   sizes="(max-width: 768px) 100vw, 33vw"
//                   className="object-cover p-4"
//                 />
//               </div>
//               <p className="text-gray-800 font-medium">{category.name}</p>
//             </div>
//           ))}
//         </div>

//         {/* ✅ Carousel view */}
//         <div>
//           <CategoryCarousel categories={categories} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategorySection;




'use client';

import CategoryCarousel from './CategoryCarousel';
import must_have from '@/assets/skin_care.webp';
import Image from 'next/image';
import { HomePageResponse } from '@/features/homepage/homepage';

type Category = NonNullable<HomePageResponse['categories']>[0];

const CategorySection = ({ categories }: { categories: Category[] }) => {
  const safeCategories = Array.isArray(categories) ? categories : [];

  if (safeCategories.length === 0) {
    return (
      <div className="py-12 bg-white sm:py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-18">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Shop by <span className="text-primary">Categories</span>
          </h2>
          <div className="flex justify-center">
            <div className="text-gray-600">No categories available.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Shop by <span className="text-primary">Categories</span>
        </h2>

        {/* ✅ Static grid for SEO - Safe mapping */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:g:rid-cols-5 sr-only">
          {safeCategories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center text-center p-4 transition"
            >
              {/* ✅ Correct Next.js Image usage */}
              <div className="relative w-32 h-32 mb-3 border border-gray-200 rounded-md overflow-hidden">
                <Image
                  src={must_have}
                  alt={category.name || 'Category image'}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover p-4"
                />
              </div>
              <p className="text-gray-800 font-medium">{category.name}</p>
            </div>
          ))}
        </div>

        {/* ✅ Carousel view */}
        <div>
          <CategoryCarousel categories={safeCategories} />
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
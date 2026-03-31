// 'use client';

// import { memo, useEffect } from 'react';
// import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchCategories } from '@/features/categories/categoriesThunks';

// export type FilterOption = { value: string; label: string };
// export type FilterSection = { id: string; name: string; options: FilterOption[] };
// export type AppliedFilters = Record<string, string[]>;

// interface FilterProps {
//   appliedFilters: AppliedFilters;
//   setAppliedFilters: (f: AppliedFilters) => void;
//   tempFilters: AppliedFilters;
//   setTempFilters: (f: AppliedFilters) => void;
//   mobileFiltersOpen: boolean;
//   setMobileFiltersOpen: (open: boolean) => void;
// }

// const Checkbox = memo(
//   ({
//     id,
//     value,
//     label,
//     checked,
//     onChange,
//   }: {
//     id: string;
//     value: string;
//     label: string;
//     checked: boolean;
//     onChange: () => void;
//   }) => (
//     <div className="flex items-center gap-2">
//       <input
//         type="checkbox"
//         id={id}
//         checked={checked}
//         onChange={onChange}
//         className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//       />
//       <label htmlFor={id} className="text-sm text-gray-700">
//         {label}
//       </label>
//     </div>
//   )
// );

// export let filterSections: FilterSection[] = [];

// const Filter = ({
//   appliedFilters,
//   setAppliedFilters,
//   tempFilters,
//   setTempFilters,
//   mobileFiltersOpen,
//   setMobileFiltersOpen,
// }: FilterProps) => {
//   const dispatch = useAppDispatch();
//   const { items: categories } = useAppSelector((state) => state.categories);

//   useEffect(() => {
//     if (categories.length === 0) dispatch(fetchCategories());
//   }, [categories.length, dispatch]);

//   // Build filter sections dynamically
//   filterSections = [
//     {
//       id: 'category',
//       name: 'Category',
//       options: categories.map((c) => ({ value: c.id, label: c.name })),
//     },
//     {
//       id: 'condition',
//       name: 'Health Condition',
//       options: [
//         { value: 'diabetes', label: 'Diabetes' },
//         { value: 'hypertension', label: 'Hypertension' },
//         { value: 'cold-flu', label: 'Cold & Flu' },
//         { value: 'pain-relief', label: 'Pain Relief' },
//         { value: 'skin-care', label: 'Skin Care' },
//       ],
//     },
//     {
//       id: 'brand',
//       name: 'Brand',
//       options: [
//         { value: 'dabur', label: 'Dabur' },
//         { value: 'himalaya', label: 'Himalaya' },
//         { value: 'patanjali', label: 'Patanjali' },
//         { value: 'cipla', label: 'Cipla' },
//         { value: 'sun-pharma', label: 'Sun Pharma' },
//       ],
//     },
//     {
//       id: 'form',
//       name: 'Dosage Form',
//       options: [
//         { value: 'tablet', label: 'Tablet' },
//         { value: 'capsule', label: 'Capsule' },
//         { value: 'syrup', label: 'Syrup' },
//         { value: 'ointment', label: 'Ointment' },
//         { value: 'injection', label: 'Injection' },
//       ],
//     },
//   ];

//   const toggleTempOption = (sectionId: string, value: string) => {
//     const updated = { ...tempFilters };
//     if (!updated[sectionId]) updated[sectionId] = [];
//     updated[sectionId] = updated[sectionId].includes(value)
//       ? updated[sectionId].filter((v) => v !== value)
//       : [...updated[sectionId], value];
//     if (updated[sectionId].length === 0) delete updated[sectionId];
//     setTempFilters(updated);
//   };

//   const toggleAppliedOption = (sectionId: string, value: string) => {
//     const updated = { ...appliedFilters };
//     if (!updated[sectionId]) updated[sectionId] = [];
//     updated[sectionId] = updated[sectionId].includes(value)
//       ? updated[sectionId].filter((v) => v !== value)
//       : [...updated[sectionId], value];
//     if (updated[sectionId].length === 0) delete updated[sectionId];
//     setAppliedFilters(updated);
//   };

//   const applyFilters = () => {
//     setAppliedFilters({ ...tempFilters });
//     setMobileFiltersOpen(false);
//   };

//   return (
//     <div className="rounded-md p-2">
//       {/* Mobile Modal */}
//       <Dialog
//         open={mobileFiltersOpen}
//         onClose={() => setMobileFiltersOpen(false)}
//         className="relative z-40 lg:hidden"
//       >
//         <DialogBackdrop className="fixed inset-0 bg-black/25" />
//         <div className="fixed inset-0 z-40 flex">
//           <DialogPanel className="relative ml-auto max-w-xs w-full bg-white p-4 shadow-xl flex flex-col overflow-y-auto">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-medium text-gray-900">Filters</h2>
//               <button
//                 onClick={() => setMobileFiltersOpen(false)}
//                 className="p-2 text-gray-400 hover:text-gray-600"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>
//             <form className="mt-4 space-y-4">
//               {filterSections.map((section) => (
//                 <div key={section.id}>
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">{section.name}</h3>
//                   <div className="space-y-2">
//                     {section.options.map((option, idx) => (
//                       <Checkbox
//                         key={option.value}
//                         id={`mobile-${section.id}-${idx}`}
//                         value={option.value}
//                         label={option.label}
//                         checked={tempFilters[section.id]?.includes(option.value) ?? false}
//                         onChange={() => toggleTempOption(section.id, option.value)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </form>
//             <button
//               onClick={applyFilters}
//               className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
//             >
//               Apply Filters
//             </button>
//           </DialogPanel>
//         </div>
//       </Dialog>

//       {/* Desktop Filters */}
//       <div className="hidden lg:block space-y-4">
//         {filterSections.map((section) => (
//           <div key={section.id}>
//             <h3 className="text-sm font-medium text-gray-700 mb-2">{section.name}</h3>
//             <div className="space-y-2">
//               {section.options.map((option, idx) => (
//                 <Checkbox
//                   key={option.value}
//                   id={`desktop-${section.id}-${idx}`}
//                   value={option.value}
//                   label={option.label}
//                   checked={appliedFilters[section.id]?.includes(option.value) ?? false}
//                   onChange={() => toggleAppliedOption(section.id, option.value)}
//                 />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Mobile Filter Button */}
//       <div className="lg:hidden mt-2">
//         <button
//           type="button"
//           onClick={() => setMobileFiltersOpen(true)}
//           className="inline-flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md"
//         >
//           Filters
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="currentColor"
//             className="size-6"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Filter;


'use client';

import { memo, useEffect, useState, useMemo } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories } from '@/features/categories/categoriesThunks';

export type FilterOption = { value: string; label: string };
export type FilterSection = { id: string; name: string; options: FilterOption[] };
export type AppliedFilters = Record<string, string[]>;

interface FilterProps {
  appliedFilters: AppliedFilters;
  setAppliedFilters: (f: AppliedFilters) => void;
  tempFilters: AppliedFilters;
  setTempFilters: (f: AppliedFilters) => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
}

const Checkbox = memo(
  ({
    id,
    label,
    checked,
    onChange,
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <label htmlFor={id} className="text-sm text-gray-700">
        {label}
      </label>
    </div>
  )
);

const Filter = ({
  appliedFilters,
  setAppliedFilters,
  tempFilters,
  setTempFilters,
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: FilterProps) => {
  const dispatch = useAppDispatch();
  const { items: categories } = useAppSelector((state) => state.categories);

  const [subCategoryOptions, setSubCategoryOptions] = useState<FilterOption[]>([]);

  // Fetch categories once
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories.length, dispatch]);

  // Build sub-category options based on selected category IDs
  useEffect(() => {
    const selectedCategoryIds = appliedFilters['category'] || [];

    if (selectedCategoryIds.length === 0) {
      setSubCategoryOptions([]);

      // Clear subCategory filter if no category selected
      if (appliedFilters['subCategory']) {
        setAppliedFilters((prev) => {
          const updated = { ...prev };
          delete updated['subCategory'];
          return updated;
        });
      }
      return;
    }

    const all: FilterOption[] = [];

    selectedCategoryIds.forEach((catId) => {
      const category = categories.find((c) => c.id === catId);
      category?.subcategories?.forEach((s: any) => {
        all.push({ value: s.id, label: s.name });
      });
    });

    // Deduplicate
    const unique = all.filter(
      (s, i, self) => i === self.findIndex((x) => x.value === s.value)
    );

    setSubCategoryOptions(unique);
  }, [appliedFilters, categories, setAppliedFilters]);

  // Build filter sections (LOCAL, MEMOIZED)
  const filterSections: FilterSection[] = useMemo(
    () => [
      {
        id: 'category',
        name: 'Category',
        options: categories.map((c) => ({
          value: c.id,
          label: c.name,
        })),
      },
      {
        id: 'subCategory',
        name: 'Sub Category',
        options: subCategoryOptions,
      },
      {
        id: 'condition',
        name: 'Health Condition',
        options: [
          { value: 'diabetes', label: 'Diabetes' },
          { value: 'hypertension', label: 'Hypertension' },
          { value: 'cold-flu', label: 'Cold & Flu' },
          { value: 'pain-relief', label: 'Pain Relief' },
          { value: 'skin-care', label: 'Skin Care' },
        ],
      },
      {
        id: 'brand',
        name: 'Brand',
        options: [
          { value: 'dabur', label: 'Dabur' },
          { value: 'himalaya', label: 'Himalaya' },
          { value: 'patanjali', label: 'Patanjali' },
          { value: 'cipla', label: 'Cipla' },
          { value: 'sun-pharma', label: 'Sun Pharma' },
        ],
      },
      {
        id: 'form',
        name: 'Dosage Form',
        options: [
          { value: 'tablet', label: 'Tablet' },
          { value: 'capsule', label: 'Capsule' },
          { value: 'syrup', label: 'Syrup' },
          { value: 'ointment', label: 'Ointment' },
          { value: 'injection', label: 'Injection' },
        ],
      },
    ],
    [categories, subCategoryOptions]
  );

  const toggleTempOption = (sectionId: string, value: string) => {
    const updated = { ...tempFilters };
    if (!updated[sectionId]) updated[sectionId] = [];

    updated[sectionId] = updated[sectionId].includes(value)
      ? updated[sectionId].filter((v) => v !== value)
      : [...updated[sectionId], value];

    if (updated[sectionId].length === 0) delete updated[sectionId];

    setTempFilters(updated);
  };

  const toggleAppliedOption = (sectionId: string, value: string) => {
    const updated = { ...appliedFilters };
    if (!updated[sectionId]) updated[sectionId] = [];

    updated[sectionId] = updated[sectionId].includes(value)
      ? updated[sectionId].filter((v) => v !== value)
      : [...updated[sectionId], value];

    if (updated[sectionId].length === 0) delete updated[sectionId];

    setAppliedFilters(updated);
  };

  const applyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setMobileFiltersOpen(false);
  };

  useEffect(() => {
    if (mobileFiltersOpen) {
      setTempFilters(appliedFilters);
    }
  }, [mobileFiltersOpen, appliedFilters, setTempFilters]);

  return (
    <div className="rounded-md p-2">
      {/* Mobile Modal */}
      <Dialog
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        className="relative z-40 lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative ml-auto max-w-xs w-full bg-white p-4 shadow-xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form className="mt-4 space-y-4">
              {filterSections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {section.name}
                  </h3>
                  <div className="space-y-2">
                    {section.options.map((option, idx) => (
                      <Checkbox
                        key={option.value}
                        id={`mobile-${section.id}-${idx}`}
                        label={option.label}
                        checked={tempFilters[section.id]?.includes(option.value) ?? false}
                        onChange={() => toggleTempOption(section.id, option.value)}
                      />
                    ))}
                    {section.id === 'subCategory' && section.options.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        Select a category to see sub-categories
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </form>

            <button
              onClick={applyFilters}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Apply Filters
            </button>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-4">
        {filterSections.map((section) => (
          <div key={section.id}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {section.name}
            </h3>
            <div className="space-y-2">
              {section.options.map((option, idx) => (
                <Checkbox
                  key={option.value}
                  id={`desktop-${section.id}-${idx}`}
                  label={option.label}
                  checked={appliedFilters[section.id]?.includes(option.value) ?? false}
                  onChange={() => toggleAppliedOption(section.id, option.value)}
                />
              ))}
              {section.id === 'subCategory' && section.options.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Select a category to see sub-categories
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Mobile Button ---------------- */}
      <div className="lg:hidden mt-2">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md"
        >
          Filters
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Filter;
